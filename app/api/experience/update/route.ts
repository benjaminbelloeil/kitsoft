import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Helper function to format experience data for the database
const formatExperienceForDb = (data: any, userId: string, experienceId?: string) => {
  // If it's marked as current position, set fecha_fin to null
  // Otherwise, use the provided end date or today's date if none provided
  const fechaFin = data.isCurrentPosition ? 
    null : 
    (data.endDate || new Date().toISOString().split('T')[0]);
  
  return {
    ...(experienceId && { id_experiencia: experienceId }),
    compañia: data.company,
    posicion: data.position,
    descripcion: data.description,
    fecha_inicio: data.startDate,
    fecha_fin: fechaFin,
    id_usuario: userId
  };
};

export async function PUT(request: NextRequest) {
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
    const { experienceId, userId, experienceData } = await request.json();
    
    if (!experienceId || !userId || !experienceData) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Security check: verify this experience belongs to the authenticated user
    const { data: experienceOwner, error: ownerError } = await supabase
      .from('experiencia')
      .select('id_usuario')
      .eq('id_experiencia', experienceId)
      .single();
      
    if (ownerError || !experienceOwner) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }
    
    if (experienceOwner.id_usuario !== user.id || userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only update your own experience records' },
        { status: 403 }
      );
    }
    
    // Format the experience data for the database
    const dbExperience = formatExperienceForDb(experienceData, userId, experienceId);
    
    // Update the experience
    const { error } = await supabase
      .from('experiencia')
      .update(dbExperience)
      .eq('id_experiencia', experienceId)
      .eq('id_usuario', userId); // Extra security to ensure user owns this experience
    
    if (error) {
      console.error('Error updating experience:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update experience' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in update experience API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}