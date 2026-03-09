'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import TableActions from '@/components/ui/TableActions'
import { ColumnDef } from '@/types/api'
import { getVehiclesAction } from '@/services/vehicle/vehicle.actions'
import { deleteVehicleClient } from '@/services/vehicle/vehicle.client'
import { Vehicle, VehicleListResponse } from '@/services/vehicle/vehicle.types'

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

export default function VehiclesPage() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [refreshKey, setRefreshKey] = useState(0)

    const columns: ColumnDef<Vehicle>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Registration', accessorKey: 'registration_no' },
        { header: 'Type', accessorKey: 'vehicle_type' },
        { header: 'Brand', accessorKey: 'brand' },
        { header: 'Model', accessorKey: 'model' },
        { header: 'Year', accessorKey: 'manufacturing_year' },
        {
            header: 'Status',
            cell: (item) => (
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    item.status === 1
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                }`}>
                    {item.status === 1 ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <TableActions
                    id={item.id}
                    hasView
                    hasEdit
                    hasDelete
                    viewLink={`/${tenantSlug}/vehicles/${item.id}`}
                    editLink={`/${tenantSlug}/vehicles/${item.id}/edit`}
                    onDelete={handleDelete}
                />
            ),
        },
    ]

    async function fetchVehicles(page: number, search: string) {
        if (!tenantSlug) return EMPTY_VEHICLE_LIST
        return getVehiclesAction(tenantSlug, page, search)
    }

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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Vehicle Management</h1>
                <button
                    onClick={() => router.push(`/${tenantSlug}/vehicles/create`)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    + Add Vehicle
                </button>
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
