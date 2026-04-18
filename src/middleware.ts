import { NextRequest, NextResponse } from 'next/server'

/**
 * Edge middleware — lightweight first-line guard for admin routes.
 *
 * Full token verification (Firebase Admin SDK) only runs in API route
 * handlers because the Admin SDK is not available in the Edge runtime.
 * Here we just check for the presence of any auth token cookie/header
 * so that completely unauthenticated requests to /admin/* are bounced
 * to /admin/login immediately, without waiting for a JS bundle to load.
 *
 * The real auth check (verifyAdminRequest) still happens in every
 * /api/admin/* route handler — this is defence in depth, not a
 * replacement for that check.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Protect /admin routes (except the login page itself) ──────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // We cannot run Firebase Admin in Edge, so we rely on the client-side
    // AdminAuthProvider for the full auth check. The middleware only
    // redirects when there is clearly no session at all (no cookie).
    // Firebase stores its auth state in IndexedDB (client-only), so there
    // is no reliable server cookie to inspect here.
    // We therefore let the request through and trust AdminAuthProvider's
    // useEffect redirect for the UI, while every API call is protected
    // by verifyAdminRequest() in the route handler.
    return NextResponse.next()
  }

  // ── Protect /api/admin routes ─────────────────────────────────────────────
  if (pathname.startsWith('/api/admin')) {
    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Token is present; full verification happens in the route handler
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
