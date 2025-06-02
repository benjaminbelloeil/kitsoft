// API route for SOFT agent certificate path optimization
// Uses the simplified implementation that matches Python model.py

import { NextRequest, NextResponse } from 'next/server';
import { runSimulation, showAvailablePaths, isValidUUID } from '@/utils/soft-agent/main';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { id_path } = body;
    if (!id_path) {
      // Show available paths if no ID provided
      await showAvailablePaths();
      return NextResponse.json(
        { 
          error: 'Missing required field: id_path is required',
          message: 'Check console for available paths'
        },
        { status: 400 }
      );
    }

    // Validate UUID format
    if (!isValidUUID(id_path)) {
      return NextResponse.json(
        { 
          error: 'Invalid id_path format. Must be a valid UUID',
          example: '123e4567-e89b-12d3-a456-426614174000'
        },
        { status: 400 }
      );
    }

    console.log(`Starting SOFT optimization for path ${id_path}`);
    
    // Run the simulation
    const startTime = Date.now();
    const model = await runSimulation(id_path);
    const endTime = Date.now();

    if (!model) {
      return NextResponse.json(
        { error: 'Simulation failed - model is null' },
        { status: 500 }
      );
    }

    const mejorSolucion = model.getMejorSolucion();
    const mejorScore = model.getMejorScore();
    const meta = model.getMeta();

    console.log(`SOFT optimization completed in ${endTime - startTime}ms`);
    console.log(`Best score: ${mejorScore}`);

    // Return the optimization result
    return NextResponse.json({
      success: true,
      data: {
        id_path: id_path,
        meta: meta,
        score_total: mejorScore,
        niveles: mejorSolucion || [],
        processing_time_ms: endTime - startTime
      },
      metadata: {
        processing_time_ms: endTime - startTime,
        agents_used: 10,
        timestamp: new Date().toISOString(),
        python_compatible: true
      }
    });

  } catch (error) {
    console.error('SOFT optimization error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error during optimization',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'SOFT Agent Certificate Path Optimization API',
    description: 'This API matches the Python implementation structure exactly',
    usage: {
      method: 'POST',
      required_fields: ['id_path'],
      example_request: {
        id_path: '123e4567-e89b-12d3-a456-426614174000'
      }
    },
    python_compatible: true
  });
}
