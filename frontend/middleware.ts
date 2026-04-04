import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Public routes (no auth required)
  const publicRoutes = ['/', '/login'];
  
  // Protected routes (auth required)
  const protectedRoutes = ['/upload', '/analysis'];
  
  // Check if route is protected
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Client-side will handle redirects via useEffect
    // This middleware just allows the request through
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/upload', '/analysis', '/login', '/'],
};

