'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'
import SearchableSelect from '@/components/form/SearchableSelect'
import { DateInput } from '@/components/form/DateInput'
import { MonthPicker } from '@/components/form/MonthPicker'
import {
    createBonusClient,
    updateBonusClient,
    Bonus,
} from '@/features/bonuses'
import type { Employee } from '@/features/employees'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'
import { useEmployeeSearchOptions } from '@/features/employees'

interface BonusFormProps {
    tenantSlug: string
    employees: Employee[]
    initialData?: Partial<Bonus>
    bonusId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Due', value: 'due' },
    { label: 'Paid', value: 'paid' },
]

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

export default function BonusForm({
    tenantSlug,
    employees,
    initialData,
    bonusId,
    submitLabel = 'Save Bonus',
}: BonusFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { language } = useI18n()
    const resolvedSubmitLabel = translateUiText(submitLabel, language)

    const [date, setDate] = useState(toDateInputValue(initialData?.date))
    const [employeeId, setEmployeeId] = useState(
        initialData?.employee_id ? String(initialData.employee_id) : '',
    )
    const [bonusAmount, setBonusAmount] = useState(
        initialData?.bonus_amount === null || typeof initialData?.bonus_amount === 'undefined'
            ? ''
            : String(initialData.bonus_amount),
    )
    const [salaryMonth, setSalaryMonth] = useState(toMonthInputValue(initialData?.salary_month))
    // const [status, setStatus] = useState(() => {
    //     const initialStatus = String(initialData?.status || '').trim().toLowerCase()
    //     if (initialStatus === 'paid' || initialStatus === 'due') {
    //         return initialStatus
    //     }
    //
    //     return 'due'
    // })
    const { employeeOptions, handleEmployeeSearch } = useEmployeeSearchOptions(
        tenantSlug,
        employees,
        employeeId,
    )

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!date.trim()) {
            toast.error('Date is required')
            return
        }

        if (!employeeId) {
            toast.error('Employee is required')
            return
        }

        if (!bonusAmount.trim()) {
            toast.error('Bonus Amount is required')
            return
        }

        if (!salaryMonth.trim()) {
            toast.error('Salary Month is required')
            return
        }
        //
        // if (!status.trim()) {
        //     toast.error('Status is required')
        //     return
        // }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('date', date.trim())
            formData.append('employee_id', employeeId)
            formData.append('bonus_amount', bonusAmount.trim())
            formData.append('salary_month', salaryMonth.trim())
            formData.append('status', 'paid')

            const res = bonusId
                ? await updateBonusClient(tenantSlug, bonusId, formData)
                : await createBonusClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Bonus saved successfully')
                router.push(`/${tenantSlug}/bonuses`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save bonus')
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
                <p className="mt-1 text-sm text-slate-600">Fill in bonus details and save.</p>
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
                    label="Bonus Amount"
                    name="bonus_amount"
                    value={bonusAmount}
                    onChange={setBonusAmount}
                    placeholder="E.g. 500.00"
                    type="number"
                    required
                />

                {/*<SelectInput*/}
                {/*    label="Status"*/}
                {/*    name="status"*/}
                {/*    value={status}*/}
                {/*    options={STATUS_OPTIONS}*/}
                {/*    onChange={setStatus}*/}
                {/*    includeEmptyOption={false}*/}
                {/*/>*/}
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
                    onClick={() => router.push(`/${tenantSlug}/bonuses`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
