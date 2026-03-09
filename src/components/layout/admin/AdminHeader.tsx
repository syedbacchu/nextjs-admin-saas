'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import LogoutButton from '@/components/LogoutButton'
import { LayoutDashboard, UserRound } from 'lucide-react'
import Image from "next/image";

export default function AdminHeader() {
    const { user, loading } = useAuthStore()
    const params = useParams<{ tenant_slug?: string }>()
    const pathname = usePathname()
    const tenantSlug = typeof params?.tenant_slug === 'string' ? params.tenant_slug : ''

    const navLinks = useMemo(() => ([
        {
            name: 'Dashboard',
            href: tenantSlug ? `/${tenantSlug}` : '#',
            icon: LayoutDashboard,
            isActive: pathname === `/${tenantSlug}`,
        },
        {
            name: 'Profile',
            href: tenantSlug ? `/${tenantSlug}/profile/update` : '#',
            icon: UserRound,
            isActive: pathname?.startsWith(`/${tenantSlug}/profile`),
        },
    ]), [pathname, tenantSlug])

    if (loading) return null

    return (
        <aside className="w-full border-b bg-white md:sticky md:top-0 md:min-h-screen md:w-72 md:border-b-0 md:border-r">
            <div className="p-4 md:p-6">
                <Link href={tenantSlug ? `/${tenantSlug}` : '/'} className="inline-flex items-center">
                        <Image
                            src={'/logo.png'}
                            alt={'Admin SaaS'}
                            width={140}
                            height={40}
                            className="h-12 w-auto"
                            priority
                        />
                    </Link>
            </div>

            <div className="px-4 pb-4 md:px-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Signed in as</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
                    {user?.email && <p className="mt-0.5 text-xs text-slate-600">{user.email}</p>}
                </div>
            </div>

            <nav className="space-y-1 px-2 md:px-3">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            link.isActive
                                ? 'bg-slate-900 text-white'
                                : 'text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        <link.icon className="h-4 w-4" />
                        {link.name}
                    </Link>
                ))}
            </nav>

            <div className="mt-6 border-t border-slate-200 px-4 pt-4 pb-6 md:px-6">
                <LogoutButton />
            </div>
        </aside>
    )
}
