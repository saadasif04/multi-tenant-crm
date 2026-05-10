import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const isAuthPage = req.nextUrl.pathname === '/';

  // if not logged in and trying to access protected pages
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // if logged in and trying to open login page
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/customers', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/customers/:path*', '/team/:path*', '/'],
};