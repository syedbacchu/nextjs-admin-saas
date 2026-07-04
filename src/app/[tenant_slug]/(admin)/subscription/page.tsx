import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import { getSubscriptionDetailsAction } from '@/features/subscription'

interface SubscriptionPageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

export async function generateMetadata({ params }: SubscriptionPageProps): Promise<Metadata> {
    const { tenant_slug } = await params
    return constructMetadata({
        title: `Subscription - ${tenant_slug}`,
        description: 'View your subscription details and payment summary',
        noIndex: true,
    })
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

function formatFeatureKey(key: string): string {
    return key
        .replace(/\./g, ' • ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default async function SubscriptionPage({ params }: SubscriptionPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()

    if (!tenantSlug) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid tenant route.
            </div>
        )
    }

    const res = await getSubscriptionDetailsAction(tenantSlug)

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load subscription details</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const details = res.data
    const subscription = details.subscription
    const paymentSummary = details.payment_summary
    const featureEntries = Object.entries(details.features || {}).sort(([a], [b]) => a.localeCompare(b))

    return (
        <div className="mx-auto space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Subscription Details</h1>
                        <p className="mt-1 text-sm text-slate-600">Plan status, billing summary, and enabled features.</p>
                    </div>

                    <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            details.package_active
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                        }`}
                    >
                        {details.package_active ? 'Package Active' : 'Package Inactive'}
                    </span>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Plan Info</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Status:</span> <span className="text-slate-600 capitalize">{subscription?.status || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Plan ID:</span> <span className="text-slate-600">{subscription?.plan_id ?? 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Start Date:</span> <span className="text-slate-600">{formatDate(subscription?.starts_at)}</span></p>
                        <p><span className="font-medium text-slate-700">End Date:</span> <span className="text-slate-600">{formatDate(subscription?.ends_at)}</span></p>
                        <p><span className="font-medium text-slate-700">Grace End:</span> <span className="text-slate-600">{formatDate(subscription?.grace_ends_at)}</span></p>
                        <p><span className="font-medium text-slate-700">Auto Renew:</span> <span className="text-slate-600">{subscription?.auto_renew === 1 ? 'Yes' : 'No'}</span></p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Payment Summary</h2>
                    <div className="mt-4 space-y-4 text-sm">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Paid Amount</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                {paymentSummary?.currency || 'BDT'} {paymentSummary?.paid_amount ?? 0}
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Due Amount</p>
                            <p className="mt-1 text-2xl font-bold text-rose-700">
                                {paymentSummary?.currency || 'BDT'} {paymentSummary?.due_amount ?? 0}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Enabled Features</h2>

                {featureEntries.length === 0 ? (
                    <p className="mt-4 text-sm text-slate-600">No feature data available.</p>
                ) : (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {featureEntries.map(([key, enabled]) => (
                            <div
                                key={key}
                                className={`rounded-lg border px-3 py-2 text-sm ${
                                    enabled
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                        : 'border-slate-200 bg-slate-50 text-slate-500'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span className="font-medium">{formatFeatureKey(key)}</span>
                                    <span className="text-xs font-semibold uppercase">
                                        {enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
