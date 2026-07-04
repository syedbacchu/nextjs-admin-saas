import Link from 'next/link'
import ListImage from '@/components/ui/ListImage'
import { getCustomerAction } from '@/features/customers'

interface CustomerDetailsPageProps {
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

function formatAddressLabel(address: unknown): string {
    if (!address) return 'N/A'
    if (typeof address === 'string') return address || 'N/A'
    if (Array.isArray(address)) {
        const items = address.filter(Boolean) as Array<{ name?: string; address?: string }>
        if (items.length === 0) return 'N/A'
        return items.map((item) => item.name || item.address || 'N/A').join(', ')
    }
    return 'N/A'
}

export default async function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const customerId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !customerId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid customer route.
            </div>
        )
    }

    const res = await getCustomerAction(tenantSlug, customerId)

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load customer</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const customer = res.data

    return (
        <div className="mx-auto space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <ListImage image={customer.image} name={customer.name} fallbackText="C" sizeClassName="h-16 w-16" />
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
                            <p className="mt-1 text-sm text-slate-600">{customer.mobile}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/${tenantSlug}/customers`}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            Back
                        </Link>
                        <Link
                            href={`/${tenantSlug}/customers/${customer.id}/edit`}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Edit Customer
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Customer Info</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Mobile:</span> <span className="text-slate-600">{customer.mobile}</span></p>
                        <p><span className="font-medium text-slate-700">Email:</span> <span className="text-slate-600">{customer.email || 'N/A'}</span></p>
                        <div>
                            <p className="font-medium text-slate-700">Addresses:</p>
                            <div className="mt-2 space-y-3">
                                {Array.isArray(customer.address) && customer.address.length > 0 ? (
                                    customer.address.map((item, index) => (
                                        <div key={item.id || `${item.name}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                                            <p className="mt-1 text-sm text-slate-600">{item.address}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-600">{formatAddressLabel(customer.address)}</p>
                                )}
                            </div>
                        </div>
                        <p><span className="font-medium text-slate-700">Rate Status:</span> <span className="text-slate-600">{customer.rate_status || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Opening Balance:</span> <span className="text-slate-600">{formatBalance(customer.opening_balance)}</span></p>
                        <p><span className="font-medium text-slate-700">Status:</span> <span className="text-slate-600">{customer.status === 1 ? 'Active' : 'Inactive'}</span></p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Meta</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Created At:</span> <span className="text-slate-600">{formatDate(customer.created_at)}</span></p>
                        <p><span className="font-medium text-slate-700">Updated At:</span> <span className="text-slate-600">{formatDate(customer.updated_at)}</span></p>
                    </div>
                </div>
            </section>
        </div>
    )
}
