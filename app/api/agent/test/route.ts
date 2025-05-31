// Test endpoint for the agent system
import { NextResponse } from 'next/server';
import { testAgentSystem, getProjectInfo } from '@/utils/agent/test-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project');
    
    if (projectId) {
      // Test specific project
      console.log(`Testing project: ${projectId}`);
      const projectInfo = await getProjectInfo(projectId);
      
      return NextResponse.json({
        status: 'success',
        message: 'Project information retrieved successfully',
        data: projectInfo
      });
    } else {
      // Test general system
      const testResult = await testAgentSystem();
      
      return NextResponse.json({
        status: testResult.databaseConnected ? 'success' : 'error',
        message: testResult.databaseConnected 
          ? 'Agent system is working correctly'
          : 'Agent system has issues',
        data: testResult
      });
    }
  } catch (error) {
    console.error('Test endpoint error:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
