'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import LogoutButton from '@/components/LogoutButton'
import { CarFront, CreditCard, LayoutDashboard, Menu, PanelLeftClose, PanelLeftOpen, UserRound, X } from 'lucide-react'
import Image from "next/image";

export default function AdminHeader() {
    const { user, loading } = useAuthStore()
    const params = useParams<{ tenant_slug?: string }>()
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
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
            href: tenantSlug ? `/${tenantSlug}/profile` : '#',
            icon: UserRound,
            isActive: pathname?.startsWith(`/${tenantSlug}/profile`),
        },
        {
            name: 'Subscription',
            href: tenantSlug ? `/${tenantSlug}/subscription` : '#',
            icon: CreditCard,
            isActive: pathname?.startsWith(`/${tenantSlug}/subscription`),
        },
        {
            name: 'Vehicles',
            href: tenantSlug ? `/${tenantSlug}/vehicles` : '#',
            icon: CarFront,
            isActive: pathname?.startsWith(`/${tenantSlug}/vehicles`),
        },
    ]), [pathname, tenantSlug])

    if (loading) return null

    return (
        <>
            <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 md:hidden">
                <Link href={tenantSlug ? `/${tenantSlug}` : '/'} className="inline-flex items-center">
                    <Image
                        src={'/logo.png'}
                        alt={'Admin SaaS'}
                        width={120}
                        height={36}
                        className="h-10 w-auto"
                        priority
                    />
                </Link>
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-700"
                    aria-label="Open sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:sticky md:top-0 md:z-20 md:h-screen md:translate-x-0 md:transition-[width] ${
                    mobileOpen ? 'translate-x-0' : ''
                } ${collapsed ? 'md:w-20' : 'md:w-72'}`}
            >
                <div className={`flex items-center border-b border-slate-200 p-4 ${collapsed ? 'md:justify-center' : 'justify-between'}`}>
                    <Link href={tenantSlug ? `/${tenantSlug}` : '/'} className="inline-flex items-center">
                        <Image
                            src={'/logo.png'}
                            alt={'Admin SaaS'}
                            width={140}
                            height={40}
                            className={`${collapsed ? 'h-10 w-10 object-contain md:block' : 'h-12 w-auto'}`}
                            priority
                        />
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 md:hidden"
                            aria-label="Close sidebar"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setCollapsed((prev) => !prev)}
                            className="hidden rounded-lg border border-slate-200 p-1.5 text-slate-600 md:inline-flex"
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className={`px-4 pb-4 pt-4 ${collapsed ? 'md:px-2' : 'md:px-6'}`}>
                    {collapsed ? (
                        <div className="mx-auto hidden h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 md:flex">
                            {(user?.name?.charAt(0) || 'U').toUpperCase()}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs uppercase tracking-wider text-slate-500">Signed in as</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
                            {user?.email && <p className="mt-0.5 text-xs text-slate-600">{user.email}</p>}
                        </div>
                    )}
                </div>

                <nav className={`space-y-1 px-2 ${collapsed ? 'md:px-2' : 'md:px-3'}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            title={collapsed ? link.name : undefined}
                            className={`flex items-center rounded-lg py-2 text-sm font-medium transition-colors ${
                                collapsed ? 'justify-center px-2 md:px-2' : 'gap-2 px-3'
                            } ${
                                link.isActive
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <link.icon className="h-4 w-4" />
                            {!collapsed && link.name}
                        </Link>
                    ))}
                </nav>

                <div className={`mt-auto border-t border-slate-200 px-4 pt-4 pb-6 ${collapsed ? 'md:px-2' : 'md:px-6'}`}>
                    <LogoutButton compact={collapsed} />
                </div>
            </aside>
        </>
    )
}
