import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from '@auth/core/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected dashboard and admin routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error('AUTH_SECRET or NEXTAUTH_SECRET must be set for middleware authentication');
    }

    console.log('[middleware] Checking auth for:', pathname);
    const allCookies = request.cookies.getAll();
    console.log('[middleware] All cookies:', allCookies.map(c => c.name).join(', '));

    const secureCookie = process.env.NODE_ENV === 'production';
    const cookieName = secureCookie ? '__Secure-authjs.session-token' : 'authjs.session-token';

    const token = await getToken({
      req: request,
      secret,
      salt: cookieName,
      secureCookie,
    });

    console.log('[middleware] Token retrieved:', !!token);
    if (token) {
      console.log('[middleware] Token content:', {
        email: token.email,
        role: token.role,
        isBlocked: token.isBlocked,
        sub: token.sub,
      });
    }

    if (!token) {
      console.log('[middleware] No token, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.isBlocked) {
      console.log('[middleware] User is blocked, redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Admin-only check
    if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
      console.log('[middleware] User is not admin, redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log('[middleware] Auth check passed for user:', token.email);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
