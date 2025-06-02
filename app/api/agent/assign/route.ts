import { NextResponse } from 'next/server';
import { executeAgentAssignment } from '@/utils/agent/assign';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_proyecto } = body;

    if (!id_proyecto) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required field: id_proyecto',
          assignments: [],
          tiempo_total: 0
        },
        { status: 400 }
      );
    }

    const result = await executeAgentAssignment(id_proyecto);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: result.error?.includes('No suitable candidates') ? 200 : 500 });
    }

  } catch (error) {
    console.error('❌ Agent API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        assignments: [],
        tiempo_total: 0
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    message: 'Agent system is ready for project assignments',
    version: '1.0.0'
  });
}
