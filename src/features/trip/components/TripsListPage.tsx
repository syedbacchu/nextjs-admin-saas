'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import TableActions from '@/components/ui/TableActions'
import { FeatureGuard } from '@/features/feature-check'
import TripListFilters from '@/features/trip/components/TripListFilters'
import { useTripListFilters } from '@/features/trip/hooks/useTripListFilters'
import { useTripListLookups } from '@/features/trip/hooks/useTripListLookups'
import { deleteTripClient, getTripsAction, Trip, TripListFilters as ApiTripListFilters, TripListResponse, TripListSummary } from '@/features/trip'
import { ColumnDef } from '@/types/api'

const EMPTY_TRIP_LIST: TripListResponse = {
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
        summary: {
            total_count: 0,
            total_rent: 0,
            total_fuel_cost: 0,
            total_road_cost: 0,
            total_driver_cost: 0,
            total_vendor_cost: 0,
            total_cost: 0,
            total_profit: 0,
        },
    },
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

function formatAmount(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined' || value === '') return 'N/A'
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

function toNumber(value?: string | number | null): number {
    if (value === null || typeof value === 'undefined' || value === '') return 0
    const numericValue = typeof value === 'number' ? value : Number(value)
    return Number.isNaN(numericValue) ? 0 : numericValue
}

function getTransportTypeLabel(value?: string | null): string {
    if (value === 'own_transport') return 'Own Transport'
    if (value === 'vendor_transport') return 'Vendor Transport'
    return value || 'N/A'
}

function getVehicleName(item: Trip): string {
    return item.vehicle?.vehicle_name
        || item.rent_vehicle?.vehicle_name
        || item.vehicle_no
        || 'N/A'
}

function getRoadCost(item: Trip): number {
    const roadCosts: Array<string | number | null | undefined> = [
        item.labour_cost,
        item.toll_cost,
        item.ferry_cost,
        item.police_cost,
        item.chada_cost,
        item.parking_cost,
        item.challan_cost,
        item.food_cost,
        item.others_cost,
        item.night_guard,
        item.additional_load_cost,
    ]

    return roadCosts.reduce<number>((sum, value) => sum + toNumber(value), 0)
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex gap-2 leading-5">
            <span className="min-w-[76px] font-medium text-slate-600">{label}:</span>
            <span className="text-slate-900">{value}</span>
        </div>
    )
}

export default function TripsListPage() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const searchParams = useSearchParams()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [stats, setStats] = useState<TripListSummary | null>(null)

    const {
        refreshKey,
        tempFilters,
        initialFilters,
        handleFilterChange,
        applyFilters,
        resetFilters,
    } = useTripListFilters({
        customer_id: searchParams.get('customer_id') || '',
        vendor_id: searchParams.get('vendor_id') || '',
        driver_id: searchParams.get('driver_id') || '',
    })

    const {
        customerOptions,
        officeOptions,
        ownVehicleOptions,
        rentVehicleOptions,
        vendorOptions,
        driverOptions,
    } = useTripListLookups(tenantSlug)

    const fetchTrips = useCallback(async (page: number, search: string, filters: Record<string, string>) => {
        if (!tenantSlug) return EMPTY_TRIP_LIST
        const response = await getTripsAction(tenantSlug, page, search, undefined, filters as ApiTripListFilters)
        if (response.success && response.data?.summary) {
            setStats(response.data.summary)
        }
        return response
    }, [tenantSlug])

    const handleDelete = useCallback(async (id: number | string) => {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteTripClient(tenantSlug, id)

        if (res.success) {
            toast.success(res.message || 'Trip deleted successfully')
            applyFilters()
        } else {
            toast.error(res.message || 'Failed to delete trip')
        }
    }, [applyFilters, tenantSlug])

    const columns: ColumnDef<Trip>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        {
            header: 'Customer',
            cell: (item) => (
                <div className="space-y-1 text-sm">
                    <InfoRow label="Name" value={item.customer?.name || (item.customer_id ? `#${item.customer_id}` : 'N/A')} />
                    <InfoRow label="Type" value={getTransportTypeLabel(item.transport_type)} />
                    <InfoRow label="Date" value={formatDate(item.date)} />
                </div>
            ),
        },
        {
            header: 'Vehicle',
            cell: (item) => (
                <div className="space-y-1 text-sm">
                    <InfoRow label="Vehicle" value={getVehicleName(item)} />
                    <InfoRow label="Driver" value={item.driver_name || item.driver?.name || (item.driver_id ? `#${item.driver_id}` : 'N/A')} />
                    {item.helper?.name ? <InfoRow label="Helper" value={item.helper.name} /> : null}
                    {item.supervisor?.name ? <InfoRow label="Supervisor" value={item.supervisor.name} /> : null}
                </div>
            ),
        },
        {
            header: 'Trip Info',
            cell: (item) => (
                <div className="space-y-1 text-sm">
                    <InfoRow label="Load" value={item.load_area?.name || (item.load_area_id ? `#${item.load_area_id}` : 'N/A')} />
                    <InfoRow label="Unload" value={item.unload_area?.name || (item.unload_area_id ? `#${item.unload_area_id}` : 'N/A')} />
                    <InfoRow label="Run KM" value={formatAmount(item.running_km)} />
                    <InfoRow label="Fuel Qty" value={formatAmount(item.fuel_quantity_liter)} />
                    <InfoRow label="Fuel Rate" value={formatAmount(item.fuel_cost_per_liter)} />
                </div>
            ),
        },
        {
            header: 'Rent',
            cell: (item) => (
                <div className="space-y-1 text-sm">
                    <InfoRow label="Rent" value={formatAmount(item.total_rent_bill_amount)} />
                    <InfoRow label="Demurrage" value={formatAmount(item.total_demurrage)} />
                </div>
            ),
        },
        {
            header: 'Cost',
            cell: (item) => (
                <div className="space-y-1 text-sm">
                    <InfoRow label="Vendor Dem." value={formatAmount(item.vendor_total_demurrage)} />
                    <InfoRow label="Fuel Cost" value={`${formatAmount(item.fuel_cost)}${item.driver_commission_amount ? `, Driver: ${formatAmount(item.driver_commission_amount)}` : ''}`} />
                    <InfoRow label="Road Cost" value={formatAmount(getRoadCost(item))} />
                    <InfoRow label="Total Cost" value={formatAmount(item.total_expense)} />
                </div>
            ),
        },
        { header: 'Profit', cell: (item) => <span className="font-semibold text-emerald-700">{formatAmount(item.profit)}</span> },
        {
            header: 'Bill Status',
            cell: (item) => (
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {item.status === 1 ? 'Submitted' : 'Pending'}
                </span>
            ),
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                item.status === 1 ? (
                    <TableActions
                        id={item.id}
                        hasView
                        hasPrint
                        viewLink={`/${tenantSlug}/trips/${item.id}`}
                        printLink={`/${tenantSlug}/trips/${item.id}?print=1`}
                    />
                ) : (
                    <TableActions
                        id={item.id}
                        hasView
                        hasPrint
                        hasEdit
                        hasDelete
                        viewLink={`/${tenantSlug}/trips/${item.id}`}
                        printLink={`/${tenantSlug}/trips/${item.id}?print=1`}
                        editLink={`/${tenantSlug}/trips/${item.id}/edit`}
                        onDelete={handleDelete}
                        deleteTitle="Delete Trip?"
                        deleteMessage="Are you sure you want to delete this trip? This action cannot be undone."
                    />
                )
            ),
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Trip Management</h1>
                <FeatureGuard featureKey="trip.monitoring">
                    <button
                        onClick={() => router.push(`/${tenantSlug}/trips/create`)}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        + Add Trip
                    </button>
                </FeatureGuard>
            </div>

            {stats && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div className="mb-2 text-sm font-medium text-blue-700">Total Trips</div>
                        <div className="text-2xl font-bold text-blue-900">{stats.total_count || 0}</div>
                    </div>
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                        <div className="mb-2 text-sm font-medium text-orange-700">Total Rent</div>
                        <div className="text-2xl font-bold text-orange-900">{formatAmount(stats.total_rent)}</div>
                    </div>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div className="mb-2 text-sm font-medium text-blue-700">Total Fuel Cost</div>
                        <div className="text-2xl font-bold text-blue-900">{formatAmount(stats.total_fuel_cost)}</div>
                    </div>
                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                        <div className="mb-2 text-sm font-medium text-purple-700">Total Road Cost</div>
                        <div className="text-2xl font-bold text-purple-900">{formatAmount(stats.total_road_cost)}</div>
                    </div>
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                        <div className="mb-2 text-sm font-medium text-orange-700">Total Driver Cost</div>
                        <div className="text-2xl font-bold text-orange-900">{formatAmount(stats.total_driver_cost)}</div>
                    </div>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="mb-2 text-sm font-medium text-red-700">Total Vendor Cost</div>
                        <div className="text-2xl font-bold text-red-900">{formatAmount(stats.total_vendor_cost)}</div>
                    </div>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="mb-2 text-sm font-medium text-red-700">Total Cost</div>
                        <div className="text-2xl font-bold text-red-900">{formatAmount(stats.total_cost)}</div>
                    </div>
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                        <div className="mb-2 text-sm font-medium text-green-700">Total Profit</div>
                        <div className="text-2xl font-bold text-green-900">{formatAmount(stats.total_profit)}</div>
                    </div>
                </div>
            )}

            <TripListFilters
                filters={tempFilters}
                customerOptions={customerOptions}
                vendorOptions={vendorOptions}
                driverOptions={driverOptions}
                officeOptions={officeOptions}
                ownVehicleOptions={ownVehicleOptions}
                rentVehicleOptions={rentVehicleOptions}
                onChange={handleFilterChange}
                onApply={applyFilters}
                onReset={resetFilters}
            />

            <DynamicTable
                key={refreshKey}
                title="Trips"
                fetchData={fetchTrips}
                columns={columns}
                initialFilters={initialFilters}
            />
        </div>
    )
}
