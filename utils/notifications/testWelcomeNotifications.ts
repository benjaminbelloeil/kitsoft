/**
 * Test script for welcome notification functionality
 * This script verifies that welcome notifications are working correctly
 */

import { createClient } from '@/utils/supabase/server';
import { createWelcomeNotification } from '@/utils/notifications/notificationService';

// Test welcome notification creation
export async function testWelcomeNotification() {
  console.log('🧪 Testing welcome notification functionality...');
  
  try {
    const supabase = await createClient();
    
    // Get a test user
    const { data: users, error } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre, apellido')
      .limit(1);

    if (error || !users || users.length === 0) {
      console.error('❌ No test users found');
      return;
    }

    const testUser = users[0];
    const userName = `${testUser.nombre} ${testUser.apellido || ''}`.trim() || 'Usuario';

    console.log(`Testing welcome notification for user: ${testUser.id_usuario} (${userName})`);

    // Test welcome notification creation
    const result = await createWelcomeNotification(testUser.id_usuario, userName);
    
    if (result.success) {
      console.log('✅ Welcome notification created successfully');
      
      // Verify the notification was created in the database
      const { data: notifications, error: notifError } = await supabase
        .from('usuarios_notificaciones')
        .select(`
          id_usuario,
          leido,
          notificaciones (
            titulo,
            descripcion,
            tipo
          )
        `)
        .eq('id_usuario', testUser.id_usuario)
        .order('fecha_creacion', { ascending: false })
        .limit(1);

      if (notifError) {
        console.error('❌ Error verifying notification:', notifError);
        return;
      }

      if (notifications && notifications.length > 0) {
        const notification = notifications[0];
        const notifData = Array.isArray(notification.notificaciones) 
          ? notification.notificaciones[0] 
          : notification.notificaciones;

        if (notifData && notifData.tipo === 'welcome') {
          console.log('✅ Welcome notification verified in database:');
          console.log(`   Title: ${notifData.titulo}`);
          console.log(`   Type: ${notifData.tipo}`);
          console.log(`   Read: ${notification.leido}`);
        } else {
          console.error('❌ Welcome notification not found or wrong type');
        }
      } else {
        console.error('❌ No notifications found for user');
      }
    } else {
      console.error('❌ Welcome notification creation failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Error testing welcome notification:', error);
  }
}

// Test welcome notification integration with user creation
export async function testUserCreationFlow() {
  console.log('🧪 Testing user creation flow with welcome notifications...');
  
  try {
    // Simulate the user creation flow by calling the ensure endpoint
    // Note: This would need to be called from a client-side test or using proper authentication
    console.log('📝 User creation flow test requires proper authentication');
    console.log('   To test manually:');
    console.log('   1. Create a new user account');
    console.log('   2. Check if welcome notification is automatically sent');
    console.log('   3. Verify notification appears in user dashboard');
    
  } catch (error) {
    console.error('❌ Error testing user creation flow:', error);
  }
}

// Run welcome notification tests
export async function runWelcomeNotificationTests() {
  console.log('🚀 Starting welcome notification tests...');
  
  await testWelcomeNotification();
  await testUserCreationFlow();
  
  console.log('🏁 Welcome notification tests completed!');
}

// Export for manual testing
export { createWelcomeNotification };
