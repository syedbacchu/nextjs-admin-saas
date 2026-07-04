'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import { VehicleLimitGuard } from '@/features/feature-check'
import { deleteVehicleClient, getVehiclesAction, VehicleListResponse } from '@/features/vehicles'
import { useVehicleColumns } from '@/features/vehicles/hooks/useVehicleColumns'
import { useVehicleCount } from '@/features/vehicles/hooks/useVehicleCount'

const EMPTY_VEHICLE_LIST: VehicleListResponse = {
    success: false,
    message: 'Invalid tenant',
    status: 400,
    error_message: '',
    data: {
        total_count: 0,
        total_page: 1,
        per_page: 20,
        current_page: 1,
        data: [],
    },
}

export default function VehiclesListPage() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [refreshKey, setRefreshKey] = useState(0)

    const vehicleCount = useVehicleCount(tenantSlug)

    async function handleDelete(id: number | string) {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteVehicleClient(tenantSlug, id)

        if (res.success) {
            toast.success(res.message || 'Vehicle deleted successfully')
            setRefreshKey((prev) => prev + 1)
        } else {
            toast.error(res.message || 'Failed to delete vehicle')
        }
    }

    const columns = useVehicleColumns(tenantSlug, handleDelete)

    async function fetchVehicles(page: number, search: string) {
        if (!tenantSlug) return EMPTY_VEHICLE_LIST
        return getVehiclesAction(tenantSlug, page, search)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Vehicle Management</h1>
                <VehicleLimitGuard currentUsage={vehicleCount}>
                    <button
                        onClick={() => router.push(`/${tenantSlug}/vehicles/create`)}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        + Add Vehicle
                    </button>
                </VehicleLimitGuard>
            </div>

            <DynamicTable
                key={refreshKey}
                title="Vehicles"
                fetchData={fetchVehicles}
                columns={columns}
            />
        </div>
    )
}
