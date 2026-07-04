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

export function proxy(req: NextRequest) {
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
    const tenantAuthPublicRoutes = new Set(['login', 'forgot-password', 'reset-password'])
    const isTenantAuthPublicRoute = segments.length === 2 && tenantAuthPublicRoutes.has(segments[1])
    const isTenantProtectedRoute = !isTenantAuthPublicRoute

    const isTenantSessionValid = Boolean(token && sessionTenantSlug && sessionTenantSlug === tenantSlug)
    if (tenantSlug && isTenantProtectedRoute && !isTenantSessionValid) {
        const loginUrl = new URL(`/${tenantSlug}/login`, req.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    if (tenantSlug && isTenantAuthPublicRoute && isTenantSessionValid) {
        return NextResponse.redirect(new URL(`/${tenantSlug}`, req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next|api|assets|favicon.ico|logo.png|.*\\..*).*)',
    ],
}
