'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createSupervisorClient, updateSupervisorClient, Supervisor, SupervisorVehicleCategory } from '@/features/supervisors'
import type { FileSystemItem } from '@/features/files'
import ImagePickerField from '@/components/form/ImagePickerField'
import SelectInput from '@/components/form/SelectInput'
import TextInput from '@/components/form/TextInput'
import { DateInput } from '@/components/form/DateInput'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface SupervisorFormProps {
    tenantSlug: string
    vehicleCategories: SupervisorVehicleCategory[]
    initialFiles: FileSystemItem[]
    initialData?: Partial<Supervisor>
    supervisorId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

function toDateInputValue(value?: string | null): string {
    if (!value) return ''
    const trimmed = value.trim()
    if (!trimmed) return ''

    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        return trimmed.slice(0, 10)
    }

    const parsed = new Date(trimmed)
    if (Number.isNaN(parsed.getTime())) return ''
    return parsed.toISOString().slice(0, 10)
}

export default function SupervisorForm({
    tenantSlug,
    vehicleCategories,
    initialFiles,
    initialData,
    supervisorId,
    submitLabel = 'Save Supervisor',
}: SupervisorFormProps) {
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
    const [nidNo, setNidNo] = useState(initialData?.nid_no || '')
    const [joiningDate, setJoiningDate] = useState(toDateInputValue(initialData?.joining_date))
    const [address, setAddress] = useState(initialData?.address || '')
    const [vehicleCategoryId, setVehicleCategoryId] = useState(
        typeof initialData?.vehicle_category_id === 'number' || typeof initialData?.vehicle_category_id === 'string'
            ? String(initialData.vehicle_category_id)
            : typeof initialData?.vehicle_category?.id === 'number'
                ? String(initialData.vehicle_category.id)
                : '',
    )
    const [basicSalary, setBasicSalary] = useState(
        initialData?.basic_salary === null || typeof initialData?.basic_salary === 'undefined'
            ? '0'
            : String(initialData.basic_salary),
    )
    const [houseRent, setHouseRent] = useState(
        initialData?.house_rent === null || typeof initialData?.house_rent === 'undefined'
            ? '0'
            : String(initialData.house_rent),
    )
    const [medical, setMedical] = useState(
        initialData?.medical === null || typeof initialData?.medical === 'undefined'
            ? '0'
            : String(initialData.medical),
    )
    const [allowance, setAllowance] = useState(
        initialData?.allowance === null || typeof initialData?.allowance === 'undefined'
            ? '0'
            : String(initialData.allowance),
    )
    const [extraAllowance, setExtraAllowance] = useState(
        initialData?.extra_allowance === null || typeof initialData?.extra_allowance === 'undefined'
            ? '0'
            : String(initialData.extra_allowance),
    )
    const [conveyance, setConveyance] = useState(
        initialData?.conveyance === null || typeof initialData?.conveyance === 'undefined'
            ? '0'
            : String(initialData.conveyance),
    )
    const [grossSalary, setGrossSalary] = useState(
        initialData?.gross_salary === null || typeof initialData?.gross_salary === 'undefined'
            ? '0'
            : String(initialData.gross_salary),
    )
    const [image, setImage] = useState(initialData?.image || '')
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')

    // Automatically calculate gross salary
    useEffect(() => {
        const basic = parseFloat(basicSalary) || 0
        const house = parseFloat(houseRent) || 0
        const med = parseFloat(medical) || 0
        const allow = parseFloat(allowance) || 0
        const conv = parseFloat(conveyance) || 0
        const extra = parseFloat(extraAllowance) || 0

        const gross = basic + house + med + allow + conv + extra
        setGrossSalary(gross.toFixed(2))
    }, [basicSalary, houseRent, medical, allowance, conveyance, extraAllowance])

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!name.trim()) {
            toast.error(translateUiText('Supervisor name is required', language))
            return
        }

        if (!mobile.trim()) {
            toast.error(translateUiText('Supervisor mobile is required', language))
            return
        }

        if (!nidNo.trim()) {
            toast.error(translateUiText('NID number is required', language))
            return
        }

        if (!joiningDate.trim()) {
            toast.error(translateUiText('Joining date is required', language))
            return
        }

        if (!address.trim()) {
            toast.error(translateUiText('Address is required', language))
            return
        }

        if (!vehicleCategoryId.trim()) {
            toast.error(translateUiText('Vehicle category is required', language))
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', name.trim())
            formData.append('mobile', mobile.trim())
            formData.append('nid_no', nidNo.trim())
            formData.append('joining_date', joiningDate.trim())
            formData.append('address', address.trim())
            formData.append('vehicle_category_id', vehicleCategoryId)
            formData.append('basic_salary', basicSalary.trim() || '0')
            formData.append('house_rent', houseRent.trim() || '0')
            formData.append('medical', medical.trim() || '0')
            formData.append('allowance', allowance.trim() || '0')
            formData.append('extra_allowance', extraAllowance.trim() || '0')
            formData.append('conveyance', conveyance.trim() || '0')
            formData.append('gross_salary', grossSalary.trim() || '0')
            formData.append('image', image.trim() || '')
            formData.append('status', status)

            const res = supervisorId
                ? await updateSupervisorClient(tenantSlug, supervisorId, formData)
                : await createSupervisorClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || translateUiText('Supervisor saved successfully', language))
                router.push(`/${tenantSlug}/supervisors`)
                router.refresh()
            } else {
                toast.error(res.message || translateUiText('Failed to save supervisor', language))
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
                <p className="mt-1 text-sm text-slate-600">Fill in supervisor details and save.</p>
            </div>
            <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <TextInput
                        label="Supervisor Name"
                        name="name"
                        value={name}
                        onChange={setName}
                        placeholder="Supervisor Name"
                        required
                    />
                    <TextInput
                        label="Supervisor Mobile"
                        name="mobile"
                        value={mobile}
                        onChange={setMobile}
                        placeholder="Supervisor Mobile"
                        allowOnlyNumber
                        required
                    />
                    <TextInput
                        label="NID No"
                        name="nid_no"
                        value={nidNo}
                        onChange={setNidNo}
                        placeholder="NID No"
                        required
                    />
                    <DateInput
                        label="Joining Date"
                        name="joining_date"
                        value={joiningDate}
                        onChange={setJoiningDate}
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
                    <SelectInput
                        label="Status"
                        name="status"
                        value={status}
                        options={STATUS_OPTIONS}
                        onChange={setStatus}
                        includeEmptyOption={false}
                        required
                    />
                    <TextInput
                        label="Address"
                        name="address"
                        value={address}
                        onChange={setAddress}
                        placeholder="Address"
                        required
                        textarea
                        rows={3}
                    />
                    <ImagePickerField
                        tenantSlug={tenantSlug}
                        label="Image"
                        value={image}
                        onChange={setImage}
                        initialFiles={initialFiles}
                        previewAlt="Supervisor image preview"
                        triggerLabel="Choose Image"
                        modalDescription="Select a supervisor image or upload new files."
                    />
                </div>
            </section>
            <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                <h3 className="text-lg font-semibold text-slate-900">Salary Information (Optional)</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    
                    <TextInput
                        label="Basic Salary"
                        name="basic_salary"
                        value={basicSalary}
                        onChange={setBasicSalary}
                        placeholder="Basic Salary"
                        type="number"
                    />
                    <TextInput
                        label="House Rent"
                        name="house_rent"
                        value={houseRent}
                        onChange={setHouseRent}
                        placeholder="House Rent"
                        type="number"
                    />
                    <TextInput
                        label="Medical"
                        name="medical"
                        value={medical}
                        onChange={setMedical}
                        placeholder="Medical"
                        type="number"
                    />
                    <TextInput
                        label="Allowance"
                        name="allowance"
                        value={allowance}
                        onChange={setAllowance}
                        placeholder="Allowance"
                        type="number"
                    />
                    <TextInput
                        label="Conveyance"
                        name="conveyance"
                        value={conveyance}
                        onChange={setConveyance}
                        placeholder="Conveyance"
                        type="number"
                    />
                    <TextInput
                        label="Extra Allowance"
                        name="extra_allowance"
                        value={extraAllowance}
                        onChange={setExtraAllowance}
                        placeholder="Extra Allowance"
                        type="number"
                    />
                    <TextInput
                        label="Gross Salary"
                        name="gross_salary"
                        value={grossSalary}
                        placeholder="Gross Salary"
                        type="number"
                        readOnly
                        className="bg-slate-50"
                    />
                </div>
            </section>

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
                    onClick={() => router.push(`/${tenantSlug}/supervisors`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
