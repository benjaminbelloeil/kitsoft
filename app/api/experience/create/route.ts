import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Helper function to format experience data for DB
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
    const { userId, experienceData } = await request.json();
    
    if (!userId || !experienceData) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Security check: users can only create experiences for themselves
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only create experiences for your own profile' },
        { status: 403 }
      );
    }
    
    // Format the experience data for the database
    const dbExperience = formatExperienceForDb(experienceData, userId);
    
    // Generate a UUID for the new experience
    dbExperience.id_experiencia = crypto.randomUUID();
    
    const { data, error } = await supabase
      .from('experiencia')
      .insert(dbExperience)
      .select();
    
    if (error) {
      console.error('Error creating experience:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      id: data && data[0] ? data[0].id_experiencia : undefined
    });
  } catch (error: any) {
    console.error('Unexpected error in create experience API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}