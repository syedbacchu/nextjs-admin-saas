'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DateInput } from '@/components/form/DateInput'
import SelectInput from '@/components/form/SelectInput'
import TextInput from '@/components/form/TextInput'
import {
    createVendorPaymentClient,
    updateVendorPaymentClient,
} from '@/features/vendor-payments'
import type { VendorPayment } from '@/features/vendor-payments'
import type { Vendor } from '@/features/vendors'
import type { Office } from '@/features/offices'

interface VendorPaymentFormProps {
    tenantSlug: string
    vendors: Vendor[]
    offices: Office[]
    initialData?: Partial<VendorPayment>
    vendorPaymentId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

const BASE_PAYMENT_METHOD_OPTIONS = [
    { label: 'Bank', value: 'bank' },
    { label: 'Cash', value: 'cash' },
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

function toStringValue(value: unknown): string {
    if (value === null || typeof value === 'undefined') return ''
    return String(value)
}

export default function VendorPaymentForm({
    tenantSlug,
    vendors,
    offices,
    initialData,
    vendorPaymentId,
    submitLabel = 'Save Vendor Payment',
}: VendorPaymentFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const vendorOptions = vendors.map((vendor) => ({
        label: `${vendor.name}${vendor.mobile ? ` (${vendor.mobile})` : ''}`,
        value: String(vendor.id),
    }))
    const officeOptions = offices.map((office) => ({
        label: office.branch_name,
        value: String(office.id),
    }))

    const initialPaymentMethod = toStringValue(initialData?.payment_method)
    const paymentMethodOptions = BASE_PAYMENT_METHOD_OPTIONS.some((item) => item.value === initialPaymentMethod)
        ? BASE_PAYMENT_METHOD_OPTIONS
        : initialPaymentMethod
            ? [...BASE_PAYMENT_METHOD_OPTIONS, { label: initialPaymentMethod, value: initialPaymentMethod }]
            : BASE_PAYMENT_METHOD_OPTIONS

    const [date, setDate] = useState(toDateInputValue(initialData?.date))
    const [vendorId, setVendorId] = useState(toStringValue(initialData?.vendor_id ?? initialData?.vendor?.id))
    const [officeId, setOfficeId] = useState(toStringValue(initialData?.office_id ?? initialData?.office?.id))
    const [billRef, setBillRef] = useState(toStringValue(initialData?.bill_ref))
    const [amount, setAmount] = useState(toStringValue(initialData?.amount))
    const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod)
    const [note, setNote] = useState(toStringValue(initialData?.note))
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')
    const [billDocumentFile, setBillDocumentFile] = useState<File | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!date.trim()) {
            toast.error('Date is required')
            return
        }
        if (!vendorId.trim()) {
            toast.error('Vendor is required')
            return
        }
        if (!officeId.trim()) {
            toast.error('Branch is required')
            return
        }
        if (!billRef.trim()) {
            toast.error('Bill ref is required')
            return
        }
        if (!amount.trim()) {
            toast.error('Amount is required')
            return
        }
        if (!paymentMethod.trim()) {
            toast.error('Payment method is required')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('date', date.trim())
            formData.append('vendor_id', vendorId)
            formData.append('office_id', officeId)
            formData.append('bill_ref', billRef.trim())
            formData.append('amount', amount.trim())
            formData.append('payment_method', paymentMethod.trim())
            formData.append('note', note.trim())
            formData.append('status', status)

            if (billDocumentFile) {
                formData.append('bill_document', billDocumentFile)
            }

            const res = vendorPaymentId
                ? await updateVendorPaymentClient(tenantSlug, vendorPaymentId, formData)
                : await createVendorPaymentClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Vendor payment saved successfully')
                router.push(`/${tenantSlug}/vendor-payments`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save vendor payment')
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
                <p className="mt-1 text-sm text-slate-600">Fill in vendor payment details and save.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <DateInput
                    label="Date"
                    name="date"
                    value={date}
                    onChange={setDate}
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
                <SelectInput
                    label="Branch"
                    name="office_id"
                    value={officeId}
                    options={officeOptions}
                    onChange={setOfficeId}
                    emptyOptionLabel="Select Branch"
                    required
                />
                <TextInput
                    label="Bill Ref"
                    name="bill_ref"
                    value={billRef}
                    onChange={setBillRef}
                    placeholder="Bill Ref"
                    required
                />
                <TextInput
                    label="Amount"
                    name="amount"
                    value={amount}
                    onChange={setAmount}
                    placeholder="Amount"
                    type="number"
                    required
                />
                <SelectInput
                    label="Payment Method"
                    name="payment_method"
                    value={paymentMethod}
                    options={paymentMethodOptions}
                    onChange={setPaymentMethod}
                    emptyOptionLabel="Select Payment Method"
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

            <TextInput
                label="Note"
                name="note"
                value={note}
                onChange={setNote}
                placeholder="Note"
                textarea
                rows={3}
            />

            <div className="flex w-full flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Bill Document</label>
                <input
                    type="file"
                    onChange={(e) => setBillDocumentFile(e.target.files?.[0] || null)}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
                {initialData?.bill_document && !billDocumentFile && (
                    <a href={initialData.bill_document} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:text-blue-800">
                        View existing bill
                    </a>
                )}
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
                    onClick={() => router.push(`/${tenantSlug}/vendor-payments`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
