'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createCustomerClient, updateCustomerClient, Customer, CustomerPayload } from '@/features/customers'
import type { FileSystemItem } from '@/features/files'
import ImagePickerField from '@/components/form/ImagePickerField'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface CustomerFormProps {
    tenantSlug: string
    initialData?: Partial<Customer>
    initialFiles: FileSystemItem[]
    customerId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

const RATE_STATUS_OPTIONS = [
    { label: 'Fixed', value: 'fixed' },
    { label: 'Dynamic', value: 'dynamic' },
]

interface CustomerAddressRow {
    key: string
    name: string
    address: string
}

function normalizeAddressRows(address?: Customer['address']): CustomerAddressRow[] {
    if (Array.isArray(address) && address.length > 0) {
        return address.map((item, index) => ({
            key: item.id ? `address-${item.id}` : `address-${index}`,
            name: item.name || '',
            address: item.address || '',
        }))
    }

    if (typeof address === 'string' && address.trim()) {
        return [{
            key: 'address-0',
            name: '',
            address: address.trim(),
        }]
    }

    return [{
        key: 'address-0',
        name: '',
        address: '',
    }]
}

export default function CustomerForm({
    tenantSlug,
    initialData,
    initialFiles,
    customerId,
    submitLabel = 'Save Customer',
}: CustomerFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { language } = useI18n()
    const resolvedSubmitLabel = translateUiText(submitLabel, language)

    const [name, setName] = useState(initialData?.name || '')
    const [mobile, setMobile] = useState(initialData?.mobile || '')
    const [email, setEmail] = useState(initialData?.email || '')
    const [image, setImage] = useState(initialData?.image || '')
    const [addresses, setAddresses] = useState<CustomerAddressRow[]>(() => normalizeAddressRows(initialData?.address))
    const [rateStatus, setRateStatus] = useState(initialData?.rate_status || 'fixed')
    const [openingBalance, setOpeningBalance] = useState(
        initialData?.opening_balance === null || typeof initialData?.opening_balance === 'undefined'
            ? ''
            : String(initialData.opening_balance),
    )
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!name.trim()) {
            toast.error('Name is required')
            return
        }

        if (!mobile.trim()) {
            toast.error('Mobile is required')
            return
        }

        if (!rateStatus.trim()) {
            toast.error('Rate status is required')
            return
        }

        const cleanedAddresses = addresses
            .map((item) => ({
                name: item.name.trim(),
                address: item.address.trim(),
            }))
            .filter((item) => item.name || item.address)

        if (cleanedAddresses.length === 0) {
            toast.error('At least one address is required')
            return
        }

        const invalidAddress = cleanedAddresses.find((item) => !item.name || !item.address)
        if (invalidAddress) {
            toast.error('Each address needs both name and address')
            return
        }

        setLoading(true)
        try {
            const payload: CustomerPayload = {
                name: name.trim(),
                mobile: mobile.trim(),
                email: email.trim(),
                image: image.trim() || null,
                address: cleanedAddresses,
                rate_status: rateStatus,
                opening_balance: openingBalance.trim() || undefined,
                status,
            }

            const res = customerId
                ? await updateCustomerClient(tenantSlug, customerId, payload)
                : await createCustomerClient(tenantSlug, payload)

            if (res.success) {
                toast.success(res.message || 'Customer saved successfully')
                router.push(`/${tenantSlug}/customers`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save customer')
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
                <p className="mt-1 text-sm text-slate-600">Fill in customer details and save.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                    label="Customer Name"
                    name="name"
                    value={name}
                    onChange={setName}
                    placeholder="Customer Name"
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
                <TextInput
                    label="Email"
                    name="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Email"
                    type="email"
                />
                <ImagePickerField
                    tenantSlug={tenantSlug}
                    label="Customer Image"
                    value={image}
                    onChange={setImage}
                    initialFiles={initialFiles}
                    previewAlt="Customer image preview"
                    triggerLabel="Choose Image"
                />

                <SelectInput
                    label="Rate Status"
                    name="rate_status"
                    value={rateStatus}
                    options={RATE_STATUS_OPTIONS}
                    onChange={setRateStatus}
                    includeEmptyOption={false}
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

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">Addresses</h3>
                        <p className="text-sm text-slate-600">Add one or more customer addresses.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setAddresses((prev) => [...prev, { key: `address-${Date.now()}`, name: '', address: '' }])}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        + Add Address
                    </button>
                </div>

                <div className="space-y-4">
                    {addresses.map((item, index) => (
                        <div key={item.key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <h4 className="text-sm font-semibold text-slate-800">Address {index + 1}</h4>
                                <button
                                    type="button"
                                    onClick={() => setAddresses((prev) => (prev.length > 1 ? prev.filter((row) => row.key !== item.key) : prev.map((row) => ({ ...row, name: '', address: '' }))))}
                                    className="text-sm font-medium text-rose-600 hover:text-rose-700"
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <TextInput
                                    label="Address Name"
                                    name={`address_name_${index}`}
                                    value={item.name}
                                    onChange={(value) =>
                                        setAddresses((prev) =>
                                            prev.map((row) => (row.key === item.key ? { ...row, name: value } : row)),
                                        )
                                    }
                                    placeholder="e.g. Mirpur Dipo"
                                    required
                                />
                                <TextInput
                                    label="Address"
                                    name={`address_${index}`}
                                    value={item.address}
                                    onChange={(value) =>
                                        setAddresses((prev) =>
                                            prev.map((row) => (row.key === item.key ? { ...row, address: value } : row)),
                                        )
                                    }
                                    placeholder="e.g. Mirpur 1, Dhaka"
                                    textarea
                                    rows={3}
                                    required
                                />
                            </div>
                        </div>
                    ))}
                </div>
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
                    onClick={() => router.push(`/${tenantSlug}/customers`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
