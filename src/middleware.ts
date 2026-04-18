import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Block /api/admin/* with no bearer token at the edge
  if (pathname.startsWith('/api/admin')) {
    const auth = req.headers.get('authorization') || req.headers.get('Authorization') || ''
    const token = auth.replace(/^Bearer\s+/i, '').trim()
    if (!token || token === 'null' || token === 'undefined') {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*'],
}
