'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'
import { DateInput } from '@/components/form/DateInput'
import ImagePickerField from '@/components/form/ImagePickerField'
import {
    createEmployeeClient,
    updateEmployeeClient,
    type Employee,
} from '..'
import type { FileSystemItem } from '@/features/files'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface EmployeeFormProps {
    tenantSlug: string
    initialFiles: FileSystemItem[]
    initialData?: Partial<Employee>
    employeeId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

const GENDER_OPTIONS = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
]

const BLOOD_GROUP_OPTIONS = [
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
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

export default function EmployeeForm({
    tenantSlug,
    initialFiles,
    initialData,
    employeeId,
    submitLabel = 'Save Employee',
}: EmployeeFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { language } = useI18n()
    const resolvedSubmitLabel = translateUiText(submitLabel, language)

    const [name, setName] = useState(initialData?.name || '')
    const [email, setEmail] = useState(initialData?.email || '')
    const [mobile, setMobile] = useState(initialData?.mobile || '')
    const [gender, setGender] = useState(initialData?.gender || '')
    const [bloodGroup, setBloodGroup] = useState(initialData?.blood_group || '')
    const [birthDate, setBirthDate] = useState(toDateInputValue(initialData?.birth_date))
    const [joinDate, setJoinDate] = useState(toDateInputValue(initialData?.join_date))
    const [nid, setNid] = useState(initialData?.nid || '')
    const [designation, setDesignation] = useState(initialData?.designation || '')
    const [address, setAddress] = useState(initialData?.address || '')
    const [basicSalary, setBasicSalary] = useState(
        initialData?.basic_salary === null || typeof initialData?.basic_salary === 'undefined'
            ? ''
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
    const [conveyance, setConveyance] = useState(
        initialData?.conveyance === null || typeof initialData?.conveyance === 'undefined'
            ? '0'
            : String(initialData.conveyance),
    )
    const [extraAllowance, setExtraAllowance] = useState(
        initialData?.extra_allowance === null || typeof initialData?.extra_allowance === 'undefined'
            ? '0'
            : String(initialData.extra_allowance),
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
            toast.error(translateUiText('Name is required', language))
            return
        }

        if (!mobile.trim()) {
            toast.error(translateUiText('Mobile is required', language))
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', name.trim())
            formData.append('email', email.trim())
            formData.append('mobile', mobile.trim())
            formData.append('gender', gender.trim())
            formData.append('blood_group', bloodGroup.trim())
            if (birthDate.trim()) formData.append('birth_date', birthDate.trim())
            if (joinDate.trim()) formData.append('join_date', joinDate.trim())
            formData.append('nid', nid.trim())
            formData.append('designation', designation.trim())
            formData.append('address', address.trim())
            formData.append('basic_salary', basicSalary.trim() || '0')
            formData.append('house_rent', houseRent.trim() || '0')
            formData.append('medical', medical.trim() || '0')
            formData.append('allowance', allowance.trim() || '0')
            formData.append('extra_allowance', extraAllowance.trim() || '0')
            formData.append('conveyance', conveyance.trim() || '0')
            formData.append('gross_salary', grossSalary.trim() || '0')
            formData.append('image', image.trim())
            formData.append('status', status)

            const res = employeeId
                ? await updateEmployeeClient(tenantSlug, employeeId, formData)
                : await createEmployeeClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || translateUiText('Employee saved successfully', language))
                router.push(`/${tenantSlug}/employees`)
                router.refresh()
            } else {
                toast.error(res.message || translateUiText('Failed to save employee', language))
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
                    <h2 className="text-xl font-bold text-slate-900">{resolvedSubmitLabel}</h2>
                    <p className="mt-1 text-sm text-slate-600">Fill in employee details and save.</p>
                </div>

                <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                    <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <TextInput
                            label="Name"
                            name="name"
                            value={name}
                            onChange={setName}
                            placeholder="Employee Name"
                            required
                        />
                        <TextInput
                            label="Email"
                            name="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="Email"
                            type="email"
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
                        <SelectInput
                            label="Gender"
                            name="gender"
                            value={gender}
                            options={GENDER_OPTIONS}
                            onChange={setGender}
                            emptyOptionLabel="Select Gender"
                        />
                        <SelectInput
                            label="Blood Group"
                            name="blood_group"
                            value={bloodGroup}
                            options={BLOOD_GROUP_OPTIONS}
                            onChange={setBloodGroup}
                            emptyOptionLabel="Select Blood Group"
                        />
                        <DateInput
                            label="Birth Date"
                            name="birth_date"
                            value={birthDate}
                            onChange={setBirthDate}
                        />
                        <DateInput
                            label="Join Date"
                            name="join_date"
                            value={joinDate}
                            onChange={setJoinDate}
                        />
                        <TextInput
                            label="NID"
                            name="nid"
                            value={nid}
                            onChange={setNid}
                            placeholder="NID"
                        />
                        <SelectInput
                            label="Status"
                            name="status"
                            value={status}
                            options={STATUS_OPTIONS}
                            onChange={setStatus}
                            includeEmptyOption={false}
                        />
                        <TextInput
                            label="Address"
                            name="address"
                            value={address}
                            onChange={setAddress}
                            placeholder="Address"
                            textarea
                            rows={3}
                        />

                        <ImagePickerField
                            tenantSlug={tenantSlug}
                            label="Image"
                            value={image}
                            onChange={setImage}
                            initialFiles={initialFiles}
                            previewAlt="Employee image preview"
                            triggerLabel="Choose Image"
                        />
                    </div>
                </section>
                <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                    <h3 className="text-lg font-semibold text-slate-900">Salary Information</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <TextInput
                            label="Designation"
                            name="designation"
                            value={designation}
                            onChange={setDesignation}
                            placeholder="Designation"
                        />
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
                        onClick={() => router.push(`/${tenantSlug}/employees`)}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}
