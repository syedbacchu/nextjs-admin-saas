'use client'

import {
    addCustomerAddressAction,
    createCustomerAction,
    deleteCustomerAction,
    updateCustomerAction,
    CustomerAddressMutationResponse,
    CustomerAddressPayload,
    CustomerMutationResponse,
    CustomerPayload,
} from '@/features/customers'

export async function createCustomerClient(
    tenantSlug: string,
    payload: CustomerPayload,
): Promise<CustomerMutationResponse> {
    return createCustomerAction(tenantSlug, payload)
}

export async function updateCustomerClient(
    tenantSlug: string,
    id: number | string,
    payload: CustomerPayload,
): Promise<CustomerMutationResponse> {
    return updateCustomerAction(tenantSlug, id, payload)
}

export async function deleteCustomerClient(
    tenantSlug: string,
    id: number | string,
): Promise<CustomerMutationResponse> {
    return deleteCustomerAction(tenantSlug, id)
}

export async function addCustomerAddressClient(
    tenantSlug: string,
    customerId: number | string,
    payload: CustomerAddressPayload,
): Promise<CustomerAddressMutationResponse> {
    return addCustomerAddressAction(tenantSlug, customerId, payload)
}
