import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Guard: only allow in E2E test mode and never in production
  if (process.env.E2E_TEST_MODE !== 'true' || process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'E2E mode not enabled' }, { status: 403 });
  }

  // Redirect to the normal success page so the client-side unlock logic runs.
  const url = new URL(request.url);
  url.pathname = '/success';
  url.searchParams.set('session_id', 'e2e');
  return NextResponse.redirect(url.toString());
}

export async function POST(request: Request) {
  return GET(request);
}
