'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, IndianRupee } from 'lucide-react'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'
import { DateInput } from '@/components/form/DateInput'
import ImagePickerField from '@/components/form/ImagePickerField'
import type { Office } from '@/features/offices'
import type { FileSystemItem } from '@/features/files'
import {SalarySheet} from "@/features/salary-expenses/salary-payment.types";
import {
    getPayableAmountClient,
    processSalaryPaymentClient
} from "@/features/salary-expenses/actions/salary-payment.client";

interface SalaryPaymentFormProps {
    tenantSlug: string
    salarySheet: SalarySheet
    offices: Office[]
    initialFiles: FileSystemItem[]
    onSuccess?: () => void
}

const PAYMENT_METHOD_OPTIONS = [
    { label: 'Cash', value: 'cash' },
    { label: 'Bank Transfer', value: 'bank' },
    { label: 'Check', value: 'check' },
    { label: 'Mobile Banking', value: 'mobile_banking' },
    { label: 'Other', value: 'other' },
]

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

function getTodayDateInputValue(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export default function SalaryPaymentForm({
    tenantSlug,
    salarySheet,
    offices,
    initialFiles,
    onSuccess,
}: SalaryPaymentFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [fetchingPayable, setFetchingPayable] = useState(true)
    const [maxPayment, setMaxPayment] = useState(0)
    const [previousPaid, setPreviousPaid] = useState(0)

    // Utility function to safely convert values to numbers
    const toSafeNumber = (value: any): number => {
        const num = typeof value === 'string' ? parseFloat(value) : Number(value)
        return isNaN(num) ? 0 : num
    }

    const officeOptions = offices.map((office) => ({
        label: office.branch_name,
        value: String(office.id),
    }))

    const [date, setDate] = useState(getTodayDateInputValue())
    const [officeId, setOfficeId] = useState('')
    const [paymentAmount, setPaymentAmount] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [transactionId, setTransactionId] = useState('')
    const [remarks, setRemarks] = useState('')
    const [attachment, setAttachment] = useState('')
    const [status, setStatus] = useState('1')

    useEffect(() => {
        fetchPayableDetails()
    }, [salarySheet.id])

    async function fetchPayableDetails() {
        setFetchingPayable(true)
        try {
            const res = await getPayableAmountClient(tenantSlug, salarySheet.id)
            if (res.success) {
                setMaxPayment(res.data.due_amount)
                setPreviousPaid(res.data.total_paid)
                if (res.data.due_amount > 0) {
                    setPaymentAmount(String(res.data.due_amount))
                }
            } else {
                toast.error(res.message || 'Failed to fetch payable details')
            }
        } catch (error) {
            console.error('Error fetching payable details:', error)
            toast.error('Server error')
        } finally {
            setFetchingPayable(false)
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!date.trim()) {
            toast.error('Date is required')
            return
        }

        if (!officeId.trim()) {
            toast.error('Office is required')
            return
        }

        if (!paymentAmount.trim()) {
            toast.error('Payment amount is required')
            return
        }

        const amount = parseFloat(paymentAmount)
        if (isNaN(amount) || amount <= 0) {
            toast.error('Payment amount must be greater than zero')
            return
        }

        if (amount > maxPayment) {
            toast.error(`Payment amount cannot exceed due amount (₹${maxPayment.toFixed(2)})`)
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('salary_sheet_id', String(salarySheet.id))
            formData.append('payment_amount', paymentAmount)
            formData.append('payment_date', date.trim())
            formData.append('office_id', officeId)
            formData.append('payment_method', paymentMethod)
            if (transactionId.trim()) formData.append('transaction_id', transactionId.trim())
            if (remarks.trim()) formData.append('remarks', remarks.trim())
            if (attachment.trim()) formData.append('attachment', attachment.trim())
            formData.append('status', status)

            const res = await processSalaryPaymentClient(tenantSlug, {
                salary_sheet_id: salarySheet.id,
                payment_amount: amount,
                payment_date: date.trim(),
                office_id: Number(officeId),
                payment_method: paymentMethod,
                transaction_id: transactionId.trim() || undefined,
                remarks: remarks.trim() || undefined,
                attachment: attachment.trim() || undefined,
                status: Number(status),
            })

            if (res.success) {
                toast.success(res.message || 'Salary payment processed successfully')
                if (onSuccess) {
                    onSuccess()
                } else {
                    router.push(`/${tenantSlug}/generate-salaries`)
                    router.refresh()
                }
            } else {
                toast.error(res.message || 'Failed to process payment')
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    if (fetchingPayable) {
        return (
            <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />
                    <p className="mt-2 text-sm text-slate-600">Loading payment details...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Process Salary Payment</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        {salarySheet.employee?.name} - {salarySheet.employee?.designation}
                    </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-slate-600">Total Payable</p>
                            <p className="mt-1 text-lg font-bold text-slate-900">
                                BDT {' '}
                                {toSafeNumber(salarySheet.net_payable).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">Already Paid</p>
                            <p className="mt-1 text-lg font-bold text-green-600">
                                BDT {' '}
                                {previousPaid.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">Due Amount</p>
                            <p className="mt-1 text-lg font-bold text-red-600">
                                BDT {' '}
                                {maxPayment.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <DateInput label="Payment Date" name="date" value={date} onChange={setDate} required />

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
                        label="Payment Amount"
                        name="payment_amount"
                        value={paymentAmount}
                        onChange={setPaymentAmount}
                        placeholder={`Max: ${maxPayment.toFixed(2)}`}
                        type="number"
                        required
                    />

                    <SelectInput
                        label="Payment Method"
                        name="payment_method"
                        value={paymentMethod}
                        options={PAYMENT_METHOD_OPTIONS}
                        onChange={setPaymentMethod}
                        includeEmptyOption={false}
                        required
                    />

                    <TextInput
                        label="Transaction ID"
                        name="transaction_id"
                        value={transactionId}
                        onChange={setTransactionId}
                        placeholder="Transaction ID (optional)"
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

                <TextInput
                    label="Remarks"
                    name="remarks"
                    value={remarks}
                    onChange={setRemarks}
                    placeholder="Payment remarks"
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

                {maxPayment <= 0 && (
                    <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
                        <p className="text-sm font-medium">Note: Salary is already fully paid.</p>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={loading || maxPayment <= 0}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                    >
                        {loading ? 'Processing...' : 'Process Payment'}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}
