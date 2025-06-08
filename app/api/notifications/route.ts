/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { markNotificationAsRead, markAllNotificationsAsRead, getNotificationStats } from '@/utils/notifications/notificationService';

interface NotificationData {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  fecha: string;
}

interface UserNotification {
  id: string;
  leido: boolean;
  fecha_creacion: string;
  notificaciones: NotificationData;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's notifications with read status
    const { data: notifications, error } = await supabase
      .from('usuarios_notificaciones')
      .select(`
        id,
        leido,
        fecha_creacion,
        notificaciones(
          id,
          titulo,
          descripcion,
          tipo,
          fecha
        )
      `)
      .eq('id_usuario', user.id)
      .order('fecha_creacion', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json({ error: 'Error fetching notifications' }, { status: 500 });
    }

    // Transform to match UI format
    const formattedNotifications = notifications?.map(userNotif => {
      // Handle case where notificaciones might be an array (relationship issue)
      const notification = Array.isArray(userNotif.notificaciones) 
        ? userNotif.notificaciones[0] 
        : userNotif.notificaciones;
      
      if (!notification) return null;
      
      return {
        id: userNotif.id,
        title: notification.titulo,
        message: notification.descripcion,
        date: new Date(notification.fecha),
        read: userNotif.leido,
        type: notification.tipo as 'project' | 'announcement' | 'reminder'
      };
    }).filter(Boolean) || [];

    return NextResponse.json(formattedNotifications);
  } catch (error) {
    console.error('Unexpected error in notifications GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationId, markAsRead } = await request.json();

    if (!notificationId || typeof markAsRead !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: notificationId and markAsRead' },
        { status: 400 }
      );
    }

    if (markAsRead) {
      const result = await markNotificationAsRead(user.id, notificationId);
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    } else {
      // Handle marking as unread using direct DB call (not common but supported)
      const { error } = await supabase
        .from('usuarios_notificaciones')
        .update({ leido: false })
        .eq('id', notificationId)
        .eq('id_usuario', user.id);

      if (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json({ error: 'Error updating notification' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in notifications PATCH:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { markAllAsRead, getStats } = await request.json();

    if (markAllAsRead) {
      const result = await markAllNotificationsAsRead(user.id);
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        updated: result.updated 
      });
    }

    if (getStats) {
      const result = await getNotificationStats(user.id);
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        stats: result.stats 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Unexpected error in notifications POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
