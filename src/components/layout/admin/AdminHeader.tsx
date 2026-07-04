'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import {
    Building2,
    CarFront,
    ChevronDown,
    CreditCard,
    LayoutDashboard,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    ReceiptText,
    Settings,
    User,
    UserRound,
    Users,
    X,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useI18n } from '@/components/providers/I18nProvider'
import { useFeatureCheck } from '@/features/feature-check'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import type { ProfileUser } from '@/features/profile'
import LogoutButton from "@/features/auth/components/LogoutButton";

const DEFAULT_LOGO_SRC = '/logo.png'
const DEFAULT_AVATAR_SRC = '/assets/images/avatar.png'

type MenuLeaf = {
    name: string
    href: string
    icon: LucideIcon
    exact?: boolean
    featureKey?: string
}

type MenuSection = {
    id: string
    name: string
    icon: LucideIcon
    href?: string
    exact?: boolean
    featureKey?: string
    children?: MenuLeaf[]
}

function isLinkActive(pathname: string | null, href: string, exact: boolean = false): boolean {
    if (!pathname || !href || href === '#') return false
    return exact ? pathname === href : pathname.startsWith(href)
}

interface AdminHeaderProps {
    logoSrc?: string | null
    currentUser?: ProfileUser | null
}

export default function AdminHeader({ logoSrc, currentUser = null }: AdminHeaderProps) {
    const { user, loading } = useAuthStore()
    const { t } = useI18n()
    const { canUse } = useFeatureCheck()
    const params = useParams<{ tenant_slug?: string }>()
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const tenantSlug = typeof params?.tenant_slug === 'string' ? params.tenant_slug : ''
    // Always show default logo.png if no custom logo is provided or if it's an empty string
    const resolvedLogoSrc = (logoSrc || '').trim() || DEFAULT_LOGO_SRC
    const activeUser = currentUser || user
    const userImageSrc = (activeUser?.image || '').trim() || DEFAULT_AVATAR_SRC
    const menuSections = useMemo<MenuSection[]>(() => {
        const base = tenantSlug ? `/${tenantSlug}` : '#'

        const allSections: MenuSection[] = [
            {
                id: 'dashboard',
                name: t('admin', 'dashboard'),
                href: base,
                icon: LayoutDashboard,
                exact: true,
            },
            {
                id: 'setup',
                name: t('admin', 'setup'),
                icon: Building2,
                children: [
                    { name: t('admin', 'settings'), href: tenantSlug ? `${base}/settings` : '#', icon: Settings, featureKey: 'support.settings' },
                    { name: t('admin', 'customers'), href: tenantSlug ? `${base}/customers` : '#', icon: User, featureKey: 'customer.management' },
                    { name: t('admin', 'offices'), href: tenantSlug ? `${base}/offices` : '#', icon: Building2, featureKey: 'office.management'  },
                    { name: t('admin', 'files'), href: tenantSlug ? `${base}/files` : '#', icon: Building2, featureKey: 'data.file_management'  },
                ],
            },

            {
                id: 'expense',
                name: t('admin', 'expense'),
                icon: ReceiptText,
                featureKey: 'finance.daily_office_expenses',
                children: [
                    { name: t('admin', 'officeExpenses'), href: tenantSlug ? `${base}/daily-office-expenses` : '#', icon: ReceiptText },
                ],
            },

            {
                id: 'hr-payroll',
                name: t('admin', 'hrPayroll'),
                icon: Users,
                children: [
                    { name: t('admin', 'employees'), href: tenantSlug ? `${base}/employees` : '#', icon: Users, featureKey:'employee.management' },
                    { name: t('admin', 'attendances'), href: tenantSlug ? `${base}/attendances` : '#', icon: Users, featureKey:'hr.attendance_leave' },
                    { name: t('admin', 'monthlySalary'), href: tenantSlug ? `${base}/salary-expenses` : '#', icon: ReceiptText, featureKey:'payroll.salary_commission' },
                    { name: t('admin', 'bonuses'), href: tenantSlug ? `${base}/bonuses` : '#', icon: Users, featureKey:'payroll.bonus_management' },
                    { name: t('admin', 'advanceSalaries'), href: tenantSlug ? `${base}/advance-salaries` : '#', icon: Users, featureKey:'payroll.advance_salary' },
                    { name: t('admin', 'loans'), href: tenantSlug ? `${base}/loans` : '#', icon: Users, featureKey:'payroll.loan_management' },
                    { name: t('admin', 'generateSalaries'), href: tenantSlug ? `${base}/generate-salaries` : '#', icon: ReceiptText, featureKey:'payroll.salary_sheet_generation' },
                ],
                featureKey: 'hr.payroll',
            },
            {
                id: 'accounts',
                name: t('admin', 'accounts'),
                icon: CreditCard,
                children: [
                    { name: t('admin', 'employeeLedger'), href: tenantSlug ? `${base}/employee-ledger` : '#', icon: ReceiptText, featureKey:'employee.ledger' },

                ],
            },
            {
                id: 'financial-report',
                name: t('admin', 'financialReport'),
                icon: ReceiptText,
                featureKey: 'reports.basic',
                children: [
                    { name: t('admin', 'yearlyProfitLossReport'), href: tenantSlug ? `${base}/reports/yearly-profit-loss` : '#', icon: ReceiptText, featureKey: 'reports.profit_loss' },
                ],
            },

            {
                id: 'user-control',
                name: t('admin', 'userControl'),
                icon: UserRound,
                children: [
                    { name: t('admin', 'profile'), href: tenantSlug ? `${base}/profile` : '#', icon: UserRound },
                    { name: t('admin', 'staff'), href: tenantSlug ? `${base}/staff` : '#', featureKey: 'staff.multi_user_access', icon: Users },
                    { name: t('admin', 'subscription'), href: tenantSlug ? `${base}/subscription` : '#', icon: CreditCard },
                ],
            },
        ]

        // Filter sections based on feature access
        const filteredSections = allSections.filter(section => {
            if (section.featureKey && !canUse(section.featureKey)) {
                return false
            }

            // Filter children if they have feature keys
            if (section.children) {
                section.children = section.children.filter(child => {
                    if ('featureKey' in child && child.featureKey && !canUse(child.featureKey)) {
                        return false
                    }
                    return true
                })

                // Only show section if it has children or direct href
                return section.children.length > 0 || section.href
            }

            return true
        })

        return filteredSections
    }, [t, tenantSlug, canUse])

    const collapsedLinks = useMemo<MenuLeaf[]>(() => {
        return menuSections.flatMap((section) => {
            if (section.children && section.children.length > 0) return section.children
            if (section.href) return [{ name: section.name, href: section.href, icon: section.icon, exact: section.exact }]
            return []
        })
    }, [menuSections])

    const [sectionOpenOverrides, setSectionOpenOverrides] = useState<Record<string, boolean>>({})

    if (loading && !currentUser) return null

    return (
        <>
            <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 md:hidden">
                <Link href={tenantSlug ? `/${tenantSlug}` : '/'} className="inline-flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={resolvedLogoSrc}
                        alt="Transport"
                        className="h-14 w-auto object-contain"
                        onError={(event) => {
                            event.currentTarget.src = DEFAULT_LOGO_SRC
                        }}
                    />
                </Link>
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-700"
                    aria-label={t('admin', 'openSidebar')}
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            {mobileOpen && (
                <button
                    type="button"
                    aria-label={t('admin', 'closeSidebar')}
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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={resolvedLogoSrc}
                            alt="Transport"
                            className={`${
                                collapsed
                                    ? 'h-16 w-40 object-contain md:block'
                                    : 'h-18 w-auto max-w-[260px] object-contain'
                            }`}
                            onError={(event) => {
                                event.currentTarget.src = DEFAULT_LOGO_SRC
                            }}
                        />
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 md:hidden"
                            aria-label={t('admin', 'closeSidebar')}
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setCollapsed((prev) => !prev)}
                            className="hidden rounded-lg border border-slate-200 p-1.5 text-slate-600 md:inline-flex"
                            aria-label={collapsed ? t('admin', 'expandSidebar') : t('admin', 'collapseSidebar')}
                        >
                            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className={`px-4 pb-4 pt-4 ${collapsed ? 'md:px-2' : 'md:px-6'}`}>
                    {collapsed ? (
                        <div className="mx-auto hidden h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100 md:flex">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={userImageSrc}
                                alt={activeUser?.name || t('admin', 'user')}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                    event.currentTarget.src = DEFAULT_AVATAR_SRC
                                }}
                            />
                        </div>
                    ) : (
                        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-white">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={userImageSrc}
                                        alt={activeUser?.name || t('admin', 'user')}
                                        className="h-full w-full object-cover"
                                        onError={(event) => {
                                            event.currentTarget.src = DEFAULT_AVATAR_SRC
                                        }}
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                                        {activeUser?.name || t('admin', 'user')}
                                    </p>
                                    {activeUser?.email && <p className="mt-0.5 truncate text-xs text-slate-600">{activeUser.email}</p>}
                                </div>
                            </div>
                            <LanguageSwitcher className="block" />
                        </div>
                    )}
                </div>

                <nav className={`space-y-2 overflow-y-auto px-2 ${collapsed ? 'md:px-2' : 'md:px-3'}`}>
                    {collapsed ? (
                        collapsedLinks.map((link) => {
                            const linkIsActive = isLinkActive(pathname, link.href, Boolean(link.exact))

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    title={link.name}
                                    className={`flex items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
                                        linkIsActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    <link.icon className="h-4 w-4" />
                                </Link>
                            )
                        })
                    ) : (
                        menuSections.map((section) => {
                            const sectionIsActive = section.href
                                ? isLinkActive(pathname, section.href, Boolean(section.exact))
                                : Boolean(section.children?.some((child) => isLinkActive(pathname, child.href, Boolean(child.exact))))
                            const sectionIsOpen = sectionOpenOverrides[section.id] ?? sectionIsActive

                            if (section.href) {
                                return (
                                    <Link
                                        key={section.id}
                                        href={section.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                            sectionIsActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        <section.icon className="h-4 w-4" />
                                        {section.name}
                                    </Link>
                                )
                            }

                            return (
                                <div key={section.id} className="space-y-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSectionOpenOverrides((prev) => ({
                                                ...prev,
                                                [section.id]: !(prev[section.id] ?? sectionIsActive),
                                            }))
                                        }
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                                            sectionIsActive ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-100'
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <section.icon className="h-4 w-4" />
                                            {section.name}
                                        </span>
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform ${sectionIsOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {sectionIsOpen && (
                                        <div className="space-y-1 pl-9">
                                            {section.children?.map((child) => {
                                                const childIsActive = isLinkActive(pathname, child.href, Boolean(child.exact))

                                                return (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        onClick={() => setMobileOpen(false)}
                                                        className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                                                            childIsActive
                                                                ? 'bg-slate-100 font-medium text-slate-900'
                                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                        }`}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </nav>

                <div className={`mt-auto border-t border-slate-200 px-4 pb-6 pt-4 ${collapsed ? 'md:px-2' : 'md:px-6'}`}>
                    <LogoutButton compact={collapsed} />
                </div>
            </aside>
        </>
    )
}
