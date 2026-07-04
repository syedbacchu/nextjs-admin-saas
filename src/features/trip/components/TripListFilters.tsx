'use client'

import { TripListTempFilters } from '@/features/trip/hooks/useTripListFilters'

type Option = {
    value: string
    label: string
}

interface TripListFiltersProps {
    filters: TripListTempFilters
    customerOptions: Option[]
    vendorOptions: Option[]
    driverOptions: Option[]
    officeOptions: Option[]
    ownVehicleOptions: Option[]
    rentVehicleOptions: Option[]
    onChange: (key: keyof TripListTempFilters, value: string) => void
    onApply: () => void
    onReset: () => void
}

export default function TripListFilters({
                                            filters,
                                            customerOptions,
                                            vendorOptions,
                                            driverOptions,
                                            officeOptions,
                                            ownVehicleOptions,
                                            rentVehicleOptions,
                                            onChange,
                                            onApply,
                                            onReset,
                                        }: TripListFiltersProps) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
                <label className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Bill Status</span>
                    <select
                        value={filters.status}
                        onChange={(e) => onChange('status', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">All</option>
                        <option value="0">Pending</option>
                        <option value="1">Submitted</option>
                    </select>
                </label>
                <label className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Trip Type</span>
                    <select
                        value={filters.trip_type}
                        onChange={(e) => onChange('trip_type', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">All</option>
                        <option value="single">Single</option>
                        <option value="round">Round</option>
                    </select>
                </label>
                <label className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Transport Type</span>
                    <select
                        value={filters.transport_type}
                        onChange={(e) => onChange('transport_type', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">All</option>
                        <option value="own_transport">Own Transport</option>
                        <option value="vendor_transport">Vendor Transport</option>
                    </select>
                </label>
                <label className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Customer</span>
                    <select
                        value={filters.customer_id}
                        onChange={(e) => onChange('customer_id', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">All</option>
                        {customerOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </label>
                <label className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Vendor</span>
                    <select
                        value={filters.vendor_id}
                        onChange={(e) => onChange('vendor_id', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">All</option>
                        {vendorOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </label>
                <label className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Driver</span>
                    <select
                        value={filters.driver_id}
                        onChange={(e) => onChange('driver_id', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">All</option>
                        {driverOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </label>
                <label className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Branch</span>
                    <select
                        value={filters.office_id}
                        onChange={(e) => onChange('office_id', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">All</option>
                        {officeOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </label>
                <label className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Own Vehicle</span>
                    <select
                        value={filters.vehicle_id}
                        onChange={(e) => onChange('vehicle_id', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">All</option>
                        {ownVehicleOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </label>
                <label className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Rent Vehicle</span>
                    <select
                        value={filters.rent_vehicle_id}
                        onChange={(e) => onChange('rent_vehicle_id', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">All</option>
                        {rentVehicleOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </label>
                <label className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Period</span>
                    <select
                        value={filters.period}
                        onChange={(e) => onChange('period', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">All Time</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="custom">Date Range</option>
                    </select>
                </label>
                {(filters.period === 'daily' || filters.period === 'weekly') && (
                    <label className="space-y-1">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            {filters.period === 'daily' ? 'Date' : 'Week Base Date'}
                        </span>
                        <input
                            type="date"
                            value={filters.period_date}
                            onChange={(e) => onChange('period_date', e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </label>
                )}
                {filters.period === 'monthly' && (
                    <label className="space-y-1">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Month</span>
                        <input
                            type="month"
                            value={filters.period_month}
                            onChange={(e) => onChange('period_month', e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </label>
                )}
                {filters.period === 'yearly' && (
                    <label className="space-y-1">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Year</span>
                        <input
                            type="number"
                            min="2000"
                            max="2100"
                            value={filters.period_year}
                            onChange={(e) => onChange('period_year', e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </label>
                )}
                {filters.period === 'custom' && (
                    <>
                        <label className="space-y-1">
                            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">From Date</span>
                            <input
                                type="date"
                                value={filters.from_date}
                                onChange={(e) => onChange('from_date', e.target.value)}
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                            />
                        </label>
                        <label className="space-y-1">
                            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">To Date</span>
                            <input
                                type="date"
                                value={filters.to_date}
                                onChange={(e) => onChange('to_date', e.target.value)}
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                            />
                        </label>
                    </>
                )}
            </div>
            <div className="mt-4 flex gap-2">
                <button
                    onClick={onApply}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                    Apply Filters
                </button>
                <button
                    onClick={onReset}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    Reset
                </button>
            </div>
        </div>
    )
}