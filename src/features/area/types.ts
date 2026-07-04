import { ApiResponse } from '@/types/api'
import type { RoutePricingArea, RoutePricingAreaListData } from '@/features/route-pricings'

export type Area = RoutePricingArea

export interface AreaPayload {
    name: string
}

export type AreaMutationResponse = ApiResponse<Area | unknown[]>
export type AreaListResponse = ApiResponse<RoutePricingAreaListData>
