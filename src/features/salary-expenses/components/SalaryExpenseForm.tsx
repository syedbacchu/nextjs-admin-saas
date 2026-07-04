'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'
import SearchableSelect from '@/components/form/SearchableSelect'
import { DateInput } from '@/components/form/DateInput'
import ImagePickerField from '@/components/form/ImagePickerField'
import {
    createSalaryExpenseClient,
    updateSalaryExpenseClient,
    calculatePayableAmountClient,
    SalaryExpense, PayableAmountCalculation
} from '@/features/salary-expenses'
import {Employee, useEmployeeSearchOptions} from '@/features/employees'
import type { Office } from '@/features/offices'
import type { FileSystemItem } from '@/features/files'
import { MonthPicker } from "@/components/form/MonthPicker"
import type { EmployeeLoanInfo } from '@/features/loans'
import {getEmployeeLoanHistoryClient} from "@/features/loans/actions/loan-history.client";

interface SalaryExpenseFormProps {
    tenantSlug: string
    employees: Employee[]
    offices: Office[]
    initialFiles: FileSystemItem[]
    initialData?: Partial<SalaryExpense>
    expenseId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

const OTHER_CATEGORY_VALUE = '__other__'

const CATEGORY_OPTIONS = [
    { label: 'Salary', value: 'salary' },
    // { label: 'Bonus', value: 'bonus' },
    // { label: 'Advance', value: 'advance' },
    // { label: 'Allowance', value: 'allowance' },
    // { label: 'Other', value: OTHER_CATEGORY_VALUE },
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

export default function SalaryExpenseForm({
    tenantSlug,
    employees,
    offices,
    initialFiles,
    initialData,
    expenseId,
    submitLabel = 'Save Monthly Salary',
}: SalaryExpenseFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const officeOptions = offices.map((office) => ({
        label: office.branch_name,
        value: String(office.id),
    }))

    const initialDate = toDateInputValue(initialData?.date)
    const initialSalaryMonth = initialData?.salary_month || ''
    const isEditMode = typeof expenseId !== 'undefined' && expenseId !== null && String(expenseId).trim() !== ''
    const initialCategoryRaw = initialData?.category || ''
    const isInitialCategoryKnown = CATEGORY_OPTIONS.some((option) => option.value === initialCategoryRaw)

    const [date, setDate] = useState(initialDate || (isEditMode ? '' : getTodayDateInputValue()))
    const [salaryMonth, setSalaryMonth] = useState(initialSalaryMonth)
    const [paidToUserId, setPaidToUserId] = useState(
        typeof initialData?.paid_to_user_id === 'number' || typeof initialData?.paid_to_user_id === 'string'
            ? String(initialData.paid_to_user_id)
            : typeof initialData?.paid_to_user?.id === 'number'
                ? String(initialData.paid_to_user.id)
                : '',
    )
    const [category, setCategory] = useState(
        initialCategoryRaw
            ? (isInitialCategoryKnown ? initialCategoryRaw : OTHER_CATEGORY_VALUE)
            : 'salary',
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

    // Payable amount calculation state
    const [calculatedAmount, setCalculatedAmount] = useState<PayableAmountCalculation | null>(null)
    const [calculating, setCalculating] = useState(false)
    const [showCalculation, setShowCalculation] = useState(false)
    const [amountWarning, setAmountWarning] = useState<string>('')

    // Employee loan history state
    const [employeeLoans, setEmployeeLoans] = useState<EmployeeLoanInfo[]>([])
    const [loadingLoans, setLoadingLoans] = useState(false)
    const { employeeOptions, handleEmployeeSearch } = useEmployeeSearchOptions(
        tenantSlug,
        employees,
        paidToUserId,
    )

    // Calculate payable amount when employee and month are selected
    useEffect(() => {
        async function fetchCalculatedAmount() {
            if (!paidToUserId.trim() || !salaryMonth.trim()) {
                setCalculatedAmount(null)
                setShowCalculation(false)
                setAmountWarning('')
                return
            }

            setCalculating(true)
            try {
                const res = await calculatePayableAmountClient(tenantSlug, paidToUserId, salaryMonth)
                if (res.success && res.data) {
                    setCalculatedAmount(res.data)
                    // Auto-fill the amount field with remaining value if not already set
                    if (!amount && !isEditMode) {
                        setAmount(res.data.remaining_amount)
                    }
                    setShowCalculation(true)
                    // Validate amount when calculation completes
                    if (amount) {
                        validateAmountAgainstRemaining(parseFloat(amount), parseFloat(res.data.remaining_amount))
                    }
                } else {
                    setCalculatedAmount(null)
                    setShowCalculation(false)
                }
            } catch (error) {
                console.error('Failed to calculate payable amount:', error)
                setCalculatedAmount(null)
                setShowCalculation(false)
            } finally {
                setCalculating(false)
            }
        }

        fetchCalculatedAmount()
    }, [paidToUserId, salaryMonth, tenantSlug])

    // Validate amount against remaining balance
    function validateAmountAgainstRemaining(inputAmount: number, remainingAmount: number): void {
        if (calculatedAmount && inputAmount > remainingAmount) {
            setAmountWarning(
                `Warning: Amount (${inputAmount}) exceeds remaining payable (${remainingAmount}). ` +
                `Already paid: ${calculatedAmount.already_paid}`
            )
        } else {
            setAmountWarning('')
        }
    }

    // Update amount field when calculation changes
    useEffect(() => {
        if (calculatedAmount && amount) {
            validateAmountAgainstRemaining(parseFloat(amount), parseFloat(calculatedAmount.remaining_amount))
        }
    }, [calculatedAmount])

    // Fetch employee loan history when employee is selected
    useEffect(() => {
        async function fetchEmployeeLoans() {
            if (!paidToUserId.trim()) {
                setEmployeeLoans([])
                return
            }

            setLoadingLoans(true)
            try {
                const res = await getEmployeeLoanHistoryClient(tenantSlug, paidToUserId)
                if (res.success && res.data) {
                    setEmployeeLoans(res.data)
                } else {
                    setEmployeeLoans([])
                }
            } catch (error) {
                console.error('Failed to fetch employee loans:', error)
                setEmployeeLoans([])
            } finally {
                setLoadingLoans(false)
            }
        }

        fetchEmployeeLoans()
    }, [paidToUserId, tenantSlug])

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!date.trim()) {
            toast.error('Date is required')
            return
        }

        if (!paidToUserId.trim()) {
            toast.error('Employee is required')
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

        // Check if amount exceeds remaining payable
        if (calculatedAmount && amountWarning) {
            const confirmed = window.confirm(
                'Warning: The amount exceeds the remaining payable balance. ' +
                'This may result in overpayment. Do you want to continue?'
            )
            if (!confirmed) {
                return
            }
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('date', date.trim())
            formData.append('salary_month', salaryMonth.trim())
            formData.append('paid_to_user_id', paidToUserId)
            formData.append('category', category === OTHER_CATEGORY_VALUE ? otherCategory.trim() : category.trim())
            formData.append('office_id', officeId)
            formData.append('amount', amount.trim())
            formData.append('remarks', remarks.trim())
            if (attachment.trim()) formData.append('attachment', attachment.trim())
            formData.append('status', '1')

            const res = expenseId
                ? await updateSalaryExpenseClient(tenantSlug, expenseId, formData)
                : await createSalaryExpenseClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Monthly salary saved successfully')
                router.push(`/${tenantSlug}/salary-expenses`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save monthly salary')
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
                    <p className="mt-1 text-sm text-slate-600">Fill in monthly salary details and save.</p>
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
                        label="Paid To (Employee)"
                        name="paid_to_user_id"
                        value={paidToUserId}
                        options={employeeOptions}
                        onChange={(value) => setPaidToUserId(String(value))}
                        onSearch={handleEmployeeSearch}
                        searchMinLength={3}
                        placeholder="Select Employee"
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

                    {/* Payable Amount Calculation Display */}
                    {showCalculation && calculatedAmount && (
                        <div className="col-span-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-blue-900">Salary Calculation Breakdown</h3>
                                {calculating && (
                                    <span className="text-xs text-blue-600">Calculating...</span>
                                )}
                            </div>
                            <div className="grid gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Gross Salary:</span>
                                    <span className="font-medium text-slate-900">{calculatedAmount.gross_salary}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Advance Deduction:</span>
                                    <span className="font-medium text-red-600">-{calculatedAmount.advance_deduction}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Loan Deduction:</span>
                                    <span className="font-medium text-red-600">-{calculatedAmount.loan_deduction}</span>
                                </div>
                                {(parseFloat(calculatedAmount.loan_total_monthly) > 0 || parseFloat(calculatedAmount.loan_paid_this_month) > 0) && (
                                    <div className="ml-4 flex justify-between text-xs text-slate-500">
                                        <span>Total monthly: {calculatedAmount.loan_total_monthly} | Already deducted: {calculatedAmount.loan_paid_this_month}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Previous Month Due:</span>
                                    <span className="font-medium text-green-600">+{calculatedAmount.previous_month_due}</span>
                                </div>
                                <div className="mt-2 flex justify-between border-t border-blue-200 pt-2">
                                    <span className="font-semibold text-blue-900">Total Deductions:</span>
                                    <span className="font-bold text-red-700">-{calculatedAmount.total_deductions}</span>
                                </div>
                                {calculatedAmount.trip_profit > 0 && (
                                    <div className="flex justify-between border-t border-blue-200 pt-2">
                                        <span className="font-semibold text-blue-900">Trip Profit:</span>
                                        <span className="font-bold text-green-700">+{calculatedAmount.trip_profit}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t border-blue-200 pt-2">
                                    <span className="font-semibold text-blue-900">Net Payable Amount:</span>
                                    <span className="text-lg font-bold text-blue-900">{calculatedAmount.payable_amount}</span>
                                </div>
                                <div className="flex justify-between border-t border-blue-200 pt-2">
                                    <span className="font-semibold text-slate-700">Already Paid:</span>
                                    <span className="font-bold text-amber-700">{calculatedAmount.already_paid}</span>
                                </div>
                                <div className="mt-2 flex justify-between rounded bg-blue-100 p-2">
                                    <span className="font-bold text-blue-900">Remaining Payable:</span>
                                    <span className="text-xl font-bold text-blue-900">{calculatedAmount.remaining_amount}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <TextInput
                        label="Amount"
                        name="amount"
                        value={amount}
                        onChange={(value) => {
                            setAmount(value)
                            if (calculatedAmount) {
                                validateAmountAgainstRemaining(parseFloat(value), parseFloat(calculatedAmount.remaining_amount))
                            }
                        }}
                        placeholder="Amount"
                        type="number"
                        required
                    />
                    {amountWarning && (
                        <div className="col-span-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm">
                            <div className="flex items-start gap-2">
                                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="text-amber-800">{amountWarning}</span>
                            </div>
                        </div>
                    )}

                    {/* Employee Loan Information */}
                    {employeeLoans.length > 0 && (
                        <div className="col-span-2 rounded-lg border border-purple-200 bg-purple-50 p-4">
                            <h3 className="mb-3 text-sm font-semibold text-purple-900">Active Loans & Deductions</h3>
                            <div className="space-y-3">
                                {employeeLoans.map((loan) => (
                                    <div key={loan.id} className="rounded border border-purple-200 bg-white p-3">
                                        <div className="mb-2 grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-slate-600">Loan Amount:</span>
                                                <span className="ml-2 font-medium text-slate-900">{loan.loan_amount}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-600">Monthly Deduction:</span>
                                                <span className="ml-2 font-medium text-slate-900">{loan.monthly_deduction}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-600">Paid:</span>
                                                <span className="ml-2 font-medium text-green-700">{loan.paid_amount}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-600">Remaining:</span>
                                                <span className="ml-2 font-bold text-red-700">{loan.remaining_balance}</span>
                                            </div>
                                        </div>
                                        {loan.recent_payments && loan.recent_payments.length > 0 && (
                                            <div className="mt-2 border-t border-slate-200 pt-2">
                                                <p className="mb-1 text-xs font-medium text-slate-600">Recent Payments:</p>
                                                <div className="space-y-1 text-xs">
                                                    {loan.recent_payments.map((payment, idx) => (
                                                        <div key={idx} className="flex justify-between text-slate-600">
                                                            <span>{payment.salary_month || payment.payment_date}</span>
                                                            <span className="font-medium">{payment.paid_amount} (Bal: {payment.remaining_balance_after})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
                        onClick={() => router.push(`/${tenantSlug}/salary-expenses`)}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}
