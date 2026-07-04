'use server'

import { revalidatePath } from 'next/cache'
import { CustomerService } from '@/features/customers/services/customer.service'
import {
    CustomerAddressMutationResponse,
    CustomerAddressPayload,
    CustomerListResponse,
    CustomerMutationResponse,
    CustomerPayload,
    CustomerSingleResponse,
} from '@/features/customers'

function revalidateCustomerPaths(tenantSlug: string) {
    revalidatePath(`/${tenantSlug}/customers`)
}

export async function getCustomersAction(
    tenantSlug: string,
    page: number,
    search: string,
): Promise<CustomerListResponse> {
    return CustomerService.list(tenantSlug, page, search)
}

export async function getCustomerAction(
    tenantSlug: string,
    id: number | string,
): Promise<CustomerSingleResponse> {
    return CustomerService.show(tenantSlug, id)
}

export async function createCustomerAction(
    tenantSlug: string,
    payload: CustomerPayload,
): Promise<CustomerMutationResponse> {
    const res = await CustomerService.create(tenantSlug, payload)
    if (res.success) {
        revalidateCustomerPaths(tenantSlug)
    }
    return res
}

export async function updateCustomerAction(
    tenantSlug: string,
    id: number | string,
    payload: CustomerPayload,
): Promise<CustomerMutationResponse> {
    const res = await CustomerService.update(tenantSlug, id, payload)
    if (res.success) {
        revalidateCustomerPaths(tenantSlug)
        revalidatePath(`/${tenantSlug}/customers/${id}`)
    }
    return res
}

export async function deleteCustomerAction(
    tenantSlug: string,
    id: number | string,
): Promise<CustomerMutationResponse> {
    const res = await CustomerService.delete(tenantSlug, id)
    if (res.success) {
        revalidateCustomerPaths(tenantSlug)
    }
    return res
}

export async function addCustomerAddressAction(
    tenantSlug: string,
    customerId: number | string,
    payload: CustomerAddressPayload,
): Promise<CustomerAddressMutationResponse> {
    return CustomerService.addAddress(tenantSlug, customerId, payload)
}
