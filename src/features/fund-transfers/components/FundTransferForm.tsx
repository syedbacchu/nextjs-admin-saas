'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DateInput } from '@/components/form/DateInput'
import SelectInput from '@/components/form/SelectInput'
import TextInput from '@/components/form/TextInput'
import {
    createFundTransferClient,
    updateFundTransferClient,
    FundTransfer
} from '@/features/fund-transfers'
import type { Office } from '@/features/offices'

interface FundTransferFormProps {
    tenantSlug: string
    offices: Office[]
    initialData?: Partial<FundTransfer>
    fundTransferId?: number | string
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

export default function FundTransferForm({
    tenantSlug,
    offices,
    initialData,
    fundTransferId,
    submitLabel = 'Save Fund Transfer',
}: FundTransferFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

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
    const [officeId, setOfficeId] = useState(toStringValue(initialData?.office_id ?? initialData?.office?.id))
    const [personName, setPersonName] = useState(toStringValue(initialData?.person_name))
    const [cashType, setCashType] = useState(initialCashType)
    const [amount, setAmount] = useState(toStringValue(initialData?.amount))
    const [bankName, setBankName] = useState(toStringValue(initialData?.bank_name))
    const [purpose, setPurpose] = useState(toStringValue(initialData?.purpose))
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')

    const isBankTransfer = cashType === 'bank'

    function handleCashTypeChange(nextCashType: string) {
        setCashType(nextCashType)
        if (nextCashType !== 'bank') {
            setBankName('')
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!date.trim()) {
            toast.error('Date is required')
            return
        }
        if (!officeId.trim()) {
            toast.error('Branch is required')
            return
        }
        if (!personName.trim()) {
            toast.error('Person name is required')
            return
        }
        if (!cashType.trim()) {
            toast.error('Cash type is required')
            return
        }
        if (!amount.trim()) {
            toast.error('Amount is required')
            return
        }
        if (isBankTransfer && !bankName.trim()) {
            toast.error('Bank name is required for bank transfer')
            return
        }
        if (!purpose.trim()) {
            toast.error('Purpose is required')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('date', date.trim())
            formData.append('office_id', officeId)
            formData.append('person_name', personName.trim())
            formData.append('cash_type', cashType.trim())
            formData.append('amount', amount.trim())
            formData.append('bank_name', bankName.trim())
            formData.append('purpose', purpose.trim())
            formData.append('status', status)

            const res = fundTransferId
                ? await updateFundTransferClient(tenantSlug, fundTransferId, formData)
                : await createFundTransferClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Fund transfer saved successfully')
                router.push(`/${tenantSlug}/fund-transfers`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save fund transfer')
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
                <p className="mt-1 text-sm text-slate-600">Fill in fund transfer details and save.</p>
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
                    label="Branch"
                    name="office_id"
                    value={officeId}
                    options={officeOptions}
                    onChange={setOfficeId}
                    emptyOptionLabel="Select Branch"
                    required
                />
                <TextInput
                    label="Person Name"
                    name="person_name"
                    value={personName}
                    onChange={setPersonName}
                    placeholder="Person Name"
                    required
                />
                <SelectInput
                    label="Cash Type"
                    name="cash_type"
                    value={cashType}
                    options={cashTypeOptions}
                    onChange={handleCashTypeChange}
                    emptyOptionLabel="Select Cash Type"
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
                {isBankTransfer && (
                    <TextInput
                        label="Bank Name"
                        name="bank_name"
                        value={bankName}
                        onChange={setBankName}
                        placeholder="Bank Name"
                        required
                    />
                )}
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
                label="Purpose"
                name="purpose"
                value={purpose}
                onChange={setPurpose}
                placeholder="Purpose"
                textarea
                rows={3}
                required
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
                    onClick={() => router.push(`/${tenantSlug}/fund-transfers`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
