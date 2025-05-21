import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
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
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Security check: normal users can only reset their own levels
    if (userId !== user.id) {
      // Check if the current user is an admin - first get the current level ID
      const { data: userNivelesRecord, error: nivelesRecordError } = await supabase
        .from('usuarios_niveles')
        .select('id_nivel_actual')
        .eq('id_usuario', user.id)
        .order('fecha_cambio', { ascending: false })
        .limit(1)
        .single();
      
      if (nivelesRecordError || !userNivelesRecord) {
        return NextResponse.json(
          { error: 'Only admins can reset other users\' levels' },
          { status: 403 }
        );
      }
      
      // Get the level details to check if admin
      const { data: nivelData, error: nivelError } = await supabase
        .from('niveles')
        .select('numero')
        .eq('id_nivel', userNivelesRecord.id_nivel_actual)
        .single();
        
      // Check if the user is admin (level number 1)
      if (nivelError || nivelData?.numero !== 1) {
        return NextResponse.json(
          { error: 'Only admins can reset other users\' levels' },
          { status: 403 }
        );
      }
    }
    
    // First, get the ID of the staff level
    const { data: staffLevel, error: staffError } = await supabase
      .from('niveles')
      .select('id_nivel')
      .eq('numero', 0)
      .single();
      
    if (staffError || !staffLevel) {
      console.error('Error finding staff level:', staffError);
      return NextResponse.json(
        { error: 'Error finding staff level' },
        { status: 500 }
      );
    }
    
    // Check if the user already has an entry in usuarios_niveles
    const { data: existingRecord, error: existingError } = await supabase
      .from('usuarios_niveles')
      .select('*')
      .eq('id_usuario', userId)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
    
    const timestamp = new Date().toISOString();
    
    if (!existingError && existingRecord) {
      // User has an existing record, let's update it
      const currentLevelId = existingRecord.id_nivel_actual;
      
      const { error: updateError } = await supabase
        .from('usuarios_niveles')
        .update({
          id_nivel_previo: currentLevelId,
          id_nivel_actual: staffLevel.id_nivel,
          fecha_cambio: timestamp
        })
        .eq('id_historial', existingRecord.id_historial);
        
      if (updateError) {
        console.error('Error resetting user level:', updateError);
        return NextResponse.json(
          { error: 'Error resetting user level' },
          { status: 500 }
        );
      }
    } else {
      // No existing record, create a new one
      const id_historial = randomUUID();
      
      const { error: insertError } = await supabase
        .from('usuarios_niveles')
        .insert([
          { 
            id_historial,
            id_usuario: userId,
            id_nivel_actual: staffLevel.id_nivel,
            id_nivel_previo: null,
            fecha_cambio: timestamp 
          }
        ]);
        
      if (insertError) {
        console.error('Error creating user level record:', insertError);
        return NextResponse.json(
          { error: 'Error creating user level record' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in reset user level API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
