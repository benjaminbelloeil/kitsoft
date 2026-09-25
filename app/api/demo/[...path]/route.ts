import { NextRequest, NextResponse } from 'next/server';
import { DEMO_ROLE_COOKIE, isDemoMode, resolveDemoRole } from '@/lib/demo/config';
import { handleDemoRequest } from '@/lib/demo/handlers';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(request: NextRequest, context: RouteContext) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { path } = await context.params;
  const url = new URL(request.url);

  let body: unknown = null;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      body = await request.json();
    } catch {
      body = null;
    }
  }

  const result = handleDemoRequest({
    method: request.method,
    path: `/${(path ?? []).join('/')}`,
    searchParams: url.searchParams,
    body,
    role: resolveDemoRole(request.cookies.get(DEMO_ROLE_COOKIE)?.value),
  });

  return NextResponse.json(result.body, { status: result.status });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
