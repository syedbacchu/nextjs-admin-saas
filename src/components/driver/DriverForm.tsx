'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createDriverClient, updateDriverClient } from '@/services/driver/driver.client'
import type { Driver } from '@/services/driver/driver.types'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'
import { DateInput } from '@/components/form/DateInput'

interface DriverFormProps {
    tenantSlug: string
    initialData?: Partial<Driver>
    driverId?: number | string
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

export default function DriverForm({
    tenantSlug,
    initialData,
    driverId,
    submitLabel = 'Save Driver',
}: DriverFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState(initialData?.name || '')
    const [phone, setPhone] = useState(initialData?.phone || '')
    const [licenseNo, setLicenseNo] = useState(initialData?.license_no || '')
    const [nidNo, setNidNo] = useState(initialData?.nid_no || '')
    const [joiningDate, setJoiningDate] = useState(toDateInputValue(initialData?.joining_date))
    const [address, setAddress] = useState(initialData?.address || '')
    const [notes, setNotes] = useState(initialData?.notes || '')
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!name.trim()) {
            toast.error('Name is required')
            return
        }

        if (!phone.trim()) {
            toast.error('Phone is required')
            return
        }

        if (!licenseNo.trim()) {
            toast.error('License number is required')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', name.trim())
            formData.append('phone', phone.trim())
            formData.append('license_no', licenseNo.trim())
            formData.append('nid_no', nidNo.trim())
            formData.append('joining_date', joiningDate.trim())
            formData.append('address', address.trim())
            formData.append('notes', notes.trim())
            formData.append('status', status)

            const res = driverId
                ? await updateDriverClient(tenantSlug, driverId, formData)
                : await createDriverClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Driver saved successfully')
                router.push(`/${tenantSlug}/drivers`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save driver')
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
                    label="Phone"
                    name="phone"
                    value={phone}
                    onChange={setPhone}
                    placeholder="Phone"
                    required
                />
                <TextInput
                    label="License No"
                    name="license_no"
                    value={licenseNo}
                    onChange={setLicenseNo}
                    placeholder="License No"
                    required
                />
                <TextInput
                    label="NID No"
                    name="nid_no"
                    value={nidNo}
                    onChange={setNidNo}
                    placeholder="NID No"
                />
                <DateInput
                    label="Joining Date"
                    name="joining_date"
                    value={joiningDate}
                    onChange={setJoiningDate}
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
                label="Address"
                name="address"
                value={address}
                onChange={setAddress}
                placeholder="Address"
            />
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
                    onClick={() => router.push(`/${tenantSlug}/drivers`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
