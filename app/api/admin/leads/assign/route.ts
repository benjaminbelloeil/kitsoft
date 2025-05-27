import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { assignments } = await request.json(); // Changed to expect assignments array

    // Check authentication - only admins should access this
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if the user is an admin
    const { data: userNivelesRecord, error: nivelesRecordError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
    
    if (nivelesRecordError || !userNivelesRecord) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Get the level details to check if admin
    const { data: nivelData, error: nivelError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userNivelesRecord.id_nivel_actual)
      .single();
      
    // Check if the user is admin (level number 1)
    if (nivelError || nivelData?.numero !== 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Process each assignment
    const results = [];
    for (const assignment of assignments) {
      const { userId, leadId } = assignment;

      // Validate that the people lead ID is actually a people lead (if not empty)
      if (leadId) {
        const { data: leadCheck, error: leadCheckError } = await supabase
          .from('usuarios')
          .select(`
            id_usuario,
            usuarios_niveles!inner(
              niveles!usuarios_niveles_id_nivel_actual_fkey!inner(numero)
            )
          `)
          .eq('id_usuario', leadId)
          .eq('usuarios_niveles.niveles.numero', 2)
          .single();

        if (leadCheckError || !leadCheck) {
          return NextResponse.json({ error: `Invalid people lead ID: ${leadId}` }, { status: 400 });
        }
      }

      // Update the user's people lead assignment
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ id_peoplelead: leadId || null }) // Allow null for unassigning
        .eq('id_usuario', userId);

      if (updateError) {
        return NextResponse.json({ error: `Failed to update assignment for user ${userId}` }, { status: 500 });
      }

      results.push({ userId, leadId, success: true });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error in POST /api/admin/leads/assign:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
