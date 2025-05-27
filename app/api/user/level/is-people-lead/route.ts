/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ isPeopleLead: false }, { status: 401 });
    }

    // Get the user's current level ID
    const { data: userLevelData, error: levelError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();

    if (levelError) {
      console.error('Error getting user level:', levelError);
      return NextResponse.json({ isPeopleLead: false }, { status: 200 });
    }

    // Get the level details to check the numero
    const { data: levelDetails, error: detailsError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userLevelData.id_nivel_actual)
      .single();

    if (detailsError) {
      console.error('Error getting level details:', detailsError);
      return NextResponse.json({ isPeopleLead: false }, { status: 200 });
    }

    // Check if numero equals 2 (People Lead)
    const isPeopleLead = levelDetails.numero === 2;
    return NextResponse.json({ isPeopleLead }, { status: 200 });
  } catch (error) {
    console.error('Error in is-people-lead endpoint:', error);
    return NextResponse.json({ isPeopleLead: false }, { status: 500 });
  }
}