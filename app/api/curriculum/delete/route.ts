/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function DELETE(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Get the request body
    const { userId, filename } = await request.json();
    
    if (!userId || !filename) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Security check: users can only delete curriculums for themselves unless they're admin
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only delete curriculums for your own profile' },
        { status: 403 }
      );
    }
    
    // Create the path to delete
    const path = `Curriculum/${filename}`;
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('usuarios')
      .remove([path]);
      
    if (storageError) {
      console.error('Error deleting curriculum from storage:', storageError);
      return NextResponse.json(
        { error: storageError.message || 'Failed to delete curriculum from storage' },
        { status: 500 }
      );
    }
    
    // Update the database to remove the reference
    const { error: dbError } = await supabase
      .from('usuarios')
      .update({ url_curriculum: null })
      .eq('id_usuario', userId);
      
    if (dbError) {
      console.error('Error updating database after curriculum deletion:', dbError);
      return NextResponse.json(
        { error: dbError.message || 'Failed to update database after deletion' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in delete curriculum API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}