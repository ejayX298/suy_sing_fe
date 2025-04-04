import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;


  const isPublicPath = pathname === '/login' || 
                      pathname.startsWith('/_next') || 
                      pathname.startsWith('/api') || 
                      pathname.startsWith('/images') || 
                      pathname === '/favicon.ico';

  const authToken = request.cookies.get('auth')?.value;
  const isAuthenticated = !!authToken;

  if (!isPublicPath && !isAuthenticated) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && pathname === '/login') {
    const url = new URL('/customer-activities', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
