import { request } from '@/lib/http/request'
import {
    Trip,
    TripListData,
    TripListFilters,
    TripListResponse,
    TripMutationResponse,
    TripSingleResponse,
} from '@/features/trip'

export const TripService = {
    list(
        tenantSlug: string,
        page: number = 1,
        search: string = '',
        status?: number,
        filters?: TripListFilters,
    ): Promise<TripListResponse> {
        const params: Record<string, string | number> = { page, search }
        if (typeof status !== 'undefined') {
            params.status = status
        }
        if (filters?.status !== '') {
            if (typeof filters?.status !== 'undefined') {
                params.status = filters.status
            }
        }
        if (filters?.trip_type) {
            params.trip_type = filters.trip_type
        }
        if (filters?.transport_type) {
            params.transport_type = filters.transport_type
        }
        if (filters?.office_id) {
            params.office_id = filters.office_id
        }
        if (filters?.vehicle_id) {
            params.vehicle_id = filters.vehicle_id
        }
        if (filters?.rent_vehicle_id) {
            params.rent_vehicle_id = filters.rent_vehicle_id
        }
        if (filters?.vendor_id) {
            params.vendor_id = filters.vendor_id
        }
        if (filters?.customer_id) {
            params.customer_id = filters.customer_id
        }
        if (filters?.driver_id) {
            params.driver_id = filters.driver_id
        }
        if (filters?.from_date) {
            params.from_date = filters.from_date
        }
        if (filters?.to_date) {
            params.to_date = filters.to_date
        }

        return request<TripListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/trips`,
            params,
        })
    },

    billSubmit(tenantSlug: string, tripIds: Array<number | string>): Promise<TripMutationResponse> {
        return request<unknown[]>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/trips/bill-submit`,
            data: { trip_ids: tripIds },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<TripSingleResponse> {
        return request<Trip>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/trips/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<TripMutationResponse> {
        return request<Trip>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/trips`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<TripMutationResponse> {
        return request<Trip>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/trips/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<TripMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/trips/${id}`,
        })
    },

    getNextChallanNo(tenantSlug: string, date?: string): Promise<{ success: boolean; message: string; data: { challan_no: string } }> {
        return request<{ challan_no: string }>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/next-challan-no`,
            params: date ? { date } : {},
        })
    },

    getLastOdometerReading(
        tenantSlug: string,
        vehicleId: number | string,
    ): Promise<{
        success: boolean
        message: string
        data: {
            has_last_reading: boolean
            odometer_start_km: number | null
            last_trip: {
                id: number
                date: string
                challan_no: string
                odometer_start_km: number
                odometer_end_km: number
                running_km: number
            } | null
        }
    }> {
        return request<{
            has_last_reading: boolean
            odometer_start_km: number | null
            last_trip: {
                id: number
                date: string
                challan_no: string
                odometer_start_km: number
                odometer_end_km: number
                running_km: number
            } | null
        }>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/last-odometer-reading`,
            params: { vehicle_id: vehicleId },
        })
    },
}
