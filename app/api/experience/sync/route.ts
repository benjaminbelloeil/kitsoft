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
    const { userId, experiences } = await request.json();
    
    if (!userId || !Array.isArray(experiences)) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Security check: users can only sync experiences for their own profile
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only sync experiences for your own profile' },
        { status: 403 }
      );
    }
    
    // First get all existing experiences for this user
    const { data: existingExp, error: fetchError } = await supabase
      .from('experiencia')
      .select('id_experiencia')
      .eq('id_usuario', userId);
      
    if (fetchError) {
      console.error('Error fetching existing experiences:', fetchError);
      return NextResponse.json(
        { error: fetchError.message || 'Failed to fetch existing experiences' },
        { status: 500 }
      );
    }
    
    // Format all experiences for the database
    const dbExperiences = experiences.map(exp => {
      // Give each experience a UUID
      return formatExperienceForDb(exp, userId, crypto.randomUUID());
    });
    
    // Use upsert to handle both inserts and updates
    const { error: upsertError } = await supabase
      .from('experiencia')
      .upsert(dbExperiences);
      
    if (upsertError) {
      console.error('Error syncing experiences:', upsertError);
      return NextResponse.json(
        { error: upsertError.message || 'Failed to sync experiences' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in sync experiences API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}