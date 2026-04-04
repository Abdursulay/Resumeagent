import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    // If login successful, set session cookie
    if (response.status === 200 && data.success) {
      const res = NextResponse.json(data, { status: response.status });
      res.cookies.set('session', JSON.stringify(data.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      return res;
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (e) {
    console.error('Login proxy error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
