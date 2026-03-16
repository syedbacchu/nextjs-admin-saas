'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createVehicleClient, updateVehicleClient } from '@/services/vehicle/vehicle.client'
import type { Vehicle } from '@/services/vehicle/vehicle.types'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'

interface VehicleFormProps {
    tenantSlug: string
    initialData?: Partial<Vehicle>
    vehicleId?: number | string
    submitLabel?: string
}

const VEHICLE_TYPES = ['van', 'truck', 'car', 'bus', 'pickup']
const VEHICLE_TYPE_OPTIONS = VEHICLE_TYPES.map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type,
}))
const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

export default function VehicleForm({
    tenantSlug,
    initialData,
    vehicleId,
    submitLabel = 'Save Vehicle',
}: VehicleFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [registrationNo, setRegistrationNo] = useState(initialData?.registration_no || '')
    const [vehicleType, setVehicleType] = useState(initialData?.vehicle_type || 'van')
    const [brand, setBrand] = useState(initialData?.brand || '')
    const [model, setModel] = useState(initialData?.model || '')
    const [manufacturingYear, setManufacturingYear] = useState(
        initialData?.manufacturing_year ? String(initialData.manufacturing_year) : '',
    )
    const [color, setColor] = useState(initialData?.color || '')
    const [notes, setNotes] = useState(initialData?.notes || '')
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!registrationNo.trim()) {
            toast.error('Registration number is required')
            return
        }

        if (!brand.trim()) {
            toast.error('Brand is required')
            return
        }

        if (!model.trim()) {
            toast.error('Model is required')
            return
        }

        if (!manufacturingYear.trim()) {
            toast.error('Manufacturing year is required')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('registration_no', registrationNo.trim())
            formData.append('vehicle_type', vehicleType)
            formData.append('brand', brand.trim())
            formData.append('model', model.trim())
            formData.append('manufacturing_year', manufacturingYear.trim())
            formData.append('color', color.trim())
            formData.append('notes', notes.trim())
            formData.append('status', status)

            const res = vehicleId
                ? await updateVehicleClient(tenantSlug, vehicleId, formData)
                : await createVehicleClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Vehicle saved successfully')
                router.push(`/${tenantSlug}/vehicles`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save vehicle')
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
                <p className="mt-1 text-sm text-slate-600">Fill in vehicle details and save.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                    label="Registration No"
                    name="registration_no"
                    value={registrationNo}
                    onChange={setRegistrationNo}
                    placeholder="Registration No"
                    required
                />
                <SelectInput
                    label="Vehicle Type"
                    name="vehicle_type"
                    value={vehicleType}
                    options={VEHICLE_TYPE_OPTIONS}
                    onChange={setVehicleType}
                    includeEmptyOption={false}
                />
                <TextInput
                    label="Brand"
                    name="brand"
                    value={brand}
                    onChange={setBrand}
                    placeholder="Brand"
                    required
                />
                <TextInput
                    label="Model"
                    name="model"
                    value={model}
                    onChange={setModel}
                    placeholder="Model"
                    required
                />
                <TextInput
                    label="Manufacturing Year"
                    name="manufacturing_year"
                    value={manufacturingYear}
                    onChange={setManufacturingYear}
                    placeholder="Manufacturing Year"
                    allowOnlyNumber
                    maxLength={4}
                    required
                />
                <TextInput
                    label="Color"
                    name="color"
                    value={color}
                    onChange={setColor}
                    placeholder="Color"
                />
                <SelectInput
                    label="Status"
                    name="status"
                    value={status}
                    options={STATUS_OPTIONS}
                    onChange={setStatus}
                    includeEmptyOption={false}
                />
            </div>

            <TextInput
                label="Notes"
                name="notes"
                value={notes}
                onChange={setNotes}
                placeholder="Notes"
                textarea
                rows={3}
            />

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
                    onClick={() => router.push(`/${tenantSlug}/vehicles`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
