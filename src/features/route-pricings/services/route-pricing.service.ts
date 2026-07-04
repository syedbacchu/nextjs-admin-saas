import { request } from '@/lib/http/request'
import {
    RoutePricingAreaListData,
    RoutePricingAreaListResponse,
    RoutePricing,
    RoutePricingCustomerListData,
    RoutePricingCustomerListResponse,
    RoutePricingListData,
    RoutePricingListResponse,
    RoutePricingPayload,
    RoutePricingMutationResponse,
    RoutePricingSingleResponse,
    RoutePricingVehicleCategoryListData,
    RoutePricingVehicleCategoryListResponse,
} from '@/features/route-pricings/route-pricing.types'

export const RoutePricingService = {
    list(tenantSlug: string, page: number = 1, search: string = '', customerId?: string): Promise<RoutePricingListResponse> {
        return request<RoutePricingListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/route-pricings`,
            params: { page, search, ...(customerId && { customer_id: customerId }) },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<RoutePricingSingleResponse> {
        return request<RoutePricing>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/route-pricings/${id}`,
        })
    },

    create(tenantSlug: string, data: RoutePricingPayload): Promise<RoutePricingMutationResponse> {
        return request<RoutePricing>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/route-pricings`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: RoutePricingPayload): Promise<RoutePricingMutationResponse> {
        return request<RoutePricing>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/route-pricings/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<RoutePricingMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/route-pricings/${id}`,
        })
    },

    customers(tenantSlug: string, page: number = 1, search: string = ''): Promise<RoutePricingCustomerListResponse> {
        return request<RoutePricingCustomerListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/customers`,
            params: { page, search },
        })
    },

    vehicleCategories(page: number = 1, search: string = ''): Promise<RoutePricingVehicleCategoryListResponse> {
        return request<RoutePricingVehicleCategoryListData>({
            method: 'GET',
            url: '/user/vehicle-categories',
            params: { page, search },
        })
    },

    areas(page: number = 1, search: string = ''): Promise<RoutePricingAreaListResponse> {
        return request<RoutePricingAreaListData>({
            method: 'GET',
            url: '/user/areas',
            params: { page, search },
        })
    },

    getDistanceByRoute(tenantSlug: string, loadAreaId: number | string, unloadAreaId: number | string): Promise<{ success: boolean; message: string; data: { distance: number } }> {
        return request<{ distance: number }>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/route-distance`,
            params: { load_area_id: loadAreaId, unload_area_id: unloadAreaId },
        })
    },

    calculateDistanceByGoogleMaps(tenantSlug: string, loadAreaId: number | string, unloadAreaId: number | string): Promise<{
        success: boolean
        message: string
        data: {
            distance: number
            distance_text: string
            duration_text: string | null
            origin: string
            destination: string
            provider: string
            source: 'provider' | 'route_pricing'
        }
    }> {
        return request<{
            distance: number
            distance_text: string
            duration_text: string | null
            origin: string
            destination: string
            provider: string
            source: 'provider' | 'route_pricing'
        }>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/route-distance-calculate`,
            params: { load_area_id: loadAreaId, unload_area_id: unloadAreaId },
        })
    },
}
