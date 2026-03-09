import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token')
    const { pathname } = req.nextUrl

    // 🔐 Protect admin routes
    if (pathname.startsWith('/admin') && !token) {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 🚫 Prevent logged-in users from visiting login
    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/admin', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/login'],
}
