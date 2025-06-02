/* eslint-disable @typescript-eslint/no-explicit-any */
import { simular } from '@/utils/agent/simulation';
import { createClient } from '@/utils/supabase/server';

export interface AgentAssignmentResult {
  success: boolean;
  assignments: any[];
  tiempo_total: number;
  new_assignments: number;
  skipped: number;
  error?: string;
  message?: string;
}

/**
 * Execute agent assignment for a project
 * This function can be called directly from other server-side code
 */
export async function executeAgentAssignment(id_proyecto: string): Promise<AgentAssignmentResult> {
  try {
    console.log(`🚀 Starting agent simulation for project: ${id_proyecto}`);
    const startTime = Date.now();
    
    // Run the agent simulation
    const assignments = await simular(id_proyecto);
    const totalTime = (Date.now() - startTime) / 1000;
    
    if (assignments.length === 0) {
      console.log(`⚠️ No assignments could be made for project: ${id_proyecto}`);
      return {
        success: false,
        error: 'No suitable candidates found for project roles',
        assignments: [],
        tiempo_total: totalTime,
        new_assignments: 0,
        skipped: 0
      };
    }

    // Save assignments to database
    const supabase = await createClient();
    
    console.log(`💾 Saving ${assignments.length} assignments to database...`);
    
    // Check for existing assignments first
    const { data: existingAssignments } = await supabase
      .from('usuarios_proyectos')
      .select('id_usuario, id_rol')
      .eq('id_proyecto', id_proyecto);

    const existingSet = new Set(
      (existingAssignments || []).map(ea => `${ea.id_usuario}-${ea.id_rol}`)
    );

    // Filter out assignments that already exist
    const newAssignments = assignments.filter(assignment => 
      !existingSet.has(`${assignment.empleado_id}-${assignment.rol_id}`)
    );

    if (newAssignments.length === 0) {
      console.log(`ℹ️ All assignments already exist for project: ${id_proyecto}`);
      return {
        success: true,
        message: 'All team members were already assigned to this project',
        assignments,
        tiempo_total: totalTime,
        new_assignments: 0,
        skipped: assignments.length
      };
    }

    const assignmentsToInsert = newAssignments.map(assignment => ({
      id_proyecto: id_proyecto,
      id_usuario: assignment.empleado_id,
      id_rol: assignment.rol_id,
      horas: 0, // Will be set by project lead later
      titulo: null // Project title will be set later if needed
    }));

    const { error: insertError } = await supabase
      .from('usuarios_proyectos')
      .insert(assignmentsToInsert);

    if (insertError) {
      console.error('Error saving assignments:', insertError);
      return {
        success: false,
        error: 'Failed to save assignments to database',
        assignments: [],
        tiempo_total: totalTime,
        new_assignments: 0,
        skipped: 0
      };
    }

    // Mark project roles as occupied (only for new assignments)
    for (const assignment of newAssignments) {
      await supabase
        .from('proyectos_roles')
        .update({ ocupado: true })
        .eq('id_proyecto', id_proyecto)
        .eq('id_rol', assignment.rol_id);
    }

    const totalAssignments = assignments.length;
    const newAssignmentsCount = newAssignments.length;
    const skippedCount = totalAssignments - newAssignmentsCount;

    console.log(`✅ Agent simulation completed successfully in ${totalTime.toFixed(2)} seconds`);
    console.log(`📋 Total assignments processed: ${totalAssignments}`);
    console.log(`➕ New assignments made: ${newAssignmentsCount}`);
    if (skippedCount > 0) {
      console.log(`⏭️ Assignments skipped (already exist): ${skippedCount}`);
    }
    
    return {
      success: true,
      message: newAssignmentsCount > 0 
        ? `Successfully assigned ${newAssignmentsCount} new team members${skippedCount > 0 ? ` (${skippedCount} already assigned)` : ''}`
        : 'All team members were already assigned to this project',
      assignments,
      tiempo_total: totalTime,
      new_assignments: newAssignmentsCount,
      skipped: skippedCount
    };

  } catch (error) {
    console.error('❌ Agent simulation error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error during simulation',
      assignments: [],
      tiempo_total: 0,
      new_assignments: 0,
      skipped: 0
    };
  }
}
