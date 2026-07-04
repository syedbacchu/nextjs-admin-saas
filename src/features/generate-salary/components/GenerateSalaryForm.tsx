'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Calendar, Users, FileText } from 'lucide-react'
import { DateInput } from '@/components/form/DateInput'
import { MonthPicker } from '@/components/form/MonthPicker'
import {processGenerateSalaryClient} from "@/features/generate-salary";
import {translateUiText} from "@/i18n/ui";
import {useI18n} from "@/components/providers/I18nProvider";

interface GenerateSalaryFormProps {
    tenantSlug: string
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
export default function GenerateSalaryForm({ tenantSlug }: GenerateSalaryFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { language } = useI18n()

    const today = new Date()
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

    const [generateDate, setGenerateDate] = useState(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    )
    const [salaryMonth, setSalaryMonth] = useState(currentMonth)

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!generateDate.trim()) {
            toast.error('Generate date is required')
            return
        }

        if (!salaryMonth.trim()) {
            toast.error(translateUiText('Salary Month is required', language))
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('generate_date', generateDate)
            formData.append('month', salaryMonth.trim())
            formData.append('status', '1')

            const res = await processGenerateSalaryClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Salary sheet generated successfully')
                router.push(`/${tenantSlug}/generate-salaries`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to generate salary sheet')
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
                    <h2 className="text-xl font-bold text-slate-900">Generate Salary Sheet</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Create a new salary sheet for the selected month. This will calculate earnings and deductions for all active employees.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <DateInput
                        label="Generate Date"
                        name="generate_date"
                        value={generateDate}
                        onChange={setGenerateDate}
                        required
                    />

                    <MonthPicker
                        label="Salary Month"
                        name="month"
                        value={salaryMonth}
                        onChange={setSalaryMonth}
                        required
                    />
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                        <Users className="h-4 w-4" />
                        What will be included:
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            <span>Basic Salary + House Rent + Medical + Conveyance + Allowance</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            <span>Bonuses (if added for this month)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            <span>Advance Salary deductions (if taken)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            <span>Loan deductions (if active loans exist)</span>
                        </li>
                    </ul>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                        <FileText className="h-4 w-4" />
                        Important Notes:
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-amber-800">
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600">⚠</span>
                            <span>Make sure attendance is marked for all employees before generating</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600">⚠</span>
                            <span>Add bonuses and advances before generating for accurate calculations</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600">⚠</span>
                            <span>You can regenerate if needed - it will recalculate everything</span>
                        </li>
                    </ul>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Calendar className="mr-2 inline h-4 w-4" />
                                Generate Salary Sheet
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push(`/${tenantSlug}/generate-salaries`)}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}
