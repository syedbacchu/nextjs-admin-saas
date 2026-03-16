import DriverLoginForm from '@/components/driver/DriverLoginForm'
import { getDriverAction } from '@/services/driver/driver.actions'
import Link from 'next/link'

interface DriverCreateLoginPageProps {
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

export default async function DriverCreateLoginPage({ params }: DriverCreateLoginPageProps) {
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

    if (hasDriverLogin(res.data)) {
        return (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <h1 className="text-lg font-bold text-blue-800">Login already enabled</h1>
                <p className="mt-1 text-sm text-blue-700">
                    This driver already has a login account. You can update login fields from the edit driver form.
                </p>
                <div className="mt-4 flex items-center gap-2">
                    <Link
                        href={`/${tenantSlug}/drivers/${driverId}`}
                        className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                    >
                        Back to Driver
                    </Link>
                    <Link
                        href={`/${tenantSlug}/drivers/${driverId}/edit`}
                        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                        Edit Driver
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <DriverLoginForm
            tenantSlug={tenantSlug}
            driverId={driverId}
            initialName={res.data.name}
            initialPhone={res.data.phone}
        />
    )
}
