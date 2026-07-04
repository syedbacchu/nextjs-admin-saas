'use client'

import ListImage from '@/components/ui/ListImage'
import TableActions from '@/components/ui/TableActions'
import { Vehicle } from '@/features/vehicles'
import { ColumnDef } from '@/types/api'

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

function formatRelatedPeople(
    people?: Array<{ id: number; name: string; mobile?: string | null } | null> | null,
    fallback?: { id: number; name: string; mobile?: string | null } | null,
): string {
    const items = (people && people.length > 0 ? people : fallback ? [fallback] : []).filter(Boolean) as Array<{ id: number; name: string; mobile?: string | null }>
    if (items.length === 0) return 'N/A'
    return items.map((person) => person.name).join(', ')
}

export function useVehicleColumns(tenantSlug: string, handleDelete: (id: number | string) => void): ColumnDef<Vehicle>[] {
    return [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        {
            header: 'Image',
            className: 'w-20',
            cell: (item) => <ListImage image={item.image} name={item.vehicle_name || item.registration_no} fallbackText="V" />,
        },
        { header: 'Registration', accessorKey: 'registration_no' },
        { header: 'Date', cell: (item) => <span>{formatDate(item.date)}</span> },
        { header: 'Vehicle Name', cell: (item) => <span>{item.vehicle_name || 'N/A'}</span> },
        { header: 'Drivers', cell: (item) => <span>{formatRelatedPeople(item.drivers, item.driver)}</span> },
        { header: 'Helpers', cell: (item) => <span>{formatRelatedPeople(item.helpers, item.helper)}</span> },
        { header: 'Supervisors', cell: (item) => <span>{formatRelatedPeople(item.supervisors)}</span> },
        { header: 'Category', cell: (item) => <span>{item.vehicle_category?.name || 'N/A'}</span> },
        { header: 'Size', cell: (item) => <span>{item.vehicle_size?.name || 'N/A'}</span> },
        { header: 'KPL', cell: (item) => <span>{item.vehicle_kpl ?? 'N/A'}</span> },
        { header: 'Brand', accessorKey: 'brand' },
        { header: 'Model', accessorKey: 'model' },
        { header: 'Year', accessorKey: 'manufacturing_year' },
        {
            header: 'Status',
            cell: (item) => (
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
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
                    itemName={item.vehicle_name || item.registration_no}
                    deleteTitle="Delete Vehicle?"
                    deleteMessage="Are you sure you want to delete this vehicle? This action cannot be undone."
                />
            ),
        },
    ]
}
