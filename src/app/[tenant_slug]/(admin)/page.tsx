import { Metadata } from 'next'
import { getRequestLanguage } from '@/i18n/server'
import { translateUiText } from '@/i18n/ui'
import { getDashboardSummaryAction } from '@/features/dashboard'
import { constructMetadata } from '@/lib/seo'
import VehicleAlertsSlider from '@/features/dashboard/components/VehicleAlertsSlider'
import MaintenanceAlertsSlider from '@/features/dashboard/components/MaintenanceAlertsSlider'

export const revalidate = 10

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'Dashboard',
        description: 'View your transport business dashboard with key metrics, financial overview, and alerts.',
        noIndex: true,
    })
}

interface DashboardPageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

function formatCurrency(value: number | string | undefined, language: string): string {
    if (value === undefined || value === null || value === '') return translateUiText('N/A', language)
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (Number.isNaN(numValue)) return translateUiText('N/A', language)

    return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numValue)
}

function formatNumber(value: number | string | undefined, language: string): string {
    if (value === undefined || value === null || value === '') return translateUiText('N/A', language)
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (Number.isNaN(numValue)) return translateUiText('N/A', language)

    return new Intl.NumberFormat(language).format(numValue)
}

export default async function HomePage({ params }: DashboardPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const language = await getRequestLanguage()

    if (!tenantSlug) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                {translateUiText('Invalid Customer', language)}
            </div>
        )
    }

    const res = await getDashboardSummaryAction(tenantSlug)

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">{translateUiText('Failed to load dashboard', language)}</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || translateUiText('Something went wrong.', language)}</p>
            </div>
        )
    }

    const dashboard = res.data

    // Check if financial_summary is valid (not empty array)
    const hasFinancialData = Array.isArray(dashboard.financial_summary) === false &&
                           dashboard.financial_summary &&
                           dashboard.financial_summary.income &&
                           dashboard.financial_summary.expenses &&
                           dashboard.financial_summary.summary

    return (
        <div className="mx-auto space-y-6">
            {/* Header Section */}
            <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-blue-900">
                    {translateUiText('Welcome', language)}, {dashboard.tenant.company_name}
                </h1>
                <p className="mt-1 text-sm text-blue-700">
                    @{dashboard.tenant.company_username}
                </p>
            </section>

            {/* Entity Counts */}
            <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">{translateUiText('Entity Overview', language)}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
                                <span className="text-lg">🚗</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{translateUiText('Vehicles', language)}</p>
                                <p className="mt-1 text-2xl font-bold text-emerald-900">{dashboard.entity_counts.vehicles.total}</p>
                                <p className="text-xs text-emerald-600">{translateUiText('Active', language)}: {dashboard.entity_counts.vehicles.active}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500">
                                <span className="text-lg">👥</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">{translateUiText('Customers', language)}</p>
                                <p className="mt-1 text-2xl font-bold text-purple-900">{dashboard.entity_counts.customers.total}</p>
                                <p className="text-xs text-purple-600">{translateUiText('Active', language)}: {dashboard.entity_counts.customers.active}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                                <span className="text-lg">👨‍✈️</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{translateUiText('Drivers', language)}</p>
                                <p className="mt-1 text-2xl font-bold text-blue-900">{dashboard.entity_counts.drivers.total}</p>
                                <p className="text-xs text-blue-600">{translateUiText('Active', language)}: {dashboard.entity_counts.drivers.active}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
                                <span className="text-lg">🏢</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">{translateUiText('Suppliers', language)}</p>
                                <p className="mt-1 text-2xl font-bold text-orange-900">{dashboard.entity_counts.suppliers.total}</p>
                                <p className="text-xs text-orange-600">{translateUiText('Active', language)}: {dashboard.entity_counts.suppliers.active}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500">
                                <span className="text-lg">👷</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{translateUiText('Employees', language)}</p>
                                <p className="mt-1 text-2xl font-bold text-teal-900">{dashboard.entity_counts.employees.total}</p>
                                <p className="text-xs text-teal-600">{translateUiText('Active', language)}: {dashboard.entity_counts.employees.active}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500">
                                <span className="text-lg">🏪</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-pink-700">{translateUiText('Vendors', language)}</p>
                                <p className="mt-1 text-2xl font-bold text-pink-900">{dashboard.entity_counts.vendors.total}</p>
                                <p className="text-xs text-pink-600">{translateUiText('Active', language)}: {dashboard.entity_counts.vendors.active}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500">
                                <span className="text-lg">🤝</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{translateUiText('Helpers', language)}</p>
                                <p className="mt-1 text-2xl font-bold text-indigo-900">{dashboard.entity_counts.helpers.total}</p>
                                <p className="text-xs text-indigo-600">{translateUiText('Active', language)}: {dashboard.entity_counts.helpers.active}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500">
                                <span className="text-lg">👔</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{translateUiText('Supervisors', language)}</p>
                                <p className="mt-1 text-2xl font-bold text-cyan-900">{dashboard.entity_counts.supervisors.total}</p>
                                <p className="text-xs text-cyan-600">{translateUiText('Active', language)}: {dashboard.entity_counts.supervisors.active}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500">
                                <span className="text-lg">🏛️</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{translateUiText('Offices', language)}</p>
                                <p className="mt-1 text-2xl font-bold text-amber-900">{dashboard.entity_counts.offices.total}</p>
                                <p className="text-xs text-amber-600">{translateUiText('Active', language)}: {dashboard.entity_counts.offices.active}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500">
                                <span className="text-lg">🚛</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">{translateUiText('Trips', language)}</p>
                                <p className="mt-1 text-2xl font-bold text-rose-900">{dashboard.entity_counts.trips.total}</p>
                                <p className="text-xs text-rose-600">{translateUiText('Active', language)}: {dashboard.entity_counts.trips.active}</p>
                                <div className="mt-1 space-y-0.5">
                                    <p className="text-xs text-rose-600">{translateUiText('Today', language)}: {dashboard.entity_counts.trips.today}</p>
                                    <p className="text-xs text-rose-600">{translateUiText('This Month', language)}: {dashboard.entity_counts.trips.this_month}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Financial Summary */}
            <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">{translateUiText('Financial Summary', language)}</h2>

                {!hasFinancialData ? (
                    <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-500">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{translateUiText('No Financial Data Available', language)}</h3>
                                <p className="text-sm text-slate-600 mt-1">{translateUiText('Start creating trips to see your financial summary here.', language)}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Income */}
                        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <h3 className="text-lg font-bold text-emerald-800">{translateUiText('Income', language)}</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center pb-2 border-b border-emerald-200">
                                    <span className="text-emerald-700 font-medium">{translateUiText('Own Trips', language)}</span>
                                    <span className="font-bold text-emerald-900">{formatCurrency(dashboard.financial_summary.income.own_trip_income, language)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-emerald-200">
                                    <span className="text-emerald-700 font-medium">{translateUiText('Vendor Trips', language)}</span>
                                    <span className="font-bold text-emerald-900">{formatCurrency(dashboard.financial_summary.income.vendor_trip_income, language)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-emerald-200">
                                    <span className="text-emerald-700 font-medium">{translateUiText('Demurrage', language)}</span>
                                    <span className="font-bold text-emerald-900">{formatCurrency(dashboard.financial_summary.income.customer_demurrage_income, language)}</span>
                                </div>
                                <div className="pt-2">
                                    <p className="flex justify-between items-center text-base font-bold bg-emerald-200 rounded-lg px-4 py-2">
                                        <span className="text-emerald-800">{translateUiText('Total Income', language)}</span>
                                        <span className="text-emerald-900">{formatCurrency(dashboard.financial_summary.income.total_income, language)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Expenses */}
                        <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500">
                                    <span className="text-2xl">💸</span>
                                </div>
                                <h3 className="text-lg font-bold text-rose-800">{translateUiText('Expenses', language)}</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center pb-2 border-b border-rose-200">
                                    <span className="text-rose-700 font-medium">{translateUiText('Driver Cost', language)}</span>
                                    <span className="font-bold text-rose-900">{formatCurrency(dashboard.financial_summary.expenses.driver_cost, language)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-rose-200">
                                    <span className="text-rose-700 font-medium">{translateUiText('Fuel Cost', language)}</span>
                                    <span className="font-bold text-rose-900">{formatCurrency(dashboard.financial_summary.expenses.all_fuel_expense, language)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-rose-200">
                                    <span className="text-rose-700 font-medium">{translateUiText('Maintenance', language)}</span>
                                    <span className="font-bold text-rose-900">{formatCurrency(dashboard.financial_summary.expenses.maintenance_cost, language)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-rose-200">
                                    <span className="text-rose-700 font-medium">{translateUiText('Salary', language)}</span>
                                    <span className="font-bold text-rose-900">{formatCurrency(dashboard.financial_summary.expenses.salary_expense, language)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-rose-200">
                                    <span className="text-rose-700 font-medium">{translateUiText('Office', language)}</span>
                                    <span className="font-bold text-rose-900">{formatCurrency(dashboard.financial_summary.expenses.office_expense, language)}</span>
                                </div>
                                <div className="pt-2">
                                    <p className="flex justify-between items-center text-base font-bold bg-rose-200 rounded-lg px-4 py-2">
                                        <span className="text-rose-800">{translateUiText('Total Expenses', language)}</span>
                                        <span className="text-rose-900">{formatCurrency(dashboard.financial_summary.expenses.total_expense, language)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <h3 className="text-lg font-bold text-blue-800">{translateUiText('Summary', language)}</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className={`flex justify-between items-center p-3 rounded-xl ${dashboard.financial_summary.summary.net_profit >= 0 ? 'bg-emerald-200' : 'bg-rose-200'}`}>
                                    <span className={`font-bold ${dashboard.financial_summary.summary.net_profit >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>{translateUiText('Net Profit', language)}</span>
                                    <span className={`text-xl font-bold ${dashboard.financial_summary.summary.net_profit >= 0 ? 'text-emerald-900' : 'text-rose-900'}`}>{formatCurrency(dashboard.financial_summary.summary.net_profit, language)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                                    <span className="text-blue-700 font-medium">{translateUiText('Customer Due', language)}</span>
                                    <span className="font-bold text-blue-900">{formatCurrency(dashboard.financial_summary.summary.customer_due_amount, language)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                                    <span className="text-blue-700 font-medium">{translateUiText('Vendor Due', language)}</span>
                                    <span className="font-bold text-blue-900">{formatCurrency(dashboard.financial_summary.summary.vendor_due_amount, language)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-700 font-medium">{translateUiText('Driver Due', language)}</span>
                                    <span className="font-bold text-blue-900">{formatCurrency(dashboard.financial_summary.summary.driver_due_amount, language)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Alerts Section - Component-based */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Vehicle Alerts Slider */}
                <section className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
                                <span className="text-xl">🚗</span>
                            </div>
                            <h2 className="text-lg font-semibold text-orange-900">{translateUiText('Vehicle Alerts', language)}</h2>
                        </div>
                        <div className="flex gap-2">
                            {dashboard.vehicle_alerts.expired_count > 0 && (
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-500 text-white shadow-sm">
                                    {dashboard.vehicle_alerts.expired_count} {translateUiText('Expired', language)}
                                </span>
                            )}
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-orange-500 text-white shadow-sm">
                                {dashboard.vehicle_alerts.total_alerts} {translateUiText('Total', language)}
                            </span>
                        </div>
                    </div>

                    <VehicleAlertsSlider
                        vehicles={dashboard.vehicle_alerts.vehicles}
                        expiredCount={dashboard.vehicle_alerts.expired_count}
                        totalAlerts={dashboard.vehicle_alerts.total_alerts}
                        tenantSlug={tenantSlug}
                    />

                    {/* Show More Button */}
                    <div className="flex justify-end mt-4">
                        <a
                            href={`/${tenantSlug}/vehicle-alerts`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            {translateUiText('Show More', language)}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                    </div>
                </section>

                {/* Maintenance Alerts Slider */}
                <section className="rounded-2xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500">
                                <span className="text-xl">🔧</span>
                            </div>
                            <h2 className="text-lg font-semibold text-cyan-900">{translateUiText('Maintenance Alerts', language)}</h2>
                        </div>
                        <div className="flex gap-2">
                            {dashboard.maintenance_alerts.overdue_count > 0 && (
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-500 text-white shadow-sm">
                                    {dashboard.maintenance_alerts.overdue_count} {translateUiText('Overdue', language)}
                                </span>
                            )}
                            {dashboard.maintenance_alerts.critical_count > 0 && (
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-orange-500 text-white shadow-sm">
                                    {dashboard.maintenance_alerts.critical_count} {translateUiText('Critical', language)}
                                </span>
                            )}
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-cyan-500 text-white shadow-sm">
                                {dashboard.maintenance_alerts.total_alerts} {translateUiText('Total', language)}
                            </span>
                        </div>
                    </div>

                    <MaintenanceAlertsSlider
                        services={dashboard.maintenance_alerts.services}
                        overdueCount={dashboard.maintenance_alerts.overdue_count}
                        criticalCount={dashboard.maintenance_alerts.critical_count}
                        totalAlerts={dashboard.maintenance_alerts.total_alerts}
                        tenantSlug={tenantSlug}
                    />

                    {/* Show More Button */}
                    <div className="flex justify-end mt-4">
                        <a
                            href={`/${tenantSlug}/maintenance-alerts`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            {translateUiText('Show More', language)}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    )
}
