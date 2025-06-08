import { createClient } from '@/utils/supabase/server';
import { randomUUID } from 'crypto';

export interface NotificationData {
  titulo: string;
  descripcion: string;
  tipo: 'project' | 'announcement' | 'reminder';
  userIds: string[]; // Array of user IDs to send notification to
}

/**
 * Creates a notification and sends it to specified users
 */
export async function createNotification(notificationData: NotificationData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const timestamp = new Date().toISOString();
    const notificationId = randomUUID();

    // Insert into notificaciones table
    const { error: notificationError } = await supabase
      .from('notificaciones')
      .insert({
        id: notificationId,
        titulo: notificationData.titulo,
        descripcion: notificationData.descripcion,
        tipo: notificationData.tipo,
        fecha: timestamp
      });

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      return { success: false, error: 'Failed to create notification' };
    }

    // Insert into usuarios_notificaciones for each user
    const userNotifications = notificationData.userIds.map(userId => ({
      id: randomUUID(),
      id_usuario: userId,
      id_notificacion: notificationId,
      leido: false,
      fecha_creacion: timestamp
    }));

    const { error: userNotificationError } = await supabase
      .from('usuarios_notificaciones')
      .insert(userNotifications);

    if (userNotificationError) {
      console.error('Error creating user notifications:', userNotificationError);
      return { success: false, error: 'Failed to link notifications to users' };
    }

    console.log(`Notification created successfully for ${notificationData.userIds.length} users`);
    return { success: true };
  } catch (error) {
    console.error('Unexpected error creating notification:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Creates notification for project deadline approaching (within 7 days)
 */
export async function createProjectDeadlineNotification(projectId: string, projectTitle: string, daysRemaining: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get all users assigned to this project
    const { data: assignedUsers, error: usersError } = await supabase
      .from('usuarios_proyectos')
      .select('id_usuario')
      .eq('id_proyecto', projectId);

    if (usersError) {
      console.error('Error fetching assigned users:', usersError);
      return { success: false, error: 'Failed to fetch assigned users' };
    }

    if (!assignedUsers || assignedUsers.length === 0) {
      console.log(`No users assigned to project ${projectId}, skipping deadline notification`);
      return { success: true };
    }

    const userIds = assignedUsers.map(user => user.id_usuario);

    const notificationData: NotificationData = {
      titulo: 'Proyecto próximo a vencer',
      descripcion: `El proyecto "${projectTitle}" vence en ${daysRemaining} ${daysRemaining === 1 ? 'día' : 'días'}. Revisa tu progreso y completa las tareas pendientes.`,
      tipo: 'reminder',
      userIds
    };

    return await createNotification(notificationData);
  } catch (error) {
    console.error('Error creating project deadline notification:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Creates notification for user assignment to new project
 */
export async function createProjectAssignmentNotification(
  userId: string, 
  projectTitle: string, 
  roleName: string,
  assignedBy?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    let description = `Has sido asignado al proyecto "${projectTitle}" con el rol de ${roleName}.`;
    
    if (assignedBy) {
      const supabase = await createClient();
      const { data: assignerData, error: assignerError } = await supabase
        .from('usuarios')
        .select('nombre, apellido')
        .eq('id_usuario', assignedBy)
        .single();

      if (!assignerError && assignerData) {
        const assignerName = `${assignerData.nombre} ${assignerData.apellido || ''}`.trim();
        description = `${assignerName} te ha asignado al proyecto "${projectTitle}" con el rol de ${roleName}.`;
      }
    }

    const notificationData: NotificationData = {
      titulo: 'Nuevo proyecto asignado',
      descripcion: description,
      tipo: 'project',
      userIds: [userId]
    };

    return await createNotification(notificationData);
  } catch (error) {
    console.error('Error creating project assignment notification:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Creates notification for feedback received
 */
export async function createFeedbackReceivedNotification(
  userId: string,
  projectTitle: string,
  feedbackAuthor: string,
  rating: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get feedback author details
    const { data: authorData, error: authorError } = await supabase
      .from('usuarios')
      .select('nombre, apellido')
      .eq('id_usuario', feedbackAuthor)
      .single();

    let authorName = 'Un compañero';
    if (!authorError && authorData) {
      authorName = `${authorData.nombre} ${authorData.apellido || ''}`.trim();
    }

    const ratingText = rating >= 4 ? 'excelente' : rating >= 3 ? 'buena' : 'constructiva';

    const notificationData: NotificationData = {
      titulo: 'Nueva retroalimentación recibida',
      descripcion: `${authorName} ha dejado una retroalimentación ${ratingText} sobre tu trabajo en el proyecto "${projectTitle}".`,
      tipo: 'project',
      userIds: [userId]
    };

    return await createNotification(notificationData);
  } catch (error) {
    console.error('Error creating feedback notification:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Creates notification for user level/role change
 */
export async function createLevelChangeNotification(
  userId: string,
  newLevelTitle: string,
  changedBy?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    let description = `Tu nivel ha sido actualizado a ${newLevelTitle}. Revisa tus nuevos permisos y responsabilidades.`;
    
    if (changedBy) {
      const supabase = await createClient();
      const { data: changerData, error: changerError } = await supabase
        .from('usuarios')
        .select('nombre, apellido')
        .eq('id_usuario', changedBy)
        .single();

      if (!changerError && changerData) {
        const changerName = `${changerData.nombre} ${changerData.apellido || ''}`.trim();
        description = `${changerName} ha actualizado tu nivel a ${newLevelTitle}. Revisa tus nuevos permisos y responsabilidades.`;
      }
    }

    const notificationData: NotificationData = {
      titulo: 'Nivel actualizado',
      descripcion: description,
      tipo: 'announcement',
      userIds: [userId]
    };

    return await createNotification(notificationData);
  } catch (error) {
    console.error('Error creating level change notification:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Checks for projects with approaching deadlines and creates notifications
 * This function should be called periodically (e.g., daily via cron job)
 */
export async function checkProjectDeadlines(): Promise<{ success: boolean; notificationsCreated: number; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Calculate date 7 days from now
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    // Format dates for SQL comparison
    const todayStr = today.toISOString().split('T')[0];
    const sevenDaysStr = sevenDaysFromNow.toISOString().split('T')[0];

    // Get active projects with deadlines within 7 days
    const { data: projects, error: projectsError } = await supabase
      .from('proyectos')
      .select('id_proyecto, titulo, fecha_fin')
      .eq('activo', true)
      .not('fecha_fin', 'is', null)
      .gte('fecha_fin', todayStr)
      .lte('fecha_fin', sevenDaysStr);

    if (projectsError) {
      console.error('Error fetching projects with approaching deadlines:', projectsError);
      return { success: false, notificationsCreated: 0, error: 'Failed to fetch projects' };
    }

    if (!projects || projects.length === 0) {
      console.log('No projects with approaching deadlines found');
      return { success: true, notificationsCreated: 0 };
    }

    let notificationsCreated = 0;
    
    for (const project of projects) {
      if (!project.fecha_fin) continue;
      
      const deadline = new Date(project.fecha_fin);
      const timeDiff = deadline.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      // Only create notification if exactly 7, 3, or 1 days remaining
      if ([7, 3, 1].includes(daysRemaining)) {
        const result = await createProjectDeadlineNotification(
          project.id_proyecto,
          project.titulo,
          daysRemaining
        );
        
        if (result.success) {
          notificationsCreated++;
          console.log(`Created deadline notification for project ${project.titulo} (${daysRemaining} days remaining)`);
        } else {
          console.error(`Failed to create deadline notification for project ${project.titulo}:`, result.error);
        }
      }
    }

    return { success: true, notificationsCreated };
  } catch (error) {
    console.error('Error checking project deadlines:', error);
    return { success: false, notificationsCreated: 0, error: 'Unexpected error occurred' };
  }
}

/**
 * Marks a notification as read for a specific user
 */
export async function markNotificationAsRead(
  userId: string,
  userNotificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('usuarios_notificaciones')
      .update({ leido: true })
      .eq('id', userNotificationId)
      .eq('id_usuario', userId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Marks all notifications as read for a specific user
 */
export async function markAllNotificationsAsRead(
  userId: string
): Promise<{ success: boolean; error?: string; updated?: number }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('usuarios_notificaciones')
      .update({ leido: true })
      .eq('id_usuario', userId)
      .eq('leido', false)
      .select('id');

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error: error.message };
    }

    return { success: true, updated: data?.length || 0 };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Deletes old notifications (older than specified days)
 */
export async function cleanupOldNotifications(
  daysOld: number = 30
): Promise<{ success: boolean; error?: string; deleted?: number }> {
  try {
    const supabase = await createClient();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // First delete from usuarios_notificaciones
    const { data: userNotifications } = await supabase
      .from('usuarios_notificaciones')
      .select('id_notificacion')
      .lt('fecha_creacion', cutoffDate.toISOString());

    if (userNotifications && userNotifications.length > 0) {
      const { error: deleteUserNotifError } = await supabase
        .from('usuarios_notificaciones')
        .delete()
        .lt('fecha_creacion', cutoffDate.toISOString());

      if (deleteUserNotifError) {
        console.error('Error deleting old user notifications:', deleteUserNotifError);
        return { success: false, error: deleteUserNotifError.message };
      }

      // Then delete orphaned notifications
      const notificationIds = [...new Set(userNotifications.map(un => un.id_notificacion))];
      
      const { data: deletedNotifications, error: deleteNotifError } = await supabase
        .from('notificaciones')
        .delete()
        .in('id', notificationIds)
        .select('id');

      if (deleteNotifError) {
        console.error('Error deleting old notifications:', deleteNotifError);
        return { success: false, error: deleteNotifError.message };
      }

      return { success: true, deleted: deletedNotifications?.length || 0 };
    }

    return { success: true, deleted: 0 };
  } catch (error) {
    console.error('Error cleaning up old notifications:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Gets notification statistics for a user
 */
export async function getNotificationStats(
  userId: string
): Promise<{ success: boolean; error?: string; stats?: { total: number; unread: number; recent: number } }> {
  try {
    const supabase = await createClient();

    // Get total notifications
    const { count: total, error: totalError } = await supabase
      .from('usuarios_notificaciones')
      .select('*', { count: 'exact', head: true })
      .eq('id_usuario', userId);

    if (totalError) {
      return { success: false, error: totalError.message };
    }

    // Get unread notifications
    const { count: unread, error: unreadError } = await supabase
      .from('usuarios_notificaciones')
      .select('*', { count: 'exact', head: true })
      .eq('id_usuario', userId)
      .eq('leido', false);

    if (unreadError) {
      return { success: false, error: unreadError.message };
    }

    // Get recent notifications (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recent, error: recentError } = await supabase
      .from('usuarios_notificaciones')
      .select('*', { count: 'exact', head: true })
      .eq('id_usuario', userId)
      .gte('fecha_creacion', sevenDaysAgo.toISOString());

    if (recentError) {
      return { success: false, error: recentError.message };
    }

    return {
      success: true,
      stats: {
        total: total || 0,
        unread: unread || 0,
        recent: recent || 0
      }
    };
  } catch (error) {
    console.error('Error getting notification stats:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}
