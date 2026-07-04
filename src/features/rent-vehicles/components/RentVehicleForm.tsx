'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    createRentVehicleClient,
    RentVehicle,
    RentVehiclePartySummary,
    RentVehicleRegistrationSummary,
    RentVehicleVehicleCategory, updateRentVehicleClient,
} from '@/features/rent-vehicles'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'

interface RentVehicleFormProps {
    tenantSlug: string
    vendors: RentVehiclePartySummary[]
    vehicleCategories: RentVehicleVehicleCategory[]
    registrationSerials: RentVehicleRegistrationSummary[]
    registrationZones: RentVehicleRegistrationSummary[]
    initialData?: Partial<RentVehicle>
    rentVehicleId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

export default function RentVehicleForm({
    tenantSlug,
    vendors,
    vehicleCategories,
    registrationSerials,
    registrationZones,
    initialData,
    rentVehicleId,
    submitLabel = 'Save Rent Vehicle',
}: RentVehicleFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const vendorOptions = vendors.map((vendor) => ({
        label: vendor.name,
        value: String(vendor.id),
    }))
    const vehicleCategoryOptions = vehicleCategories.map((category) => ({
        label: category.name,
        value: String(category.id),
    }))
    const registrationSerialOptions = registrationSerials.map((serial) => ({
        label: serial.name,
        value: String(serial.id),
    }))
    const registrationZoneOptions = registrationZones.map((zone) => ({
        label: zone.name,
        value: String(zone.id),
    }))

    const [vehicleName, setVehicleName] = useState(initialData?.vehicle_name || '')
    const [vendorId, setVendorId] = useState(
        typeof initialData?.vendor_id === 'number' || typeof initialData?.vendor_id === 'string'
            ? String(initialData.vendor_id)
            : typeof initialData?.vendor?.id === 'number'
                ? String(initialData.vendor.id)
                : '',
    )
    const [driverName, setDriverName] = useState(
        initialData?.driver_name
        || initialData?.driver?.name
        || initialData?.vendor_driver?.name
        || '',
    )
    const initialVehicleCategoryId =
        typeof initialData?.vehicle_category_id === 'number' || typeof initialData?.vehicle_category_id === 'string'
            ? String(initialData.vehicle_category_id)
            : ''
    const [vehicleCategoryId, setVehicleCategoryId] = useState(initialVehicleCategoryId)
    const [vehicleSizeId, setVehicleSizeId] = useState(
        typeof initialData?.vehicle_size_id === 'number' || typeof initialData?.vehicle_size_id === 'string'
            ? String(initialData.vehicle_size_id)
            : '',
    )
    const [registrationNumber, setRegistrationNumber] = useState(initialData?.registration_number || '')
    const [registrationSerialId, setRegistrationSerialId] = useState(
        typeof initialData?.registration_serial_id === 'number' || typeof initialData?.registration_serial_id === 'string'
            ? String(initialData.registration_serial_id)
            : typeof initialData?.registration_serial?.id === 'number'
                ? String(initialData.registration_serial.id)
                : '',
    )
    const [registrationZoneId, setRegistrationZoneId] = useState(
        typeof initialData?.registration_zone_id === 'number' || typeof initialData?.registration_zone_id === 'string'
            ? String(initialData.registration_zone_id)
            : typeof initialData?.registration_zone?.id === 'number'
                ? String(initialData.registration_zone.id)
                : '',
    )
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')

    const selectedCategory = vehicleCategories.find((item) => String(item.id) === vehicleCategoryId)
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

    function handleVehicleCategoryChange(nextCategoryId: string) {
        setVehicleCategoryId(nextCategoryId)

        const nextCategory = vehicleCategories.find((item) => String(item.id) === nextCategoryId)
        const hasSelectedSize = (nextCategory?.sizes || []).some((size) => String(size.id) === vehicleSizeId)
        if (!hasSelectedSize) setVehicleSizeId('')
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!vehicleName.trim()) {
            toast.error('Vehicle name is required')
            return
        }

        if (!vendorId.trim()) {
            toast.error('Vendor is required')
            return
        }

        if (!driverName.trim()) {
            toast.error('Driver name is required')
            return
        }

        if (!vehicleCategoryId.trim()) {
            toast.error('Vehicle category is required')
            return
        }

        if (!vehicleSizeId.trim()) {
            toast.error('Vehicle size is required')
            return
        }

        if (!registrationNumber.trim()) {
            toast.error('Registration number is required')
            return
        }

        if (!registrationSerialId.trim()) {
            toast.error('Registration serial is required')
            return
        }

        if (!registrationZoneId.trim()) {
            toast.error('Registration zone is required')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('vehicle_name', vehicleName.trim())
            formData.append('vendor_id', vendorId)
            formData.append('driver_name', driverName.trim())
            formData.append('vehicle_category_id', vehicleCategoryId)
            formData.append('vehicle_size_id', vehicleSizeId)
            formData.append('registration_number', registrationNumber.trim())
            formData.append('registration_serial_id', registrationSerialId)
            formData.append('registration_zone_id', registrationZoneId)
            formData.append('status', status)

            const res = rentVehicleId
                ? await updateRentVehicleClient(tenantSlug, rentVehicleId, formData)
                : await createRentVehicleClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Rent vehicle saved successfully')
                router.push(`/${tenantSlug}/rent-vehicles`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save rent vehicle')
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
                <p className="mt-1 text-sm text-slate-600">Fill in rent vehicle details and save.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                    label="Vehicle Name"
                    name="vehicle_name"
                    value={vehicleName}
                    onChange={setVehicleName}
                    placeholder="Vehicle Name"
                    required
                />
                <SelectInput
                    label="Vendor"
                    name="vendor_id"
                    value={vendorId}
                    options={vendorOptions}
                    onChange={setVendorId}
                    emptyOptionLabel="Select Vendor"
                    required
                />
                <TextInput
                    label="Driver Name"
                    name="driver_name"
                    value={driverName}
                    onChange={setDriverName}
                    placeholder="Driver Name"
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
                    label="Registration Number"
                    name="registration_number"
                    value={registrationNumber}
                    onChange={setRegistrationNumber}
                    placeholder="Registration Number"
                    required
                />
                <SelectInput
                    label="Registration Serial"
                    name="registration_serial_id"
                    value={registrationSerialId}
                    options={registrationSerialOptions}
                    onChange={setRegistrationSerialId}
                    emptyOptionLabel="Select Registration Serial"
                    required
                />
                <SelectInput
                    label="Registration Zone"
                    name="registration_zone_id"
                    value={registrationZoneId}
                    options={registrationZoneOptions}
                    onChange={setRegistrationZoneId}
                    emptyOptionLabel="Select Registration Zone"
                    required
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
                    onClick={() => router.push(`/${tenantSlug}/rent-vehicles`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
