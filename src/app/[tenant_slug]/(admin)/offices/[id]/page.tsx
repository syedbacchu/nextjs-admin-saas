import Link from 'next/link'
import { getOfficeAction } from '@/features/offices'

interface OfficeDetailsPageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
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

function formatBalance(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined' || value === '') return 'N/A'
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export default async function OfficeDetailsPage({ params }: OfficeDetailsPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const officeId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !officeId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid office route.
            </div>
        )
    }

    const res = await getOfficeAction(tenantSlug, officeId)

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load office</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const office = res.data

    return (
        <div className="mx-auto space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{office.branch_name}</h1>
                        <p className="mt-1 text-sm text-slate-600">{office.address || 'N/A'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/${tenantSlug}/offices`}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            Back
                        </Link>
                        <Link
                            href={`/${tenantSlug}/offices/${office.id}/edit`}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Edit Office
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Office Info</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Branch Name:</span> <span className="text-slate-600">{office.branch_name}</span></p>
                        <p><span className="font-medium text-slate-700">Opening Balance:</span> <span className="text-slate-600">{formatBalance(office.opening_balance)}</span></p>
                        <p><span className="font-medium text-slate-700">Address:</span> <span className="text-slate-600">{office.address || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Status:</span> <span className="text-slate-600">{office.status === 1 ? 'Active' : 'Inactive'}</span></p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Meta</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Created At:</span> <span className="text-slate-600">{formatDate(office.created_at)}</span></p>
                        <p><span className="font-medium text-slate-700">Updated At:</span> <span className="text-slate-600">{formatDate(office.updated_at)}</span></p>
                    </div>
                </div>
            </section>
        </div>
    )
}
