import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('session');
    
    if (!session) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    const sessionData = JSON.parse(session.value || '{}');
    return NextResponse.json({ session: sessionData }, { status: 200 });
  } catch (e) {
    console.error('Session check error:', e);
    return NextResponse.json({ session: null }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('session');
  return response;
}
