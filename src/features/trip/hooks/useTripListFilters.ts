'use client'

import { useState } from 'react'

export type TripListTempFilters = {
    status: string
    trip_type: string
    transport_type: string
    office_id: string
    vehicle_id: string
    rent_vehicle_id: string
    vendor_id: string
    customer_id: string
    driver_id: string
    period: string
    period_date: string
    period_month: string
    period_year: string
    from_date: string
    to_date: string
}

function getTodayDateInputValue(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function getCurrentMonthInputValue(): string {
    return getTodayDateInputValue().slice(0, 7)
}

function getCurrentYearValue(): string {
    return String(new Date().getFullYear())
}

function toDateInputValue(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function getWeekRange(baseDate: string): { from: string; to: string } | null {
    if (!baseDate.trim()) return null
    const parsed = new Date(baseDate)
    if (Number.isNaN(parsed.getTime())) return null

    const dayOfWeek = parsed.getDay()
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const start = new Date(parsed)
    start.setDate(parsed.getDate() + diffToMonday)

    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    return {
        from: toDateInputValue(start),
        to: toDateInputValue(end),
    }
}

function getMonthRange(monthValue: string): { from: string; to: string } | null {
    if (!/^\d{4}-\d{2}$/.test(monthValue.trim())) return null
    const [yearText, monthText] = monthValue.split('-')
    const year = Number(yearText)
    const monthIndex = Number(monthText) - 1
    if (Number.isNaN(year) || Number.isNaN(monthIndex)) return null

    const start = new Date(year, monthIndex, 1)
    const end = new Date(year, monthIndex + 1, 0)

    return {
        from: toDateInputValue(start),
        to: toDateInputValue(end),
    }
}

function getYearRange(yearValue: string): { from: string; to: string } | null {
    const year = Number(yearValue.trim())
    if (!Number.isInteger(year) || year < 1000) return null

    return {
        from: `${year}-01-01`,
        to: `${year}-12-31`,
    }
}

function createDefaultFilters(initial?: Partial<Pick<TripListTempFilters, 'customer_id' | 'vendor_id' | 'driver_id'>>): TripListTempFilters {
    return {
        status: '',
        trip_type: '',
        transport_type: '',
        office_id: '',
        vehicle_id: '',
        rent_vehicle_id: '',
        vendor_id: initial?.vendor_id || '',
        customer_id: initial?.customer_id || '',
        driver_id: initial?.driver_id || '',
        period: '',
        period_date: getTodayDateInputValue(),
        period_month: getCurrentMonthInputValue(),
        period_year: getCurrentYearValue(),
        from_date: '',
        to_date: '',
    }
}

export function buildTripApiFilters(filters: TripListTempFilters): Record<string, string> {
    const nextFilters: Record<string, string> = {
        status: filters.status || '',
        trip_type: filters.trip_type || '',
        transport_type: filters.transport_type || '',
        office_id: filters.office_id || '',
        vehicle_id: filters.vehicle_id || '',
        rent_vehicle_id: filters.rent_vehicle_id || '',
        vendor_id: filters.vendor_id || '',
        customer_id: filters.customer_id || '',
        driver_id: filters.driver_id || '',
        from_date: '',
        to_date: '',
    }

    if (filters.period === 'custom') {
        nextFilters.from_date = filters.from_date || ''
        nextFilters.to_date = filters.to_date || ''
        return nextFilters
    }

    if (filters.period === 'daily' && filters.period_date) {
        nextFilters.from_date = filters.period_date
        nextFilters.to_date = filters.period_date
        return nextFilters
    }

    if (filters.period === 'weekly') {
        const range = getWeekRange(filters.period_date || '')
        if (range) {
            nextFilters.from_date = range.from
            nextFilters.to_date = range.to
        }
        return nextFilters
    }

    if (filters.period === 'monthly') {
        const range = getMonthRange(filters.period_month || '')
        if (range) {
            nextFilters.from_date = range.from
            nextFilters.to_date = range.to
        }
        return nextFilters
    }

    if (filters.period === 'yearly') {
        const range = getYearRange(filters.period_year || '')
        if (range) {
            nextFilters.from_date = range.from
            nextFilters.to_date = range.to
        }
    }

    return nextFilters
}

export function useTripListFilters(initial?: Partial<Pick<TripListTempFilters, 'customer_id' | 'vendor_id' | 'driver_id'>>) {
    const [refreshKey, setRefreshKey] = useState(0)
    const [tempFilters, setTempFilters] = useState<TripListTempFilters>(createDefaultFilters(initial))

    function handleFilterChange(key: keyof TripListTempFilters, value: string) {
        setTempFilters((prev) => ({ ...prev, [key]: value }))
    }

    function applyFilters() {
        setRefreshKey((prev) => prev + 1)
    }

    function resetFilters() {
        setTempFilters(createDefaultFilters())
        setRefreshKey((prev) => prev + 1)
    }

    return {
        refreshKey,
        tempFilters,
        initialFilters: buildTripApiFilters(tempFilters),
        handleFilterChange,
        applyFilters,
        resetFilters,
    }
}
