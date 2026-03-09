import VehicleForm from '@/components/vehicle/VehicleForm'
import { getVehicleAction } from '@/services/vehicle/vehicle.actions'

interface EditVehiclePageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const vehicleId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !vehicleId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid vehicle route.
            </div>
        )
    }

    const res = await getVehicleAction(tenantSlug, vehicleId)

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load vehicle</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    return (
        <VehicleForm
            tenantSlug={tenantSlug}
            vehicleId={vehicleId}
            initialData={res.data}
            submitLabel="Update Vehicle"
        />
    )
}
