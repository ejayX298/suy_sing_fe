import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware function runs on every request
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};
