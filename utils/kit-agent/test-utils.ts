// Utility functions for testing and debugging the kit agent system
import { agentDatabase } from '../database/kit-agent-db';
import { simular } from './simulation';
import type { SimulationResponse } from '@/interfaces/kit-agent';

/**
 * Test the database connections and basic functionality
 */
export async function testAgentSystem(): Promise<{
  databaseConnected: boolean;
  employeesFound: number;
  error?: string;
}> {
  try {
    console.log('🧪 Testing agent system...');
    
    // Test database connection
    const empleados = await agentDatabase.getEmpleadosDisponibles();
    
    console.log(`✅ Database connected successfully`);
    console.log(`📊 Found ${empleados.length} available employees`);
    
    return {
      databaseConnected: true,
      employeesFound: empleados.length
    };
  } catch (error) {
    console.error('❌ Agent system test failed:', error);
    return {
      databaseConnected: false,
      employeesFound: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Run a simulation for a specific project and return detailed results
 */
export async function runProjectSimulation(projectId: string): Promise<SimulationResponse> {
  try {
    console.log(`🚀 Starting simulation for project: ${projectId}`);
    const startTime = Date.now();
    
    const assignments = await simular(projectId);
    const totalTime = (Date.now() - startTime) / 1000;
    
    if (assignments.length === 0) {
      return {
        success: false,
        error: 'No assignments could be made for this project',
        assignments: [],
        tiempo_total: totalTime
      };
    }
    
    console.log(`✅ Simulation completed successfully in ${totalTime.toFixed(2)} seconds`);
    console.log(`📋 Assignments made: ${assignments.length}`);
    
    return {
      success: true,
      assignments,
      tiempo_total: totalTime
    };
  } catch (error) {
    console.error('❌ Simulation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      assignments: [],
      tiempo_total: 0
    };
  }
}

/**
 * Get detailed information about a project's roles and requirements
 */
export async function getProjectInfo(projectId: string) {
  try {
    const roles = await agentDatabase.getRolesProyecto(projectId);
    const employees = await agentDatabase.getEmpleadosDisponibles();
    
    return {
      projectId,
      rolesAvailable: roles.length,
      rolesDetails: roles.map(role => ({
        id: role.id_rol,
        name: role.nombre,
        skillsRequired: role.habilidades_requeridas.length,
        skills: role.habilidades_requeridas.map(skill => ({
          id: skill.id_habilidad,
          levelRequired: skill.nivel_requerido
        }))
      })),
      employeesAvailable: employees.length,
      estimatedProcessingTime: `${Math.ceil(roles.length * employees.length / 100)} seconds`
    };
  } catch (error) {
    throw new Error(`Failed to get project info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
