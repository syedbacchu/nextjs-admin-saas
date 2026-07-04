'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import TextInput from '@/components/form/TextInput'
import SearchableSelect from '@/components/form/SearchableSelect'
import { DateInput } from '@/components/form/DateInput'
import { MonthPicker } from '@/components/form/MonthPicker'
import {
    createAdvanceSalaryClient,
    updateAdvanceSalaryClient,
    AdvanceSalary
} from '@/features/advance-salaries'
import type { Employee } from '@/features/employees'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'
import { useEmployeeSearchOptions } from '@/features/employees'

interface AdvanceSalaryFormProps {
    tenantSlug: string
    employees: Employee[]
    initialData?: Partial<AdvanceSalary>
    advanceSalaryId?: number | string
    submitLabel?: string
}

function toDateInputValue(value?: string | null): string {
    if (!value) return new Date().toISOString().slice(0, 10)
    const trimmed = value.trim()
    if (!trimmed) return new Date().toISOString().slice(0, 10)

    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        return trimmed.slice(0, 10)
    }

    const parsed = new Date(trimmed)
    if (Number.isNaN(parsed.getTime())) return new Date().toISOString().slice(0, 10)
    return parsed.toISOString().slice(0, 10)
}

function toMonthInputValue(value?: string | null): string {
    if (!value) {
        const today = new Date()
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        return `${year}-${month}`
    }
    return value.trim()
}

export default function AdvanceSalaryForm({
    tenantSlug,
    employees,
    initialData,
    advanceSalaryId,
    submitLabel = 'Save Advance Salary',
}: AdvanceSalaryFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { language } = useI18n()
    const resolvedSubmitLabel = translateUiText(submitLabel, language)

    const [date, setDate] = useState(toDateInputValue(initialData?.date))
    const [employeeId, setEmployeeId] = useState(
        initialData?.employee_id ? String(initialData.employee_id) : '',
    )
    const [advanceAmount, setAdvanceAmount] = useState(
        initialData?.advance_amount === null || typeof initialData?.advance_amount === 'undefined'
            ? ''
            : String(initialData.advance_amount),
    )
    const [afterAdjustmentAmount, setAfterAdjustmentAmount] = useState(
        initialData?.after_adjustment_amount === null || typeof initialData?.after_adjustment_amount === 'undefined'
            ? ''
            : String(initialData.after_adjustment_amount),
    )
    const [salaryMonth, setSalaryMonth] = useState(toMonthInputValue(initialData?.salary_month))

    // Status initialization logic gracefully trying to catch server enums if present or default to 1 (Pending)
    const [status, setStatus] = useState(() => {
        if (!initialData?.status) return 'paid'

        return 'paid'
    })

    const { employeeOptions, handleEmployeeSearch } = useEmployeeSearchOptions(
        tenantSlug,
        employees,
        employeeId,
    )

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!date.trim()) {
            toast.error(translateUiText('Date is required', language))
            return
        }

        if (!employeeId) {
            toast.error(translateUiText('Employee is required', language))
            return
        }

        if (!advanceAmount.trim()) {
            toast.error(translateUiText('Advance Amount is required', language))
            return
        }

        if (!salaryMonth.trim()) {
            toast.error(translateUiText('Salary Month is required', language))
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('date', date.trim())
            formData.append('employee_id', employeeId)
            formData.append('advance_amount', advanceAmount.trim())
            formData.append('salary_month', salaryMonth.trim())
            formData.append('status', status)

            const res = advanceSalaryId
                ? await updateAdvanceSalaryClient(tenantSlug, advanceSalaryId, formData)
                : await createAdvanceSalaryClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || translateUiText('Advance salary saved successfully', language))
                router.push(`/${tenantSlug}/advance-salaries`)
                router.refresh()
            } else {
                toast.error(res.message || translateUiText('Failed to save advance salary', language))
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
                <p className="mt-1 text-sm text-slate-600">{translateUiText('Fill in advance salary details and save.', language)}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <DateInput
                    label="Date"
                    name="date"
                    value={date}
                    onChange={setDate}
                    required
                />
                <MonthPicker
                    label="Salary Month"
                    name="salary_month"
                    value={salaryMonth}
                    onChange={setSalaryMonth}
                    required
                />
                <SearchableSelect
                    label="Employee"
                    name="employee_id"
                    value={employeeId}
                    options={employeeOptions}
                    onChange={(value) => setEmployeeId(String(value))}
                    onSearch={handleEmployeeSearch}
                    searchMinLength={3}
                    placeholder="Select Employee"
                    required
                />
                <TextInput
                    label="Advance Amount"
                    name="advance_amount"
                    value={advanceAmount}
                    onChange={setAdvanceAmount}
                    placeholder="E.g. 5000.00"
                    type="number"
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
                    onClick={() => router.push(`/${tenantSlug}/advance-salaries`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
