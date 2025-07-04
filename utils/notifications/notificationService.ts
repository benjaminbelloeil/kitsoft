import { createClient } from '@/utils/supabase/server';

export interface NotificationData {
  titulo: string;
  descripcion: string;
  tipo: 'project' | 'announcement' | 'reminder' | 'workload_low' | 'workload_overload' | 'no_people_lead' | 'welcome';
  userIds: string[]; // Array of user IDs to send notification to
}

/**
 * Creates a notification and sends it to specified users
 */
export async function createNotification(notificationData: NotificationData): Promise<{ success: boolean; error?: string }> {
  try {
    // Input validation
    if (!notificationData.titulo || notificationData.titulo.length > 255) {
      return { success: false, error: 'Invalid title' };
    }
    if (!notificationData.descripcion || notificationData.descripcion.length > 1000) {
      return { success: false, error: 'Invalid description' };
    }
    if (!Array.isArray(notificationData.userIds) || notificationData.userIds.length === 0) {
      return { success: false, error: 'Invalid user IDs' };
    }

    const supabase = await createClient();
    const timestamp = new Date().toISOString();
    const notificationId = crypto.randomUUID();

    // Insert into notificaciones table
    const { error: notificationError } = await supabase
      .from('notificaciones')
      .insert({
        id_notificacion: notificationId,
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
      id_usuario: userId,
      id_notificacion: notificationId,
      leido: false
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
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('usuarios_notificaciones')
      .update({ leido: true, fecha_leido: new Date().toISOString() })
      .eq('id_notificacion', notificationId)
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

/**
 * Interface for user workload data
 */
interface UserWorkloadData {
  id_usuario: string;
  nombre: string;
  apellido: string;
  workloadPercentage: number;
  totalHoursPerWeek: number;
  assignedHours: number;
}

/**
 * Calculate workload percentage for a specific user
 */
async function calculateUserWorkload(userId: string): Promise<UserWorkloadData | null> {
  try {
    const supabase = await createClient();

    // Get user information
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('nombre, apellido')
      .eq('id_usuario', userId)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user data:', userError);
      return null;
    }

    // Get user's active project assignments directly
    const { data: userProjects, error: projectsError } = await supabase
      .from('usuarios_proyectos')
      .select(`
        horas,
        proyectos (
          fecha_inicio,
          fecha_fin,
          activo
        )
      `)
      .eq('id_usuario', userId);

    if (projectsError) {
      console.error('Error fetching user projects:', projectsError);
      return null;
    }

    // Filter for active projects and calculate workload
    let totalAssignedHours = 0;
    
    for (const projectAssignment of userProjects || []) {
      const project = Array.isArray(projectAssignment.proyectos) 
        ? projectAssignment.proyectos[0] 
        : projectAssignment.proyectos;
      
      // Skip if project is not active or data is missing
      if (!project || !project.activo || !projectAssignment.horas) continue;
      
      const startDate = new Date(project.fecha_inicio);
      const endDate = project.fecha_fin ? new Date(project.fecha_fin) : new Date();
      
      // Calculate working days (Monday-Friday only)
      let workingDays = 0;
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          workingDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      workingDays = Math.max(workingDays, 1);
      const hoursPerDay = projectAssignment.horas / workingDays;
      const hoursPerWeek = hoursPerDay * 5;
      
      totalAssignedHours += hoursPerWeek;
    }

    const totalHoursPerWeek = 40; // Standard work week
    const workloadPercentage = Math.min(100, Math.round((totalAssignedHours / totalHoursPerWeek) * 100));

    return {
      id_usuario: userId,
      nombre: userData.nombre,
      apellido: userData.apellido,
      workloadPercentage,
      totalHoursPerWeek,
      assignedHours: totalAssignedHours
    };
  } catch (error) {
    console.error('Error calculating user workload:', error);
    return null;
  }
}

/**
 * Get all team members for a People Lead
 */
async function getPeopleLeadTeamMembers(peopleLeadId: string): Promise<string[]> {
  try {
    const supabase = await createClient();

    const { data: teamMembers, error } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('id_peoplelead', peopleLeadId);

    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }

    return teamMembers?.map(member => member.id_usuario) || [];
  } catch (error) {
    console.error('Error getting team members:', error);
    return [];
  }
}

/**
 * Creates notification for People Lead when team member has low workload (below 50%)
 */
export async function createLowWorkloadNotification(
  peopleLeadId: string,
  teamMemberData: UserWorkloadData
): Promise<{ success: boolean; error?: string }> {
  try {
    const fullName = `${teamMemberData.nombre} ${teamMemberData.apellido || ''}`.trim();
    
    const notificationData: NotificationData = {
      titulo: 'Empleado con baja carga de trabajo',
      descripcion: `${fullName} tiene una cargabilidad del ${teamMemberData.workloadPercentage}% (${teamMemberData.assignedHours.toFixed(1)}h semanales de ${teamMemberData.totalHoursPerWeek}h). Considera asignar proyectos adicionales para optimizar su productividad.`,
      tipo: 'workload_low',
      userIds: [peopleLeadId]
    };

    return await createNotification(notificationData);
  } catch (error) {
    console.error('Error creating low workload notification:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Creates notification for People Lead when team member has overload (above 80%)
 */
export async function createOverloadNotification(
  peopleLeadId: string,
  teamMemberData: UserWorkloadData
): Promise<{ success: boolean; error?: string }> {
  try {
    const fullName = `${teamMemberData.nombre} ${teamMemberData.apellido || ''}`.trim();
    
    const notificationData: NotificationData = {
      titulo: 'Empleado sobrecargado',
      descripcion: `${fullName} tiene una cargabilidad del ${teamMemberData.workloadPercentage}% (${teamMemberData.assignedHours.toFixed(1)}h semanales de ${teamMemberData.totalHoursPerWeek}h). Considera redistribuir la carga de trabajo para evitar burnout.`,
      tipo: 'workload_overload',
      userIds: [peopleLeadId]
    };

    return await createNotification(notificationData);
  } catch (error) {
    console.error('Error creating overload notification:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Check workload for all users and send notifications to People Leads
 * This function should be called periodically (e.g., daily or weekly)
 */
export async function checkWorkloadAndNotify(): Promise<{ success: boolean; error?: string; processed?: number; notifications?: number }> {
  try {
    const supabase = await createClient();
    
    // Get People Lead level ID first (numero = 2)
    const { data: peopleLeadLevel, error: levelError } = await supabase
      .from('niveles')
      .select('id_nivel')
      .eq('numero', 2)
      .single();
      
    if (levelError || !peopleLeadLevel) {
      console.error('Error finding People Lead level:', levelError);
      return { success: false, error: 'Failed to find People Lead level' };
    }

    // Get users with People Lead level from usuarios_niveles
    const { data: userNiveles, error: userNivelesError } = await supabase
      .from('usuarios_niveles')
      .select('id_usuario')
      .eq('id_nivel_actual', peopleLeadLevel.id_nivel);
        
    if (userNivelesError) {
      console.error('Error fetching People Lead users:', userNivelesError);
      return { success: false, error: 'Failed to fetch People Leads' };
    }

    if (!userNiveles || userNiveles.length === 0) {
      console.log('No People Leads found, skipping workload check');
      return { success: true, processed: 0, notifications: 0 };
    }

    let totalProcessed = 0;
    let totalNotifications = 0;

    // Process each People Lead
    for (const userNivel of userNiveles) {
      const peopleLeadId = userNivel.id_usuario;
      const teamMemberIds = await getPeopleLeadTeamMembers(peopleLeadId);
      
      // Process each team member
      for (const teamMemberId of teamMemberIds) {
        const workloadData = await calculateUserWorkload(teamMemberId);
        
        if (workloadData) {
          totalProcessed++;
          
          // Check for low workload (below 50%)
          if (workloadData.workloadPercentage < 50) {
            const result = await createLowWorkloadNotification(peopleLeadId, workloadData);
            if (result.success) {
              totalNotifications++;
              console.log(`Low workload notification sent for ${workloadData.nombre} ${workloadData.apellido} (${workloadData.workloadPercentage}%)`);
            }
          }
          // Check for overload (above 80%)
          else if (workloadData.workloadPercentage > 80) {
            const result = await createOverloadNotification(peopleLeadId, workloadData);
            if (result.success) {
              totalNotifications++;
              console.log(`Overload notification sent for ${workloadData.nombre} ${workloadData.apellido} (${workloadData.workloadPercentage}%)`);
            }
          }
        }
      }
    }

    // Check for users without People Lead assigned
    const { data: unassignedUsers, error: unassignedError } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre, apellido')
      .is('id_peoplelead', null);

    if (unassignedError) {
      console.error('Error fetching unassigned users:', unassignedError);
    } else if (unassignedUsers && unassignedUsers.length > 0) {
      for (const user of unassignedUsers) {
        const result = await createNoPeopleLeadNotification(user.id_usuario);
        
        if (result.success) {
          totalNotifications++;
          const userName = `${user.nombre || 'Usuario'} ${user.apellido || ''}`.trim();
          console.log(`No People Lead notification sent to ${userName}`);
        }
      }
    }

    console.log(`Workload check completed: ${totalProcessed} users processed, ${totalNotifications} notifications sent (including unassigned users)`);
    
    return {
      success: true,
      processed: totalProcessed,
      notifications: totalNotifications
    };
  } catch (error) {
    console.error('Error in workload check and notify:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Creates notification for users who don't have a People Lead assigned
 */
export async function createNoPeopleLeadNotification(
  userId: string,
  userName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // If no userName provided or it's generic, try to get a better name
    let displayName = userName;
    
    if (!displayName || displayName.trim().length === 0 || displayName === 'Usuario') {
      const supabase = await createClient();
      
      const { data: userData, error: userDataError } = await supabase
        .from('usuarios')
        .select('nombre, apellido')
        .eq('id_usuario', userId)
        .single();

      if (!userDataError && userData && userData.nombre) {
        displayName = `${userData.nombre} ${userData.apellido || ''}`.trim();
      } else {
        displayName = undefined;
      }
    }

    const notificationData: NotificationData = {
      titulo: 'Asignación de People Lead pendiente',
      descripcion: displayName 
        ? `Hola ${displayName}, actualmente no tienes un People Lead asignado. Para recibir seguimiento de tu carga de trabajo y desarrollo profesional, por favor contacta a un administrador para que te asigne un People Lead. Puedes enviar un email solicitando esta asignación.`
        : `Actualmente no tienes un People Lead asignado. Para recibir seguimiento de tu carga de trabajo y desarrollo profesional, por favor contacta a un administrador para que te asigne un People Lead. También aprovecha para completar tu perfil con tu nombre y datos personales.`,
      tipo: 'no_people_lead',
      userIds: [userId]
    };

    return await createNotification(notificationData);
  } catch (error) {
    console.error('Error creating no People Lead notification:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Creates welcome notification for new users
 * Handles cases where userName might be empty or undefined for new users
 */
export async function createWelcomeNotification(
  userId: string,
  userName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // If no userName provided, try to get it from the database
    let displayName = userName;
    
    if (!displayName || displayName.trim().length === 0 || displayName === 'Usuario') {
      const supabase = await createClient();
      
      const { data: userData, error: userDataError } = await supabase
        .from('usuarios')
        .select('nombre, apellido')
        .eq('id_usuario', userId)
        .single();

      if (!userDataError && userData && userData.nombre) {
        displayName = `${userData.nombre} ${userData.apellido || ''}`.trim();
      } else {
        // Fallback to a generic greeting
        displayName = undefined;
      }
    }

    // Create personalized or generic welcome message
    const notificationData: NotificationData = {
      titulo: '¡Bienvenido a KitSoft!',
      descripcion: displayName 
        ? `¡Hola ${displayName}! Te damos la bienvenida a la plataforma KitSoft. Aquí podrás gestionar tus proyectos, recibir retroalimentación, monitorear tu carga de trabajo y hacer seguimiento a tu desarrollo profesional. Explora el dashboard para familiarizarte con todas las funcionalidades disponibles. ¡Esperamos que tengas una excelente experiencia!`
        : `¡Te damos la bienvenida a la plataforma KitSoft! Aquí podrás gestionar tus proyectos, recibir retroalimentación, monitorear tu carga de trabajo y hacer seguimiento a tu desarrollo profesional. No olvides completar tu perfil con tu nombre y datos personales. Explora el dashboard para familiarizarte con todas las funcionalidades disponibles. ¡Esperamos que tengas una excelente experiencia!`,
      tipo: 'welcome',
      userIds: [userId]
    };

    return await createNotification(notificationData);
  } catch (error) {
    console.error('Error creating welcome notification:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}
