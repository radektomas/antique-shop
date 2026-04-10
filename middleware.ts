import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (but not /admin/login or /api/admin/login)
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';
  const isLoginApi = pathname.startsWith('/api/admin/login') || pathname.startsWith('/api/admin/logout');

  if (!isAdminRoute || isLoginPage || isLoginApi) {
    return NextResponse.next();
  }

  const session = req.cookies.get('admin_session')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || session !== adminPassword) {
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
