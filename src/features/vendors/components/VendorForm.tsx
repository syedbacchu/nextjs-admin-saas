'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createVendorClient, updateVendorClient, type Vendor, type VendorVehicleCategory } from '@/features/vendors'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'
import { DateInput } from '@/components/form/DateInput'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface VendorFormProps {
    tenantSlug: string
    vehicleCategories: VendorVehicleCategory[]
    initialData?: Partial<Vendor>
    vendorId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
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

export default function VendorForm({
    tenantSlug,
    vehicleCategories,
    initialData,
    vendorId,
    submitLabel = 'Save Vendor',
}: VendorFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { language } = useI18n()
    const resolvedSubmitLabel = translateUiText(submitLabel, language)
    const vehicleCategoryOptions = vehicleCategories.map((category) => ({
        label: category.name,
        value: String(category.id),
    }))

    const [name, setName] = useState(initialData?.name || '')
    const [mobile, setMobile] = useState(initialData?.mobile || '')
    const [date, setDate] = useState(toDateInputValue(initialData?.date))
    const [vehicleCategoryId, setVehicleCategoryId] = useState(
        typeof initialData?.vehicle_category_id === 'number' || typeof initialData?.vehicle_category_id === 'string'
            ? String(initialData.vehicle_category_id)
            : typeof initialData?.vehicle_category?.id === 'number'
                ? String(initialData.vehicle_category.id)
                : '',
    )
    const [workArea, setWorkArea] = useState(initialData?.work_area || '')
    const [openingBalance, setOpeningBalance] = useState(
        initialData?.opening_balance === null || typeof initialData?.opening_balance === 'undefined'
            ? ''
            : String(initialData.opening_balance),
    )
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!name.trim()) {
            toast.error(translateUiText('Vendor name is required', language))
            return
        }

        if (!mobile.trim()) {
            toast.error(translateUiText('Vendor mobile is required', language))
            return
        }

        if (!date.trim()) {
            toast.error(translateUiText('Date is required', language))
            return
        }

        if (!vehicleCategoryId.trim()) {
            toast.error(translateUiText('Vehicle category is required', language))
            return
        }

        if (!workArea.trim()) {
            toast.error(translateUiText('Work area is required', language))
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', name.trim())
            formData.append('mobile', mobile.trim())
            formData.append('date', date.trim())
            formData.append('vehicle_category_id', vehicleCategoryId)
            formData.append('work_area', workArea.trim())
            formData.append('opening_balance', openingBalance.trim() || '0')
            formData.append('status', status)

            const res = vendorId
                ? await updateVendorClient(tenantSlug, vendorId, formData)
                : await createVendorClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || translateUiText('Vendor saved successfully', language))
                router.push(`/${tenantSlug}/vendors`)
                router.refresh()
            } else {
                toast.error(res.message || translateUiText('Failed to save vendor', language))
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
                <h2 className="text-xl font-bold text-slate-900">{resolvedSubmitLabel}</h2>
                <p className="mt-1 text-sm text-slate-600">{translateUiText('Fill in vendor details and save.', language)}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                    label="Vendor Name"
                    name="name"
                    value={name}
                    onChange={setName}
                    placeholder="Vendor Name"
                    required
                />
                <TextInput
                    label="Mobile"
                    name="mobile"
                    value={mobile}
                    onChange={setMobile}
                    placeholder="Mobile"
                    allowOnlyNumber
                    required
                />
                <DateInput
                    label="Date"
                    name="date"
                    value={date}
                    onChange={setDate}
                    required
                />
                <SelectInput
                    label="Vehicle Category"
                    name="vehicle_category_id"
                    value={vehicleCategoryId}
                    options={vehicleCategoryOptions}
                    onChange={setVehicleCategoryId}
                    emptyOptionLabel="Select Vehicle Category"
                    required
                />
                <TextInput
                    label="Work Area"
                    name="work_area"
                    value={workArea}
                    onChange={setWorkArea}
                    placeholder="Work Area"
                    required
                />
                <TextInput
                    label="Opening Balance"
                    name="opening_balance"
                    value={openingBalance}
                    onChange={setOpeningBalance}
                    placeholder="Opening Balance"
                    type="number"
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
                    {loading ? translateUiText('Saving...', language) : resolvedSubmitLabel}
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${tenantSlug}/vendors`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
