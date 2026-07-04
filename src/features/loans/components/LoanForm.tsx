'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'
import SearchableSelect from '@/components/form/SearchableSelect'
import { DateInput } from '@/components/form/DateInput'
import {Employee, useEmployeeSearchOptions} from "@/features/employees";
import {createLoanClient, Loan, updateLoanClient} from "@/features/loans";

interface LoanFormProps {
    tenantSlug: string
    employees: Employee[]
    initialData?: Partial<Loan>
    loanId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
]

function toDateInputValue(value?: string | null): string {
    if (!value) return new Date().toISOString().slice(0, 10)
    const trimmed = value.trim()
    if (!trimmed) return new Date().toISOString().slice(0, 10)
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10)
    const parsed = new Date(trimmed)
    if (Number.isNaN(parsed.getTime())) return new Date().toISOString().slice(0, 10)
    return parsed.toISOString().slice(0, 10)
}

function formatDisplay(date: string): string {
    if (!date) return ''
    const [y, m, d] = date.split('-')
    return `${d}-${m}-${y}`
}

function toNumber(value?: string | number | null): number {
    if (value === null || value === undefined || value === '') return 0
    const n = typeof value === 'number' ? value : Number(value)
    return Number.isNaN(n) ? 0 : n
}

export default function LoanForm({
    tenantSlug,
    employees,
    initialData,
    loanId,
    submitLabel = 'Submit',
}: LoanFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const isEdit = Boolean(loanId)

    const [loanDate, setLoanDate] = useState(toDateInputValue(initialData?.loan_date))
    const [employeeId, setEmployeeId] = useState(
        initialData?.employee_id ? String(initialData.employee_id) : '',
    )
    const [loanAmount, setLoanAmount] = useState(
        initialData?.loan_amount === null || typeof initialData?.loan_amount === 'undefined'
            ? ''
            : String(initialData.loan_amount),
    )
    const [monthlyDeduction, setMonthlyDeduction] = useState(
        initialData?.monthly_deduction === null || typeof initialData?.monthly_deduction === 'undefined'
            ? ''
            : String(initialData.monthly_deduction),
    )
    // Pay Deduction: UI-only field (edit mode only). Initially 0.
    const [payDeduction, setPayDeduction] = useState('0')

    // After Adjustment Amount:
    // - Add mode: user edits it directly
    // - Edit mode: auto-calculated = loan_amount - payDeduction
    const [afterAdjustmentAmount, setAfterAdjustmentAmount] = useState(
        initialData?.after_adjustment_amount === null || typeof initialData?.after_adjustment_amount === 'undefined'
            ? ''
            : String(initialData.after_adjustment_amount),
    )

    const [status, setStatus] = useState(() => {
        if (!initialData?.status) return 'pending'
        const s = String(initialData.status).toLowerCase()
        if (s === 'completed' || s === 'complete' || s === 'done') return 'completed'
        return 'pending'
    })

    const { employeeOptions, handleEmployeeSearch } = useEmployeeSearchOptions(
        tenantSlug,
        employees,
        employeeId,
    )

    // In edit mode, auto-calculate after_adjustment_amount
    const computedAfterAdjustment = isEdit
        ? Math.max(0, toNumber(loanAmount) - toNumber(payDeduction))
        : toNumber(afterAdjustmentAmount)

    function handlePayDeductionChange(val: string) {
        setPayDeduction(val)
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!loanDate.trim()) { toast.error('Loan Date is required'); return }
        if (!employeeId) { toast.error('Employee is required'); return }
        if (!loanAmount.trim()) { toast.error('Loan Amount is required'); return }
        if (!monthlyDeduction.trim()) { toast.error('Monthly Deduction is required'); return }
       

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('loan_date', loanDate.trim())
            formData.append('employee_id', employeeId)
            formData.append('loan_amount', loanAmount.trim())
            formData.append('monthly_deduction', monthlyDeduction.trim())
            
            formData.append('status', 'pending')

            const res = loanId
                ? await updateLoanClient(tenantSlug, loanId, formData)
                : await createLoanClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Loan saved successfully')
                router.push(`/${tenantSlug}/loans`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save loan')
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
                <p className="mt-1 text-sm text-slate-600">
                    {isEdit ? 'Update loan deduction details.' : 'Fill in loan details and save.'}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Loan Date */}
                
                <DateInput
                    label="Loan Date"
                    name="loan_date"
                    value={loanDate}
                    onChange={setLoanDate}
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

                {/* Loan Amount */}
                
                <TextInput
                    label="Loan Amount"
                    name="loan_amount"
                    value={loanAmount}
                    onChange={setLoanAmount}
                    placeholder="E.g. 10000"
                    type="number"
                    required
                />
               
                {/* Monthly Deduction */}
                
                <TextInput
                    label="Monthly Deduction"
                    name="monthly_deduction"
                    value={monthlyDeduction}
                    onChange={setMonthlyDeduction}
                    placeholder="E.g. 300"
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
                {/*    required*/}
                {/*/>*/}
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
                    onClick={() => router.push(`/${tenantSlug}/loans`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
