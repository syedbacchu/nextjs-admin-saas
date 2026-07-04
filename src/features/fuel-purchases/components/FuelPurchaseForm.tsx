'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DateInput } from '@/components/form/DateInput'
import SelectInput from '@/components/form/SelectInput'
import TextInput from '@/components/form/TextInput'
import {
    createFuelPurchaseClient,
    updateFuelPurchaseClient,
    type FuelPurchase,
} from '..'
import type { Office } from '@/features/offices'
import type { Supplier } from '@/features/suppliers'
import type { Vehicle } from '@/features/vehicles'

interface FuelPurchaseFormProps {
    tenantSlug: string
    offices: Office[]
    suppliers: Supplier[]
    vehicles: Vehicle[]
    initialData?: Partial<FuelPurchase>
    fuelPurchaseId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

const FUEL_TYPE_OPTIONS = [
    { label: 'Diesel', value: 'diesel' },
    { label: 'Petrol', value: 'petrol' },
    { label: 'Octane', value: 'octane' },
    { label: 'Gas', value: 'gas' },
    { label: 'LPG', value: 'lpg' },
]

function toDateInputValue(value?: string | null): string {
    if (!value) return new Date().toISOString().slice(0, 10)
    const trimmed = value.trim()
    if (!trimmed) return new Date().toISOString().slice(0, 10)

    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        return trimmed.slice(0, 10)
    }

    const parsed = new Date(trimmed)
    if (Number.isNaN(parsed.getTime())) return new Date().toISOString().slice(0, 10)
    return parsed.toISOString().slice(0, 10)
}

export default function FuelPurchaseForm({
    tenantSlug,
    offices,
    suppliers,
    vehicles,
    initialData,
    fuelPurchaseId,
    submitLabel = 'Save Fuel Purchase',
}: FuelPurchaseFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const officeOptions = offices.map((office) => ({
        label: office.branch_name,
        value: String(office.id),
    }))
    const supplierOptions = suppliers.map((supplier) => ({
        label: supplier.name,
        value: String(supplier.id),
    }))
    const vehicleOptions = vehicles.map((vehicle) => ({
        label: `${vehicle.vehicle_name || 'Vehicle'} (${vehicle.registration_no || 'N/A'})`,
        value: String(vehicle.id),
    }))

    const [purchaseDate, setPurchaseDate] = useState(toDateInputValue(initialData?.purchase_date))
    const [officeId, setOfficeId] = useState(
        typeof initialData?.office_id === 'number' || typeof initialData?.office_id === 'string'
            ? String(initialData.office_id)
            : typeof initialData?.office?.id === 'number'
                ? String(initialData.office.id)
                : '',
    )
    const [supplierId, setSupplierId] = useState(
        typeof initialData?.supplier_id === 'number' || typeof initialData?.supplier_id === 'string'
            ? String(initialData.supplier_id)
            : typeof initialData?.supplier?.id === 'number'
                ? String(initialData.supplier.id)
                : '',
    )
    const [fuelType, setFuelType] = useState(initialData?.fuel_type || 'diesel')
    const [vehicleId, setVehicleId] = useState(
        typeof initialData?.vehicle_id === 'number' || typeof initialData?.vehicle_id === 'string'
            ? String(initialData.vehicle_id)
            : typeof initialData?.vehicle?.id === 'number'
                ? String(initialData.vehicle.id)
                : '',
    )
    const [quantity, setQuantity] = useState(
        initialData?.quantity === null || typeof initialData?.quantity === 'undefined'
            ? ''
            : String(initialData.quantity),
    )
    const [unitPrice, setUnitPrice] = useState(
        initialData?.unit_price === null || typeof initialData?.unit_price === 'undefined'
            ? ''
            : String(initialData.unit_price),
    )
    const [total, setTotal] = useState(
        initialData?.total === null || typeof initialData?.total === 'undefined'
            ? ''
            : String(initialData.total),
    )
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')

    // Auto-calculate total when quantity or unit price changes
    useEffect(() => {
        if (quantity && unitPrice) {
            const qty = parseFloat(quantity)
            const price = parseFloat(unitPrice)
            if (!Number.isNaN(qty) && !Number.isNaN(price)) {
                setTotal(String(qty * price))
            }
        }
    }, [quantity, unitPrice])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!purchaseDate.trim()) {
            toast.error('Purchase date is required')
            return
        }

        if (!officeId.trim()) {
            toast.error('Office is required')
            return
        }

        if (!supplierId.trim()) {
            toast.error('Supplier is required')
            return
        }

        if (!vehicleId.trim()) {
            toast.error('Vehicle is required')
            return
        }

        if (!quantity.trim()) {
            toast.error('Quantity is required')
            return
        }

        if (!unitPrice.trim()) {
            toast.error('Unit price is required')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('purchase_date', purchaseDate.trim())
            formData.append('office_id', officeId)
            formData.append('supplier_id', supplierId)
            formData.append('fuel_type', fuelType.trim())
            formData.append('vehicle_id', vehicleId)
            formData.append('quantity', quantity.trim())
            formData.append('unit_price', unitPrice.trim())
            formData.append('total', total.trim() || '0')
            formData.append('status', status)

            const res = fuelPurchaseId
                ? await updateFuelPurchaseClient(tenantSlug, fuelPurchaseId, formData)
                : await createFuelPurchaseClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Fuel purchase saved successfully')
                router.push(`/${tenantSlug}/fuel-purchases`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save fuel purchase')
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
                <p className="mt-1 text-sm text-slate-600">Fill in fuel purchase details and save.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <DateInput
                    label="Purchase Date"
                    name="purchase_date"
                    value={purchaseDate}
                    onChange={setPurchaseDate}
                    required
                />
                <SelectInput
                    label="Office"
                    name="office_id"
                    value={officeId}
                    options={officeOptions}
                    onChange={setOfficeId}
                    emptyOptionLabel="Select Office"
                    required
                />
                <SelectInput
                    label="Supplier"
                    name="supplier_id"
                    value={supplierId}
                    options={supplierOptions}
                    onChange={setSupplierId}
                    emptyOptionLabel="Select Supplier"
                    required
                />
                <SelectInput
                    label="Vehicle"
                    name="vehicle_id"
                    value={vehicleId}
                    options={vehicleOptions}
                    onChange={setVehicleId}
                    emptyOptionLabel="Select Vehicle"
                    required
                />
                <SelectInput
                    label="Fuel Type"
                    name="fuel_type"
                    value={fuelType}
                    options={FUEL_TYPE_OPTIONS}
                    onChange={setFuelType}
                    required
                />
                <TextInput
                    label="Quantity"
                    name="quantity"
                    value={quantity}
                    onChange={setQuantity}
                    placeholder="Quantity"
                    type="number"
                    required
                />
                <TextInput
                    label="Unit Price"
                    name="unit_price"
                    value={unitPrice}
                    onChange={setUnitPrice}
                    placeholder="Unit Price"
                    type="number"
                    required
                />
                <TextInput
                    label="Total"
                    name="total"
                    value={total}
                    onChange={setTotal}
                    placeholder="Total"
                    type="number"
                    required
                    readOnly
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
                    onClick={() => router.push(`/${tenantSlug}/fuel-purchases`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
