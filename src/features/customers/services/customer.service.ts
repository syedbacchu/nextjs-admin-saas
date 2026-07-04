import { request } from '@/lib/http/request'
import {
    Customer,
    CustomerAddressItem,
    CustomerAddressPayload,
    CustomerListData,
    CustomerListResponse,
    CustomerAddressMutationResponse,
    CustomerMutationResponse,
    CustomerPayload,
    CustomerSingleResponse,
} from '@/features/customers'

export const CustomerService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<CustomerListResponse> {
        return request<CustomerListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/customers`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<CustomerSingleResponse> {
        return request<Customer>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/customers/${id}`,
        })
    },

    create(tenantSlug: string, data: CustomerPayload): Promise<CustomerMutationResponse> {
        return request<Customer>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/customers`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: CustomerPayload): Promise<CustomerMutationResponse> {
        return request<Customer>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/customers/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<CustomerMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/customers/${id}`,
        })
    },

    addAddress(tenantSlug: string, customerId: number | string, data: CustomerAddressPayload): Promise<CustomerAddressMutationResponse> {
        return request<CustomerAddressItem>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/customers/${customerId}/addresses`,
            data,
        })
    },
}
