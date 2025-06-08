/**
 * Test script for the notification system
 * This script can be used to test notification functionality
 */

import { createClient } from '@/utils/supabase/server';
import {
  createProjectDeadlineNotification,
  createProjectAssignmentNotification,
  createFeedbackReceivedNotification,
  createLevelChangeNotification,
  checkProjectDeadlines,
  getNotificationStats,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  cleanupOldNotifications
} from '@/utils/notifications/notificationService';

// Test helper function to get a test user ID
export async function getTestUserId(): Promise<string | null> {
  const supabase = await createClient();
  
  const { data: users, error } = await supabase
    .from('usuarios')
    .select('id_usuario')
    .limit(1);

  if (error || !users || users.length === 0) {
    console.error('No test users found');
    return null;
  }

  return users[0].id_usuario;
}

// Test helper function to get a test project
export async function getTestProject(): Promise<{ id: string; title: string } | null> {
  const supabase = await createClient();
  
  const { data: projects, error } = await supabase
    .from('proyectos')
    .select('id_proyecto, titulo')
    .eq('activo', true)
    .limit(1);

  if (error || !projects || projects.length === 0) {
    console.error('No test projects found');
    return null;
  }

  return {
    id: projects[0].id_proyecto,
    title: projects[0].titulo
  };
}

// Test individual notification functions
export async function testNotificationCreation() {
  console.log('🧪 Testing notification creation...');
  
  const testUserId = await getTestUserId();
  const testProject = await getTestProject();
  
  if (!testUserId) {
    console.error('❌ No test user available');
    return;
  }

  if (!testProject) {
    console.error('❌ No test project available');
    return;
  }

  try {
    // Test project assignment notification
    console.log('Testing project assignment notification...');
    const assignmentResult = await createProjectAssignmentNotification(
      testUserId,
      'Test Project',
      'Developer',
      'test-admin'
    );
    console.log('Assignment notification result:', assignmentResult);

    // Test feedback notification
    console.log('Testing feedback notification...');
    const feedbackResult = await createFeedbackReceivedNotification(
      testUserId,
      'test-author',
      testProject.title,
      4
    );
    console.log('Feedback notification result:', feedbackResult);

    // Test level change notification
    console.log('Testing level change notification...');
    const levelResult = await createLevelChangeNotification(
      testUserId,
      'Senior Developer',
      'test-admin'
    );
    console.log('Level change notification result:', levelResult);

    // Test deadline notification
    console.log('Testing deadline notification...');
    const deadlineResult = await createProjectDeadlineNotification(
      testProject.id,
      testProject.title,
      7
    );
    console.log('Deadline notification result:', deadlineResult);

    console.log('✅ All notification tests completed');
  } catch (error) {
    console.error('❌ Error testing notifications:', error);
  }
}

// Test notification utility functions
export async function testNotificationUtilities() {
  console.log('🧪 Testing notification utilities...');
  
  const testUserId = await getTestUserId();
  
  if (!testUserId) {
    console.error('❌ No test user available');
    return;
  }

  try {
    // Test getting notification stats
    console.log('Testing notification stats...');
    const statsResult = await getNotificationStats(testUserId);
    console.log('Stats result:', statsResult);

    // Test cleanup (with 0 days to test functionality without deleting much)
    console.log('Testing notification cleanup...');
    const cleanupResult = await cleanupOldNotifications(999); // Only very old notifications
    console.log('Cleanup result:', cleanupResult);

    console.log('✅ All utility tests completed');
  } catch (error) {
    console.error('❌ Error testing utilities:', error);
  }
}

// Test deadline checking
export async function testDeadlineChecking() {
  console.log('🧪 Testing deadline checking...');
  
  try {
    const result = await checkProjectDeadlines();
    console.log('Deadline check result:', result);
    console.log('✅ Deadline check test completed');
  } catch (error) {
    console.error('❌ Error testing deadline checking:', error);
  }
}

// Run all tests
export async function runAllNotificationTests() {
  console.log('🚀 Starting notification system tests...');
  
  await testNotificationCreation();
  await testNotificationUtilities();
  await testDeadlineChecking();
  
  console.log('🏁 All notification tests completed!');
}

// Export for manual testing
export {
  createProjectDeadlineNotification,
  createProjectAssignmentNotification,
  createFeedbackReceivedNotification,
  createLevelChangeNotification,
  checkProjectDeadlines,
  getNotificationStats,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  cleanupOldNotifications
};
