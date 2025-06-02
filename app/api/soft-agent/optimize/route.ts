// API route for SOFT agent certificate path optimization

import { NextRequest, NextResponse } from 'next/server';
import { SOFTAgentSimulation } from '@/utils/soft-agent/simulation';
import { softAgentDatabase } from '@/utils/database/soft-agent-db';
import type { OptimizationRequest, PathOptimizationResult } from '@/interfaces/soft-agent';

// Initialize simulation instance
const softSimulation = new SOFTAgentSimulation(softAgentDatabase);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { usuario_id, trayectoria_id } = body;
    if (!usuario_id || !trayectoria_id) {
      return NextResponse.json(
        { error: 'Missing required fields: usuario_id and trayectoria_id are required' },
        { status: 400 }
      );
    }

    // Create optimization request with defaults
    const optimizationRequest: OptimizationRequest = {
      usuario_id,
      trayectoria_id,
      num_niveles: body.num_niveles || 5,
      max_certificados_por_nivel: body.max_certificados_por_nivel || 4,
      considerar_tiempo: body.considerar_tiempo ?? true,
      considerar_costo: body.considerar_costo ?? true
    };

    console.log(`Starting SOFT optimization for user ${usuario_id}, path ${trayectoria_id}`);
    
    // Run the optimization
    const startTime = Date.now();
    const result: PathOptimizationResult = await softSimulation.optimizeCertificatePath(optimizationRequest);
    const endTime = Date.now();

    console.log(`SOFT optimization completed in ${endTime - startTime}ms`);
    console.log(`Generated ${result.niveles.length} levels with ${result.niveles.reduce((sum, level) => sum + level.certificados.length, 0)} total certificates`);

    // Return the optimization result
    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        processing_time_ms: endTime - startTime,
        agents_used: 10,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in SOFT agent optimization:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during path optimization',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      // Return simulation statistics
      const stats = softSimulation.getSimulationStats();
      return NextResponse.json({
        success: true,
        data: {
          ...stats,
          status: 'active',
          version: '1.0.0'
        }
      });
    }

    if (action === 'clear-cache') {
      // Clear simulation cache
      softSimulation.clearCache();
      return NextResponse.json({
        success: true,
        message: 'Cache cleared successfully'
      });
    }

    // Default: return API information
    return NextResponse.json({
      success: true,
      message: 'SOFT Agent API for Certificate Path Optimization',
      endpoints: {
        'POST /api/soft-agent/optimize': 'Optimize certificate learning path',
        'GET /api/soft-agent/optimize?action=stats': 'Get simulation statistics',
        'GET /api/soft-agent/optimize?action=clear-cache': 'Clear simulation cache'
      },
      required_fields: ['usuario_id', 'trayectoria_id'],
      optional_fields: ['num_niveles', 'max_certificados_por_nivel', 'considerar_tiempo', 'considerar_costo']
    });

  } catch (error) {
    console.error('Error in SOFT agent GET request:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
