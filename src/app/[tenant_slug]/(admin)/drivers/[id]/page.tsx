import Link from 'next/link'
import { getDriverAction } from '@/services/driver/driver.actions'

interface DriverDetailsPageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

function hasDriverLogin(driver: {
    has_login_account?: boolean | null
    login_enabled?: boolean | null
    login_account?: unknown
}): boolean {
    if (typeof driver.login_enabled === 'boolean') return driver.login_enabled
    if (typeof driver.has_login_account === 'boolean') return driver.has_login_account
    return Boolean(driver.login_account)
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

export default async function DriverDetailsPage({ params }: DriverDetailsPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const driverId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !driverId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid driver route.
            </div>
        )
    }

    const res = await getDriverAction(tenantSlug, driverId)

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load driver</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const driver = res.data
    const isLoginEnabled = hasDriverLogin(driver)
    const loginAccount = driver.login_account

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{driver.name}</h1>
                        <p className="mt-1 text-sm text-slate-600">{driver.phone}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/${tenantSlug}/drivers`}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            Back
                        </Link>
                        {isLoginEnabled ? (
                            <span className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                                Login Enabled
                            </span>
                        ) : (
                            <Link
                                href={`/${tenantSlug}/drivers/${driver.id}/create-login`}
                                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                            >
                                Create Login
                            </Link>
                        )}
                        <Link
                            href={`/${tenantSlug}/drivers/${driver.id}/edit`}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Edit Driver
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Driver Info</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">License No:</span> <span className="text-slate-600">{driver.license_no}</span></p>
                        <p><span className="font-medium text-slate-700">NID No:</span> <span className="text-slate-600">{driver.nid_no || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Joining Date:</span> <span className="text-slate-600">{formatDate(driver.joining_date)}</span></p>
                        <p><span className="font-medium text-slate-700">Address:</span> <span className="text-slate-600">{driver.address || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Vehicle:</span> <span className="text-slate-600">{driver.vehicle?.registration_no || 'Unassigned'}</span></p>
                        <p><span className="font-medium text-slate-700">Status:</span> <span className="text-slate-600">{driver.status === 1 ? 'Active' : 'Inactive'}</span></p>
                        <p><span className="font-medium text-slate-700">Login:</span> <span className="text-slate-600">{isLoginEnabled ? 'Enabled' : 'Not Enabled'}</span></p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Meta</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Login Account:</span> <span className="text-slate-600">{driver.has_login_account ? 'Yes' : 'No'}</span></p>
                        <p><span className="font-medium text-slate-700">Login Enabled:</span> <span className="text-slate-600">{driver.login_enabled ? 'Yes' : 'No'}</span></p>
                        <p><span className="font-medium text-slate-700">Login Username:</span> <span className="text-slate-600">{loginAccount?.username || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Login Email:</span> <span className="text-slate-600">{loginAccount?.email || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Login Phone:</span> <span className="text-slate-600">{loginAccount?.phone || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Created At:</span> <span className="text-slate-600">{formatDate(driver.created_at)}</span></p>
                        <p><span className="font-medium text-slate-700">Updated At:</span> <span className="text-slate-600">{formatDate(driver.updated_at)}</span></p>
                        <p><span className="font-medium text-slate-700">Notes:</span> <span className="text-slate-600">{driver.notes || 'N/A'}</span></p>
                    </div>
                </div>
            </section>
        </div>
    )
}
