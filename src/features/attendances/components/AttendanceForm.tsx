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
    createAttendanceClient,
    updateAttendanceClient,
    type Attendance,
} from '@/features/attendances'
import type { Employee } from '@/features/employees'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'
import { useEmployeeSearchOptions } from '@/features/employees'

interface AttendanceFormProps {
    tenantSlug: string
    employees: Employee[]
    initialData?: Partial<Attendance>
    attendanceId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
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

export default function AttendanceForm({
    tenantSlug,
    employees,
    initialData,
    attendanceId,
    submitLabel = 'Save Attendance',
}: AttendanceFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { language } = useI18n()
    const resolvedSubmitLabel = translateUiText(submitLabel, language)

    const [date, setDate] = useState(toDateInputValue(initialData?.date))
    const [employeeId, setEmployeeId] = useState(
        initialData?.employee_id ? String(initialData.employee_id) : '',
    )
    const [workingDay, setWorkingDay] = useState(
        initialData?.working_day === null || typeof initialData?.working_day === 'undefined'
            ? ''
            : String(initialData.working_day),
    )
    const [month, setMonth] = useState(toMonthInputValue(initialData?.month))
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')
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

        if (!workingDay.trim()) {
            toast.error(translateUiText('Working day is required', language))
            return
        }

        if (!month.trim()) {
            toast.error(translateUiText('Month is required', language))
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('date', date.trim())
            formData.append('employee_id', employeeId)
            formData.append('working_day', workingDay.trim())
            formData.append('month', month.trim())
            formData.append('status', '1')

            const res = attendanceId
                ? await updateAttendanceClient(tenantSlug, attendanceId, formData)
                : await createAttendanceClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || translateUiText('Attendance saved successfully', language))
                router.push(`/${tenantSlug}/attendances`)
                router.refresh()
            } else {
                toast.error(res.message || translateUiText('Failed to save attendance', language))
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
                <p className="mt-1 text-sm text-slate-600">{translateUiText('Fill in attendance details and save.', language)}</p>
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
                    label="Month"
                    name="month"
                    value={month}
                    onChange={setMonth}
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
                    label="Working Day"
                    name="working_day"
                    value={workingDay}
                    onChange={setWorkingDay}
                    placeholder="Working Day e.g. 10"
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
                    onClick={() => router.push(`/${tenantSlug}/attendances`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
