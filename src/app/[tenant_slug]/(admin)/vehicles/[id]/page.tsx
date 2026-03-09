import Link from 'next/link'
import { getVehicleAction } from '@/services/vehicle/vehicle.actions'

interface VehicleDetailsPageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

function formatDate(value?: string): string {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export default async function VehicleDetailsPage({ params }: VehicleDetailsPageProps) {
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

    const vehicle = res.data

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{vehicle.registration_no}</h1>
                        <p className="mt-1 text-sm text-slate-600 capitalize">{vehicle.vehicle_type}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/${tenantSlug}/vehicles`}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            Back
                        </Link>
                        <Link
                            href={`/${tenantSlug}/vehicles/${vehicle.id}/edit`}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Edit Vehicle
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Vehicle Info</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Brand:</span> <span className="text-slate-600">{vehicle.brand}</span></p>
                        <p><span className="font-medium text-slate-700">Model:</span> <span className="text-slate-600">{vehicle.model}</span></p>
                        <p><span className="font-medium text-slate-700">Manufacturing Year:</span> <span className="text-slate-600">{vehicle.manufacturing_year}</span></p>
                        <p><span className="font-medium text-slate-700">Color:</span> <span className="text-slate-600">{vehicle.color || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Status:</span> <span className="text-slate-600">{vehicle.status === 1 ? 'Active' : 'Inactive'}</span></p>
                        <p><span className="font-medium text-slate-700">Driver Count:</span> <span className="text-slate-600">{vehicle.driver_count ?? 0}</span></p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Meta</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Created At:</span> <span className="text-slate-600">{formatDate(vehicle.created_at)}</span></p>
                        <p><span className="font-medium text-slate-700">Updated At:</span> <span className="text-slate-600">{formatDate(vehicle.updated_at)}</span></p>
                        <p><span className="font-medium text-slate-700">Notes:</span> <span className="text-slate-600">{vehicle.notes || 'N/A'}</span></p>
                    </div>
                </div>
            </section>
        </div>
    )
}
