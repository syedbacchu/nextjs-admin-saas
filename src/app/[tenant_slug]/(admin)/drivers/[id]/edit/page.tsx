import DriverForm from '@/components/driver/DriverForm'
import { getDriverAction } from '@/services/driver/driver.actions'

interface EditDriverPageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

export default async function EditDriverPage({ params }: EditDriverPageProps) {
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

    return (
        <DriverForm
            tenantSlug={tenantSlug}
            driverId={driverId}
            initialData={res.data}
            submitLabel="Update Driver"
        />
    )
}
