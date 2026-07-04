'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createSupplierClient, updateSupplierClient, Supplier } from '@/features/suppliers'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface SupplierFormProps {
    tenantSlug: string
    initialData?: Partial<Supplier>
    supplierId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

export default function SupplierForm({
    tenantSlug,
    initialData,
    supplierId,
    submitLabel = 'Save Supplier',
}: SupplierFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { language } = useI18n()
    const resolvedSubmitLabel = translateUiText(submitLabel, language)

    const [name, setName] = useState(initialData?.name || '')
    const [businessCategory, setBusinessCategory] = useState(initialData?.business_category || '')
    const [mobile, setMobile] = useState(initialData?.mobile || '')
    const [address, setAddress] = useState(initialData?.address || '')
    const [openingBalance, setOpeningBalance] = useState(
        initialData?.opening_balance === null || typeof initialData?.opening_balance === 'undefined'
            ? ''
            : String(initialData.opening_balance),
    )
    const [contactPerson, setContactPerson] = useState(initialData?.contact_person || '')
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!name.trim()) {
            toast.error('Supplier name is required')
            return
        }

        if (!businessCategory.trim()) {
            toast.error('Business category is required')
            return
        }

        if (!mobile.trim()) {
            toast.error('Mobile is required')
            return
        }

        if (!address.trim()) {
            toast.error('Address is required')
            return
        }

        if (!contactPerson.trim()) {
            toast.error('Contact person is required')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', name.trim())
            formData.append('business_category', businessCategory.trim())
            formData.append('mobile', mobile.trim())
            formData.append('address', address.trim())
            formData.append('opening_balance', openingBalance.trim() || '0')
            formData.append('contact_person', contactPerson.trim())
            formData.append('status', status)

            const res = supplierId
                ? await updateSupplierClient(tenantSlug, supplierId, formData)
                : await createSupplierClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Supplier saved successfully')
                router.push(`/${tenantSlug}/suppliers`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save supplier')
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
                <p className="mt-1 text-sm text-slate-600">Fill in supplier details and save.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                    label="Supplier Name"
                    name="name"
                    value={name}
                    onChange={setName}
                    placeholder="Supplier Name"
                    required
                />
                <TextInput
                    label="Business Category"
                    name="business_category"
                    value={businessCategory}
                    onChange={setBusinessCategory}
                    placeholder="Business Category"
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
                    label="Address"
                    name="address"
                    value={address}
                    onChange={setAddress}
                    placeholder="Address"
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
                <TextInput
                    label="Contact Person"
                    name="contact_person"
                    value={contactPerson}
                    onChange={setContactPerson}
                    placeholder="Contact Person"
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
                    {loading ? translateUiText('Saving...', language) : resolvedSubmitLabel}
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${tenantSlug}/suppliers`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
