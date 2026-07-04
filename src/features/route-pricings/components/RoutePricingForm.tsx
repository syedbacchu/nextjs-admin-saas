'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { CustomerAddressItem } from '@/features/customers/types'
import AreaSearchSelect from '@/components/form/AreaSearchSelect'
import TextInput from '@/components/form/TextInput'
import SearchableSelect from '@/components/form/SearchableSelect'
import SelectInput from '@/components/form/SelectInput'
import {
    createRoutePricingClient,
    RoutePricing,
    RoutePricingArea,
    RoutePricingCustomer, RoutePricingPayload,
    RoutePricingVehicleCategory, updateRoutePricingClient
} from "@/features/route-pricings";
import {addCustomerAddressAction, getCustomerAction} from "@/features/customers";
import {createAreaClient} from "@/features/area";

interface RoutePricingFormProps {
    tenantSlug: string
    customers: RoutePricingCustomer[]
    vehicleCategories: RoutePricingVehicleCategory[]
    areas: RoutePricingArea[]
    initialData?: Partial<RoutePricing>
    routePricingId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

function normalizeValue(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined') return ''
    return String(value)
}

function getCustomerAddresses(customer?: RoutePricingCustomer | null): CustomerAddressItem[] {
    if (!customer || !Array.isArray(customer.address)) return []
    return customer.address.filter((item): item is CustomerAddressItem => Boolean(item && typeof item === 'object' && 'id' in item))
}

function buildAddressOptions(
    addresses: CustomerAddressItem[],
    fallback?: { id?: number | string | null; name?: string | null; address?: string | null } | null,
) {
    const options = addresses
        .filter((item) => item.id !== null && typeof item.id !== 'undefined')
        .map((item) => ({
            label: `${item.name}${item.address ? ` - ${item.address}` : ''}`,
            value: String(item.id),
        }))

    if (fallback?.id !== null && typeof fallback?.id !== 'undefined') {
        const fallbackValue = String(fallback.id)
        if (!options.some((option) => option.value === fallbackValue)) {
            options.unshift({
                label: `${fallback.name || fallbackValue}${fallback.address ? ` - ${fallback.address}` : ''}`,
                value: fallbackValue,
            })
        }
    }

    return options
}

export default function RoutePricingForm({
    tenantSlug,
    customers,
    vehicleCategories,
    areas,
    initialData,
    routePricingId,
    submitLabel = 'Save Route Pricing',
}: RoutePricingFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [availableAreas, setAvailableAreas] = useState<RoutePricingArea[]>(areas)
    const [selectedCustomer, setSelectedCustomer] = useState<RoutePricingCustomer | null>(
        (() => {
            const initialCustomerId = normalizeValue(initialData?.customer_id)
            return customers.find((item) => String(item.id) === initialCustomerId) || initialData?.customer || null
        })(),
    )
    const [customerId, setCustomerId] = useState(normalizeValue(initialData?.customer_id))
    const [vehicleCategoryId, setVehicleCategoryId] = useState(
        normalizeValue(initialData?.vehicle_category_id),
    )
    const [loadAreaId, setLoadAreaId] = useState(normalizeValue(initialData?.load_area_id))
    const [unloadAreaId, setUnloadAreaId] = useState(normalizeValue(initialData?.unload_area_id))
    const [vehicleSizeId, setVehicleSizeId] = useState(normalizeValue(initialData?.vehicle_size_id))
    const [rate, setRate] = useState(
        initialData?.rate === null || typeof initialData?.rate === 'undefined'
            ? ''
            : String(initialData.rate),
    )
    const [distance, setDistance] = useState(
        initialData?.distance === null || typeof initialData?.distance === 'undefined'
            ? ''
            : String(initialData.distance),
    )
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')

    const customerOptions = customers.map((customer) => ({
        label: `${customer.name}${customer.creation_type === 2 ? ' (Walk In Customer)' : customer.mobile ? ` (${customer.mobile})` : ''}`,
        value: String(customer.id),
    }))

    const vehicleCategoryOptions = vehicleCategories.map((category) => ({
        label: category.name,
        value: String(category.id),
    }))
    const unloadAreaOptions = availableAreas.map((area) => ({
        label: area.name,
        value: String(area.id),
    }))
    const initialVehicleCategoryId =
        typeof initialData?.vehicle_category_id === 'number' || typeof initialData?.vehicle_category_id === 'string'
            ? String(initialData.vehicle_category_id)
            : ''

    const selectedCategory = vehicleCategories.find((item) => String(item.id) === vehicleCategoryId)
    const customerLoadAreaOptions = buildAddressOptions(
        getCustomerAddresses(selectedCustomer),
        initialData?.load_area,
    )
    const dynamicVehicleSizeOptions = (selectedCategory?.sizes || []).map((size) => ({
        label: size.name,
        value: String(size.id),
    }))
    const fallbackVehicleSizeOptions =
        vehicleCategoryId === initialVehicleCategoryId &&
        (typeof initialData?.vehicle_size_id === 'number' || typeof initialData?.vehicle_size_id === 'string')
            ? [{
                label: initialData?.vehicle_size?.name || String(initialData.vehicle_size_id),
                value: String(initialData.vehicle_size_id),
            }]
            : []
    const vehicleSizeOptions = dynamicVehicleSizeOptions.length > 0 ? dynamicVehicleSizeOptions : fallbackVehicleSizeOptions
    const hasSelectedLoadArea = customerLoadAreaOptions.some((option) => option.value === loadAreaId)
    const mergedLoadAreaOptions = !loadAreaId || hasSelectedLoadArea
        ? customerLoadAreaOptions
        : [{
            label: initialData?.load_area?.name || loadAreaId,
            value: loadAreaId,
        }, ...customerLoadAreaOptions]
    const hasSelectedUnloadArea = unloadAreaOptions.some((option) => option.value === unloadAreaId)
    const mergedUnloadAreaOptions = !unloadAreaId || hasSelectedUnloadArea
        ? unloadAreaOptions
        : [{
            label: initialData?.unload_area?.name || unloadAreaId,
            value: unloadAreaId,
        }, ...unloadAreaOptions]

    function handleVehicleCategoryChange(nextCategoryId: string) {
        setVehicleCategoryId(nextCategoryId)

        const nextCategory = vehicleCategories.find((item) => String(item.id) === nextCategoryId)
        const hasSelectedSize = (nextCategory?.sizes || []).some((size) => String(size.id) === vehicleSizeId)
        if (!hasSelectedSize) setVehicleSizeId('')
    }

    function handleCustomerChange(nextCustomerId: string) {
        setCustomerId(nextCustomerId)
        setLoadAreaId('')
        const matchedCustomer = customers.find((item) => String(item.id) === nextCustomerId) || null
        if (getCustomerAddresses(matchedCustomer).length > 0) {
            setSelectedCustomer(matchedCustomer)
            return
        }

        setSelectedCustomer(matchedCustomer)
        void (async () => {
            try {
                const res = await getCustomerAction(tenantSlug, nextCustomerId)
                if (res.success && res.data) {
                    setSelectedCustomer(res.data)
                }
            } catch {
                // Keep the form usable even if the customer detail lookup fails.
            }
        })()
    }

    async function handleCreateLoadArea(areaName: string): Promise<boolean> {
        const trimmedName = areaName.trim()
        if (!trimmedName || !customerId) {
            toast.error('Please select a customer first')
            return false
        }

        try {
            const res = await addCustomerAddressAction(tenantSlug, customerId, {
                name: trimmedName,
                address: trimmedName,
            })

            if (!res.success || !res.data) {
                toast.error(res.message || 'Failed to create customer address')
                return false
            }

            const createdAddress = res.data
            if (!createdAddress || typeof createdAddress !== 'object' || !('id' in createdAddress)) {
                toast.error(res.message || 'Failed to create customer address')
                return false
            }

            const createdId = String(createdAddress.id)
            const createdLabel = createdAddress.name || trimmedName

            // Update selected customer with new address
            setSelectedCustomer((prev) => {
                if (!prev) return prev
                const currentAddresses = Array.isArray(prev.address) ? prev.address : []
                const validAddresses = currentAddresses.filter((item): item is CustomerAddressItem => Boolean(item && typeof item === 'object' && 'id' in item))
                return {
                    ...prev,
                    address: [...validAddresses, createdAddress],
                }
            })

            setLoadAreaId(createdId)
            toast.success(res.message || 'Customer address created successfully')
            return true
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
            return false
        }
    }

    async function handleCreateUnloadArea(areaName: string): Promise<boolean> {
        const trimmedName = areaName.trim()
        if (!trimmedName) return false

        try {
            const res = await createAreaClient(tenantSlug, { name: trimmedName })
            if (!res.success || !res.data) {
                toast.error(res.message || 'Failed to create area')
                return false
            }

            const createdArea = Array.isArray(res.data) ? res.data[0] : res.data
            if (!createdArea || typeof createdArea !== 'object' || !('id' in createdArea)) {
                toast.error(res.message || 'Failed to create area')
                return false
            }

            const createdId = String((createdArea as { id: number | string }).id)
            const createdLabel = String((createdArea as { name?: string }).name || trimmedName)

            setAvailableAreas((prev) => (
                prev.some((item) => String(item.id) === createdId)
                    ? prev
                    : [...prev, { id: Number(createdId), name: createdLabel }]
            ))
            setUnloadAreaId(createdId)
            toast.success(res.message || 'Area created successfully')
            return true
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
            return false
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!customerId.trim()) {
            toast.error('Customer is required')
            return
        }

        if (!vehicleCategoryId.trim()) {
            toast.error('Vehicle category is required')
            return
        }

        if (!loadAreaId.trim()) {
            toast.error('Load area is required')
            return
        }

        if (!unloadAreaId.trim()) {
            toast.error('Unload area is required')
            return
        }

        if (!vehicleSizeId.trim()) {
            toast.error('Vehicle size is required')
            return
        }

        if (!rate.trim()) {
            toast.error('Rate is required')
            return
        }

        setLoading(true)
        try {
            const payload: RoutePricingPayload = {
                customer_id: customerId,
                vehicle_category_id: vehicleCategoryId,
                load_area_id: loadAreaId,
                unload_area_id: unloadAreaId,
                vehicle_size_id: vehicleSizeId,
                rate: rate.trim(),
                distance: distance.trim() || undefined,
                status,
            }

            const res = routePricingId
                ? await updateRoutePricingClient(tenantSlug, routePricingId, payload)
                : await createRoutePricingClient(tenantSlug, payload)

            if (res.success) {
                toast.success(res.message || 'Route pricing saved successfully')
                router.push(`/${tenantSlug}/route-pricings`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save route pricing')
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-xl font-bold text-slate-900">{submitLabel}</h2>
                <p className="mt-1 text-sm text-slate-600">Fill in route pricing details and save.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <SearchableSelect
                    label="Customer"
                    name="customer_id"
                    value={customerId}
                    options={customerOptions}
                    onChange={(value) => handleCustomerChange(String(value))}
                    placeholder="Select Customer"
                    required
                />
                <SelectInput
                    label="Vehicle Category"
                    name="vehicle_category_id"
                    value={vehicleCategoryId}
                    options={vehicleCategoryOptions}
                    onChange={handleVehicleCategoryChange}
                    emptyOptionLabel="Select Vehicle Category"
                    required
                />
                <AreaSearchSelect
                    label="Load Area"
                    name="load_area_id"
                    value={loadAreaId}
                    onChange={(value) => setLoadAreaId(String(value))}
                    options={mergedLoadAreaOptions}
                    placeholder={customerId ? 'Select Load Area' : 'Select customer first'}
                    emptyStateText="No load area found"
                    onCreateArea={handleCreateLoadArea}
                    createEmptyLabel="Create Area"
                    required
                />
                <AreaSearchSelect
                    label="Unload Area"
                    name="unload_area_id"
                    value={unloadAreaId}
                    onChange={(value) => setUnloadAreaId(String(value))}
                    options={mergedUnloadAreaOptions}
                    placeholder="Select Unload Area"
                    emptyStateText="No unload area found"
                    onCreateArea={handleCreateUnloadArea}
                    createEmptyLabel="Create Area"
                    required
                />
                <SelectInput
                    label="Vehicle Size"
                    name="vehicle_size_id"
                    value={vehicleSizeId}
                    options={vehicleSizeOptions}
                    onChange={setVehicleSizeId}
                    emptyOptionLabel="Select Vehicle Size"
                    required
                />
                <TextInput
                    label="Rate"
                    name="rate"
                    value={rate}
                    onChange={setRate}
                    placeholder="Rate"
                    type="number"
                    required
                />
                <TextInput
                    label="Distance (KM)"
                    name="distance"
                    value={distance}
                    onChange={setDistance}
                    placeholder="Distance in kilometers"
                    type="number"
                    helpText="Optional: Enter route distance for automatic fuel calculation in trips"
                />
                <SelectInput
                    label="Status"
                    name="status"
                    value={status}
                    options={STATUS_OPTIONS}
                    onChange={setStatus}
                    includeEmptyOption={false}
                    required
                />
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                >
                    {loading ? 'Saving...' : submitLabel}
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${tenantSlug}/route-pricings`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
