'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createDriverClient, updateDriverClient, type Driver, type DriverVehicleCategory } from '..'
import type { FileSystemItem } from '@/features/files'
import ImagePickerField from '@/components/form/ImagePickerField'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'
import { DateInput } from '@/components/form/DateInput'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface DriverFormProps {
    tenantSlug: string
    vehicleCategories: DriverVehicleCategory[]
    initialFiles: FileSystemItem[]
    initialData?: Partial<Driver>
    driverId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

const LOGIN_STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

const LOGIN_ENABLE_OPTIONS = [
    { label: 'Enabled', value: '1' },
    { label: 'Disabled', value: '0' },
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

export default function DriverForm({
    tenantSlug,
    vehicleCategories,
    initialFiles,
    initialData,
    driverId,
    submitLabel = 'Save Driver',
}: DriverFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { language } = useI18n()
    const resolvedSubmitLabel = translateUiText(submitLabel, language)
    const vehicleCategoryOptions = vehicleCategories.map((category) => ({
        label: category.name,
        value: String(category.id),
    }))

    const [name, setName] = useState(initialData?.name || '')
    const [phone, setPhone] = useState(initialData?.phone || '')
    const [emergencyContact, setEmergencyContact] = useState(initialData?.emergency_contact || '')
    const [licenseNo, setLicenseNo] = useState(initialData?.license_no || '')
    const [licenseExpiredDate, setLicenseExpiredDate] = useState(
        toDateInputValue(initialData?.license_expired_date),
    )
    const [vehicleCategoryId, setVehicleCategoryId] = useState(
        typeof initialData?.vehicle_category_id === 'number' || typeof initialData?.vehicle_category_id === 'string'
            ? String(initialData.vehicle_category_id)
            : typeof initialData?.vehicle_category?.id === 'number'
                ? String(initialData.vehicle_category.id)
                : '',
    )
    const [nidNo, setNidNo] = useState(initialData?.nid_no || '')
    const [joiningDate, setJoiningDate] = useState(toDateInputValue(initialData?.joining_date))
    const [address, setAddress] = useState(initialData?.address || '')
    const [notes, setNotes] = useState(initialData?.notes || '')
    const [image, setImage] = useState(initialData?.image || '')
    const [openingBalance, setOpeningBalance] = useState(
        initialData?.opening_balance === null || typeof initialData?.opening_balance === 'undefined'
            ? ''
            : String(initialData.opening_balance),
    )
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')
    const [loginName, setLoginName] = useState(initialData?.login_account?.name || '')
    const [loginEmail, setLoginEmail] = useState(initialData?.login_account?.email || '')
    const [loginPhone, setLoginPhone] = useState(initialData?.login_account?.phone || '')
    const [loginUsername, setLoginUsername] = useState(initialData?.login_account?.username || '')
    const [loginPassword, setLoginPassword] = useState('')
    const [loginEnableLogin, setLoginEnableLogin] = useState(
        typeof initialData?.login_account?.enable_login === 'number'
            ? String(initialData.login_account.enable_login)
            : '',
    )
    const [loginStatus, setLoginStatus] = useState(
        typeof initialData?.login_account?.status === 'number'
            ? String(initialData.login_account.status)
            : '',
    )
    const [loginSectionOpen, setLoginSectionOpen] = useState(false)

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!name.trim()) {
            toast.error(translateUiText('Name is required', language))
            return
        }

        if (!phone.trim()) {
            toast.error(translateUiText('Phone is required', language))
            return
        }

        if (!licenseNo.trim()) {
            toast.error(translateUiText('License number is required', language))
            return
        }

        if (!licenseExpiredDate.trim()) {
            toast.error(translateUiText('License expired date is required', language))
            return
        }

        if (!nidNo.trim()) {
            toast.error(translateUiText('NID number is required', language))
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
            formData.append('phone', phone.trim())
            formData.append('mobile', phone.trim())
            formData.append('emergency_contact', emergencyContact.trim())
            formData.append('license_no', licenseNo.trim())
            formData.append('license_expired_date', licenseExpiredDate.trim())
            formData.append('vehicle_category_id', vehicleCategoryId)
            formData.append('nid_no', nidNo.trim())
            formData.append('joining_date', joiningDate.trim())
            formData.append('address', address.trim())
            formData.append('notes', notes.trim())
            formData.append('image', image.trim())
            if (openingBalance.trim()) formData.append('opening_balance', openingBalance.trim())
            formData.append('status', status)
            if (loginName.trim()) formData.append('login_name', loginName.trim())
            if (loginEmail.trim()) formData.append('login_email', loginEmail.trim())
            if (loginPhone.trim()) formData.append('login_phone', loginPhone.trim())
            if (loginUsername.trim()) formData.append('login_username', loginUsername.trim())
            if (loginPassword.trim()) formData.append('login_password', loginPassword.trim())
            if (loginEnableLogin !== '') formData.append('login_enable_login', loginEnableLogin)
            if (loginStatus !== '') formData.append('login_status', loginStatus)

            const res = driverId
                ? await updateDriverClient(tenantSlug, driverId, formData)
                : await createDriverClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || translateUiText('Driver saved successfully', language))
                router.push(`/${tenantSlug}/drivers`)
                router.refresh()
            } else {
                toast.error(res.message || translateUiText('Failed to save driver', language))
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
                    <p className="mt-1 text-sm text-slate-600">Fill in driver details and save.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <TextInput
                        label="Driver Name"
                        name="name"
                        value={name}
                        onChange={setName}
                        placeholder="Driver Name"
                        required
                    />
                    <TextInput
                        label="Driver Mobile"
                        name="phone"
                        value={phone}
                        onChange={setPhone}
                        placeholder="Driver Mobile"
                        required
                        allowOnlyNumber
                    />
                    <TextInput
                        label="Address"
                        name="address"
                        value={address}
                        onChange={setAddress}
                        placeholder="Address"
                        required
                    />
                    <TextInput
                        label="Emergency Contact"
                        name="emergency_contact"
                        value={emergencyContact}
                        onChange={setEmergencyContact}
                        placeholder="Emergency Contact"
                        allowOnlyNumber
                    />
                    <TextInput
                        label="NID No"
                        name="nid_no"
                        value={nidNo}
                        onChange={setNidNo}
                        placeholder="NID No"
                        required
                        allowOnlyNumber
                    />
                    <TextInput
                        label="License No"
                        name="license_no"
                        value={licenseNo}
                        onChange={setLicenseNo}
                        placeholder="License No"
                        required
                    />
                    <DateInput
                        label="License Expired Date"
                        name="license_expired_date"
                        value={licenseExpiredDate}
                        onChange={setLicenseExpiredDate}
                        required
                    />
                    <TextInput
                        label="Note"
                        name="notes"
                        value={notes}
                        onChange={setNotes}
                        placeholder="Note"
                    />
                    <DateInput
                        label="Joining Date"
                        name="joining_date"
                        value={joiningDate}
                        onChange={setJoiningDate}
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

                <ImagePickerField
                    tenantSlug={tenantSlug}
                    label="Driver Image"
                    value={image}
                    onChange={setImage}
                    initialFiles={initialFiles}
                    previewAlt="Driver image preview"
                    triggerLabel="Choose Image"
                />

                <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">{translateUiText('Login Account (Optional)', language)}</h3>
                            <p className="mt-1 text-xs text-slate-600">
                                Fill these fields to create or update this driver login from driver update API.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setLoginSectionOpen((prev) => !prev)}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                            {loginSectionOpen ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    {loginSectionOpen && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <TextInput
                                label="Login Name"
                                name="login_name"
                                value={loginName}
                                onChange={setLoginName}
                                placeholder="Login Name"
                            />
                            <TextInput
                                label="Login Email"
                                name="login_email"
                                value={loginEmail}
                                onChange={setLoginEmail}
                                placeholder="Login Email"
                                type="email"
                            />
                            <TextInput
                                label="Login Phone"
                                name="login_phone"
                                value={loginPhone}
                                onChange={setLoginPhone}
                                placeholder="Login Phone"
                            />
                            <TextInput
                                label="Login Username"
                                name="login_username"
                                value={loginUsername}
                                onChange={setLoginUsername}
                                placeholder="Login Username"
                                noSpace
                            />
                            <TextInput
                                label="Login Password"
                                name="login_password"
                                value={loginPassword}
                                onChange={setLoginPassword}
                                placeholder="Leave blank to keep current password"
                                type="password"
                            />
                            <SelectInput
                                label="Login Enable"
                                name="login_enable_login"
                                value={loginEnableLogin}
                                options={LOGIN_ENABLE_OPTIONS}
                                onChange={setLoginEnableLogin}
                            />
                            <SelectInput
                                label="Login Status"
                                name="login_status"
                                value={loginStatus}
                                options={LOGIN_STATUS_OPTIONS}
                                onChange={setLoginStatus}
                            />
                        </div>
                    )}
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
                        onClick={() => router.push(`/${tenantSlug}/drivers`)}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                </div>
            </form>

        </>
    )
}
