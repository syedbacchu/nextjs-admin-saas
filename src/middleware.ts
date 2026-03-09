import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROOT_SEGMENTS = new Set([
    'api',
    'about-us',
    'blogs',
    'contact-us',
    'pricing',
    'login',
])

export function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token')?.value
    const sessionTenantSlug = req.cookies.get('tenant_slug')?.value
    const { pathname } = req.nextUrl
    const segments = pathname.split('/').filter(Boolean)
    const rootSegment = segments[0]

    if (!rootSegment) {
        return NextResponse.next()
    }

    if (rootSegment.startsWith('_') || rootSegment.includes('.')) {
        return NextResponse.next()
    }

    if (PUBLIC_ROOT_SEGMENTS.has(rootSegment)) {
        return NextResponse.next()
    }

    const tenantSlug = rootSegment
    const isTenantLoginRoute = segments.length === 2 && segments[1] === 'login'
    const isTenantProtectedRoute = !isTenantLoginRoute

    // Protect tenant admin routes with tenant-bound session
    const isTenantSessionValid = Boolean(token && sessionTenantSlug && sessionTenantSlug === tenantSlug)
    if (tenantSlug && isTenantProtectedRoute && !isTenantSessionValid) {
        const loginUrl = new URL(`/${tenantSlug}/login`, req.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Prevent logged-in users from opening login for the same tenant
    if (tenantSlug && isTenantLoginRoute && isTenantSessionValid) {
        return NextResponse.redirect(new URL(`/${tenantSlug}`, req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/:tenant_slug', '/:tenant_slug/:path*'],
}
