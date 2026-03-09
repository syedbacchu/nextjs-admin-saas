import { getDashboardAction } from '@/services/dashboard/dashboard.actions'

export const revalidate = 10

interface DashboardPageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

function formatDate(value?: string | null): string {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export default async function HomePage({ params }: DashboardPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()

    if (!tenantSlug) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid tenant route.
            </div>
        )
    }

    const res = await getDashboardAction(tenantSlug)

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load dashboard</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const dashboard = res.data
    const activeSubscription = dashboard.package?.active_subscription

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">
                    Welcome, {dashboard.tenant.company_name}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Tenant: @{dashboard.tenant.company_username}
                </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Package</p>
                    <p className={`mt-2 text-lg font-bold ${dashboard.package.is_active ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {dashboard.package.is_active ? 'Active' : 'Inactive'}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Payments</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{dashboard.payments.total}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Verified Payments</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{dashboard.payments.verified}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Paid Amount</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{dashboard.payments.total_paid_amount}</p>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Active Subscription</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Status:</span> <span className="text-slate-600 capitalize">{activeSubscription?.status || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Plan ID:</span> <span className="text-slate-600">{activeSubscription?.plan_id ?? 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Starts At:</span> <span className="text-slate-600">{formatDate(activeSubscription?.starts_at)}</span></p>
                        <p><span className="font-medium text-slate-700">Ends At:</span> <span className="text-slate-600">{formatDate(activeSubscription?.ends_at)}</span></p>
                        <p><span className="font-medium text-slate-700">Auto Renew:</span> <span className="text-slate-600">{activeSubscription?.auto_renew === 1 ? 'Yes' : 'No'}</span></p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Feature Summary</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Total Features:</span> <span className="text-slate-600">{dashboard.feature_summary.total_features}</span></p>
                        <p><span className="font-medium text-slate-700">Enabled Features:</span> <span className="text-slate-600">{dashboard.feature_summary.enabled_features}</span></p>
                        <p><span className="font-medium text-slate-700">Pending Payments:</span> <span className="text-slate-600">{dashboard.payments.pending}</span></p>
                    </div>
                </div>
            </section>
        </div>
    )
}
