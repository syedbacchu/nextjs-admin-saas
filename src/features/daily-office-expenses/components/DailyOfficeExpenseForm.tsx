'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'
import { DateInput } from '@/components/form/DateInput'
import ImagePickerField from '@/components/form/ImagePickerField'
import {
    createDailyOfficeExpenseClient,
    updateDailyOfficeExpenseClient,
    type DailyOfficeExpense,
} from '..'
import type { Office } from '@/features/offices'
import type { FileSystemItem } from '@/features/files'

interface DailyOfficeExpenseFormProps {
    tenantSlug: string
    offices: Office[]
    initialFiles: FileSystemItem[]
    initialData?: Partial<DailyOfficeExpense>
    expenseId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

const OTHER_CATEGORY_VALUE = '__other__'

const CATEGORY_OPTIONS = [
    { label: 'Utility', value: 'utility' },
    { label: 'Rent', value: 'rent' },
    { label: 'Fuel', value: 'fuel' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Internet', value: 'internet' },
    { label: 'Stationery', value: 'stationery' },
    { label: 'Other', value: OTHER_CATEGORY_VALUE },
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

function getTodayDateInputValue(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export default function DailyOfficeExpenseForm({
    tenantSlug,
    offices,
    initialFiles,
    initialData,
    expenseId,
    submitLabel = 'Save Daily Office Expense',
}: DailyOfficeExpenseFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const officeOptions = offices.map((office) => ({
        label: office.branch_name,
        value: String(office.id),
    }))

    const initialDate = toDateInputValue(initialData?.date)
    const isEditMode = typeof expenseId !== 'undefined' && expenseId !== null && String(expenseId).trim() !== ''
    const initialCategoryRaw = initialData?.category || ''
    const isInitialCategoryKnown = CATEGORY_OPTIONS.some((option) => option.value === initialCategoryRaw)

    const [date, setDate] = useState(initialDate || (isEditMode ? '' : getTodayDateInputValue()))
    const [paidTo, setPaidTo] = useState(initialData?.paid_to || '')
    const [category, setCategory] = useState(
        initialCategoryRaw
            ? (isInitialCategoryKnown ? initialCategoryRaw : OTHER_CATEGORY_VALUE)
            : '',
    )
    const [otherCategory, setOtherCategory] = useState(
        initialCategoryRaw && !isInitialCategoryKnown ? initialCategoryRaw : '',
    )
    const [officeId, setOfficeId] = useState(
        typeof initialData?.office_id === 'number' || typeof initialData?.office_id === 'string'
            ? String(initialData.office_id)
            : typeof initialData?.office?.id === 'number'
                ? String(initialData.office.id)
                : '',
    )
    const [amount, setAmount] = useState(
        initialData?.amount === null || typeof initialData?.amount === 'undefined'
            ? ''
            : String(initialData.amount),
    )
    const [remarks, setRemarks] = useState(initialData?.remarks || '')
    const [attachment, setAttachment] = useState(initialData?.attachment || '')
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!date.trim()) {
            toast.error('Date is required')
            return
        }

        if (!paidTo.trim()) {
            toast.error('Paid to is required')
            return
        }

        if (!category.trim()) {
            toast.error('Category is required')
            return
        }

        if (category === OTHER_CATEGORY_VALUE && !otherCategory.trim()) {
            toast.error('Please write category name')
            return
        }

        if (!officeId.trim()) {
            toast.error('Office is required')
            return
        }

        if (!amount.trim()) {
            toast.error('Amount is required')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('date', date.trim())
            formData.append('paid_to', paidTo.trim())
            formData.append('category', category === OTHER_CATEGORY_VALUE ? otherCategory.trim() : category.trim())
            formData.append('office_id', officeId)
            formData.append('amount', amount.trim())
            formData.append('remarks', remarks.trim())
            if (attachment.trim()) formData.append('attachment', attachment.trim())
            formData.append('status', status)

            const res = expenseId
                ? await updateDailyOfficeExpenseClient(tenantSlug, expenseId, formData)
                : await createDailyOfficeExpenseClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Daily office expense saved successfully')
                router.push(`/${tenantSlug}/daily-office-expenses`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save daily office expense')
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
                    <p className="mt-1 text-sm text-slate-600">Fill in office expense details and save.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <DateInput
                        label="Date"
                        name="date"
                        value={date}
                        onChange={setDate}
                        required
                    />
                    <TextInput
                        label="Paid To"
                        name="paid_to"
                        value={paidTo}
                        onChange={setPaidTo}
                        placeholder="Paid To"
                        required
                    />
                    <SelectInput
                        label="Category"
                        name="category"
                        value={category}
                        options={CATEGORY_OPTIONS}
                        onChange={setCategory}
                        emptyOptionLabel="Select Category"
                        required
                    />
                    {category === OTHER_CATEGORY_VALUE && (
                        <TextInput
                            label="Other Category"
                            name="other_category"
                            value={otherCategory}
                            onChange={setOtherCategory}
                            placeholder="Write category name"
                            required
                        />
                    )}
                    <SelectInput
                        label="Office"
                        name="office_id"
                        value={officeId}
                        options={officeOptions}
                        onChange={setOfficeId}
                        emptyOptionLabel="Select Office"
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
                    label="Remarks"
                    name="remarks"
                    value={remarks}
                    onChange={setRemarks}
                    placeholder="Remarks"
                    textarea
                    rows={3}
                />

                <ImagePickerField
                    tenantSlug={tenantSlug}
                    label="Attachment"
                    value={attachment}
                    onChange={setAttachment}
                    initialFiles={initialFiles}
                    previewAlt="Attachment preview"
                    triggerLabel="Choose Attachment"
                    modalDescription="Select an attachment or upload new files."
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
                        onClick={() => router.push(`/${tenantSlug}/daily-office-expenses`)}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}
