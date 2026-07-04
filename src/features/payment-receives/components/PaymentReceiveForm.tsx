'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DateInput } from '@/components/form/DateInput'
import SelectInput from '@/components/form/SelectInput'
import TextInput from '@/components/form/TextInput'
import {
    createPaymentReceiveClient,
    updatePaymentReceiveClient,
    PaymentReceive
} from '@/features/payment-receives'
import type { Customer } from '@/features/customers'
import type { Office } from '@/features/offices'

interface PaymentReceiveFormProps {
    tenantSlug: string
    customers: Customer[]
    offices: Office[]
    initialData?: Partial<PaymentReceive>
    paymentReceiveId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

const BASE_CASH_TYPE_OPTIONS = [
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

export default function PaymentReceiveForm({
    tenantSlug,
    customers,
    offices,
    initialData,
    paymentReceiveId,
    submitLabel = 'Save Payment Receive',
}: PaymentReceiveFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const customerOptions = customers.map((customer) => ({
        label: `${customer.name}${customer.creation_type === 2 ? ' (Walk In Customer)' : customer.mobile ? ` (${customer.mobile})` : ''}`,
        value: String(customer.id),
    }))
    const officeOptions = offices.map((office) => ({
        label: office.branch_name,
        value: String(office.id),
    }))

    const initialCashType = toStringValue(initialData?.cash_type)
    const cashTypeOptions = BASE_CASH_TYPE_OPTIONS.some((item) => item.value === initialCashType)
        ? BASE_CASH_TYPE_OPTIONS
        : initialCashType
            ? [...BASE_CASH_TYPE_OPTIONS, { label: initialCashType, value: initialCashType }]
            : BASE_CASH_TYPE_OPTIONS

    const [date, setDate] = useState(toDateInputValue(initialData?.date))
    const [customerId, setCustomerId] = useState(toStringValue(initialData?.customer_id ?? initialData?.customer?.id))
    const [officeId, setOfficeId] = useState(toStringValue(initialData?.office_id ?? initialData?.office?.id))
    const [billRef, setBillRef] = useState(toStringValue(initialData?.bill_ref))
    const [amount, setAmount] = useState(toStringValue(initialData?.amount))
    const [cashType, setCashType] = useState(initialCashType)
    const [note, setNote] = useState(toStringValue(initialData?.note))
    const [createdBy, setCreatedBy] = useState(toStringValue(initialData?.created_by))
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')
    const [billDocumentFile, setBillDocumentFile] = useState<File | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!date.trim()) {
            toast.error('Date is required')
            return
        }
        if (!customerId.trim()) {
            toast.error('Customer is required')
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
        if (!cashType.trim()) {
            toast.error('Cash type is required')
            return
        }
        if (!createdBy.trim()) {
            toast.error('Created by is required')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('date', date.trim())
            formData.append('customer_id', customerId)
            formData.append('office_id', officeId)
            formData.append('bill_ref', billRef.trim())
            formData.append('amount', amount.trim())
            formData.append('cash_type', cashType.trim())
            formData.append('note', note.trim())
            formData.append('created_by', createdBy.trim())
            formData.append('status', status)

            if (billDocumentFile) {
                formData.append('bill_document', billDocumentFile)
            }

            const res = paymentReceiveId
                ? await updatePaymentReceiveClient(tenantSlug, paymentReceiveId, formData)
                : await createPaymentReceiveClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Payment receive saved successfully')
                router.push(`/${tenantSlug}/payment-receives`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save payment receive')
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
                <p className="mt-1 text-sm text-slate-600">Fill in payment receive details and save.</p>
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
                    label="Customer"
                    name="customer_id"
                    value={customerId}
                    options={customerOptions}
                    onChange={setCustomerId}
                    emptyOptionLabel="Select Customer"
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
                    label="Cash Type"
                    name="cash_type"
                    value={cashType}
                    options={cashTypeOptions}
                    onChange={setCashType}
                    emptyOptionLabel="Select Cash Type"
                    required
                />
                <TextInput
                    label="Created By"
                    name="created_by"
                    value={createdBy}
                    onChange={setCreatedBy}
                    placeholder="Created By"
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
                    onClick={() => router.push(`/${tenantSlug}/payment-receives`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
