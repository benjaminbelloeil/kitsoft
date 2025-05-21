/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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
    const body = await request.json();
    const userId = body.userId;
    let skillId = body.skillId;
    const level = body.level;
    const experienceId = body.experienceId;
    const skillName = body.skillName;

    // If skillId is missing but skillName is present, create the skill in habilidades
    if ((!skillId || skillId === '') && skillName) {
      // Try to find an existing skill with this name (case-insensitive)
      const { data: existingSkillRow, error: findSkillError } = await supabase
        .from('habilidades')
        .select('id_habilidad')
        .ilike('titulo', skillName)
        .maybeSingle();
      if (findSkillError) {
        return NextResponse.json(
          { error: findSkillError.message || 'Failed to search for skill' },
          { status: 500 }
        );
      }
      if (existingSkillRow && existingSkillRow.id_habilidad) {
        skillId = existingSkillRow.id_habilidad;
      } else {
        // Insert new skill
        const { data: newSkill, error: insertSkillError } = await supabase
          .from('habilidades')
          .insert({ titulo: skillName })
          .select('id_habilidad')
          .single();
        if (insertSkillError || !newSkill) {
          return NextResponse.json(
            { error: insertSkillError?.message || 'Failed to create new skill' },
            { status: 500 }
          );
        }
        skillId = newSkill.id_habilidad;
      }
    }

    if (!userId || !skillId || level === undefined || level === null) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Security check: users can only add skills for themselves unless they're admin
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only add skills to your own profile' },
        { status: 403 }
      );
    }
    
    // Check if the skill already exists for this user
    const { data: existingSkill, error: checkError } = await supabase
      .from('usuarios_habilidades')
      .select('*')
      .eq('id_usuario', userId)
      .eq('id_habilidad', skillId)
      .maybeSingle();
    
    if (checkError && !checkError.message.includes('No rows found')) {
      console.error('Error checking existing skill:', checkError);
      return NextResponse.json(
        { error: checkError.message || 'Failed to check existing skill' },
        { status: 500 }
      );
    }
    
    // If the skill already exists, update it instead of adding a new one
    if (existingSkill) {
      const { error: updateError } = await supabase
        .from('usuarios_habilidades')
        .update({ nivel_experiencia: level })
        .eq('id_usuario', userId)
        .eq('id_habilidad', skillId);
        
      if (updateError) {
        console.error('Error updating skill:', updateError);
        return NextResponse.json(
          { error: updateError.message || 'Failed to update skill' },
          { status: 500 }
        );
      }
      // Also upsert into experiencias_habilidades if experienceId is provided
      if (experienceId) {
        const { error: expSkillError } = await supabase
          .from('experiencias_habilidades')
          .upsert({
            id_habilidad: skillId,
            id_experiencia: experienceId,
            nivel_experiencia: level
          }, { onConflict: 'id_habilidad,id_experiencia' });
        if (expSkillError) {
          console.error('Error upserting skill to experience:', expSkillError);
          return NextResponse.json(
            { error: expSkillError.message || 'Failed to upsert skill to experience' },
            { status: 500 }
          );
        }
      }
      return NextResponse.json({ success: true, updated: true, skillId: skillId });
    }
    
    // Insert the new skill
    const { error: insertError } = await supabase
      .from('usuarios_habilidades')
      .insert({
        id_usuario: userId,
        id_habilidad: skillId,
        nivel_experiencia: level,
      });
      
    if (insertError) {
      console.error('Error adding skill:', insertError);
      return NextResponse.json(
        { error: insertError.message || 'Failed to add skill' },
        { status: 500 }
      );
    }
    // Also insert into experiencias_habilidades if experienceId is provided
    if (experienceId) {
      const { error: expSkillError } = await supabase
        .from('experiencias_habilidades')
        .upsert({
          id_habilidad: skillId,
          id_experiencia: experienceId,
          nivel_experiencia: level
        }, { onConflict: 'id_habilidad,id_experiencia' });
      if (expSkillError) {
        console.error('Error upserting skill to experience:', expSkillError);
        return NextResponse.json(
          { error: expSkillError.message || 'Failed to upsert skill to experience' },
          { status: 500 }
        );
      }
    }
    return NextResponse.json({ success: true, added: true, skillId: skillId });
  } catch (error: any) {
    console.error('Unexpected error in add skill API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}