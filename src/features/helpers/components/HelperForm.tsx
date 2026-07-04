'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createHelperClient, updateHelperClient, Helper, HelperVehicleCategory } from '@/features/helpers'
import type { FileSystemItem } from '@/features/files'
import ImagePickerField from '@/components/form/ImagePickerField'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'

interface HelperFormProps {
    tenantSlug: string
    vehicleCategories: HelperVehicleCategory[]
    initialFiles: FileSystemItem[]
    initialData?: Partial<Helper>
    helperId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

export default function HelperForm({
    tenantSlug,
    vehicleCategories,
    initialFiles,
    initialData,
    helperId,
    submitLabel = 'Save Helper',
}: HelperFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const vehicleCategoryOptions = vehicleCategories.map((category) => ({
        label: category.name,
        value: String(category.id),
    }))

    const [name, setName] = useState(initialData?.name || '')
    const [mobile, setMobile] = useState(initialData?.mobile || '')
    const [image, setImage] = useState(initialData?.image || '')
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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!name.trim()) {
            toast.error('Helper name is required')
            return
        }

        if (!mobile.trim()) {
            toast.error('Helper mobile is required')
            return
        }

        if (!address.trim()) {
            toast.error('Address is required')
            return
        }

        if (!vehicleCategoryId.trim()) {
            toast.error('Vehicle category is required')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', name.trim())
            formData.append('mobile', mobile.trim())
            formData.append('image', image.trim())
            formData.append('address', address.trim())
            formData.append('vehicle_category_id', vehicleCategoryId)
            formData.append('basic_salary', basicSalary.trim() || '0')
            formData.append('house_rent', houseRent.trim() || '0')
            formData.append('medical', medical.trim() || '0')
            formData.append('allowance', allowance.trim() || '0')
            formData.append('extra_allowance', extraAllowance.trim() || '0')
            formData.append('conveyance', conveyance.trim() || '0')
            formData.append('gross_salary', grossSalary.trim() || '0')
            formData.append('status', status)

            const res = helperId
                ? await updateHelperClient(tenantSlug, helperId, formData)
                : await createHelperClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Helper saved successfully')
                router.push(`/${tenantSlug}/helpers`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save helper')
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{submitLabel}</h2>
                    <p className="mt-1 text-sm text-slate-600">Fill in helper details and save.</p>
                </div>
                <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                    <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <TextInput
                            label="Helper Name"
                            name="name"
                            value={name}
                            onChange={setName}
                            placeholder="Helper Name"
                            required
                        />
                        <TextInput
                            label="Helper Mobile"
                            name="mobile"
                            value={mobile}
                            onChange={setMobile}
                            placeholder="Helper Mobile"
                            allowOnlyNumber
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
                        />
                        <ImagePickerField
                            tenantSlug={tenantSlug}
                            label="Helper Image"
                            value={image}
                            onChange={setImage}
                            initialFiles={initialFiles}
                            previewAlt="Helper image preview"
                            triggerLabel="Choose Image"
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
                        {loading ? 'Saving...' : submitLabel}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push(`/${tenantSlug}/helpers`)}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}
