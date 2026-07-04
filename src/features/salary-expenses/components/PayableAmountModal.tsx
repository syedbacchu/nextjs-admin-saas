'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { X, Loader2, IndianRupee, AlertCircle } from 'lucide-react'
import { getPayableAmountClient } from '@/features/salary-expenses/actions/salary-payment.client'
import type { PayableAmount } from '@/features/salary-expenses/salary-payment.types'

interface PayableAmountModalProps {
    tenantSlug: string
    salarySheetId: number
    isOpen: boolean
    onClose: () => void
}

export default function PayableAmountModal({
    tenantSlug,
    salarySheetId,
    isOpen,
    onClose,
}: PayableAmountModalProps) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<PayableAmount | null>(null)

    const toSafeNumber = (value: any): number => {
        const num = typeof value === 'string' ? parseFloat(value) : Number(value)
        return isNaN(num) ? 0 : num
    }

    useEffect(() => {
        if (isOpen && salarySheetId) {
            fetchPayableAmount()
        }
    }, [isOpen, salarySheetId])

    async function fetchPayableAmount() {
        setLoading(true)
        try {
            const res = await getPayableAmountClient(tenantSlug, salarySheetId)
            if (res.success) {
                setData(res.data)
            } else {
                toast.error(res.message || 'Failed to fetch payable amount')
            }
        } catch (error) {
            console.error('Error fetching payable amount:', error)
            toast.error('Server error')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900">Payable Amount Details</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                    ) : data ? (
                        <div className="space-y-4">
                            {data.employee && (
                                <div className="rounded-lg bg-slate-50 p-4">
                                    <p className="text-sm font-medium text-slate-700">Employee</p>
                                    <p className="mt-1 text-lg font-semibold text-slate-900">{data.employee.name}</p>
                                    <p className="mt-0.5 text-sm text-slate-600">{data.employee.designation}</p>
                                    <p className="text-sm text-slate-600">{data.employee.mobile}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-sm text-slate-600">Total Payable</p>
                                    <p className="mt-1 text-xl font-bold text-slate-900">
                                        BDT {' '}
                                        {toSafeNumber(data.total_payable).toFixed(2)}
                                    </p>
                                </div>

                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-sm text-slate-600">Total Paid</p>
                                    <p className="mt-1 text-xl font-bold text-green-600">
                                        BDT {' '}
                                        {toSafeNumber(data.total_paid).toFixed(2)}
                                    </p>
                                </div>

                                <div className="col-span-2 rounded-lg border-2 border-purple-900 bg-purple-800 p-4">
                                    <p className="text-sm text-slate-300">Due Amount</p>
                                    <p className="mt-1 text-2xl font-bold text-white">
                                        BDT {' '}
                                        {toSafeNumber(data.due_amount).toFixed(2)}
                                    </p>
                                </div>

                                <div className="col-span-2 rounded-lg border border-slate-200 p-4">
                                    <p className="text-sm text-slate-600">Maximum Payment Allowed</p>
                                    <p className="mt-1 text-xl font-bold text-slate-900">
                                        BDT {' '}
                                        {toSafeNumber(data.max_payment_amount).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                                <span className="text-sm font-medium text-slate-700">Payment Status:</span>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        data.payment_status === 'paid'
                                            ? 'bg-green-100 text-green-700'
                                            : data.payment_status === 'partial'
                                              ? 'bg-yellow-100 text-yellow-700'
                                              : 'bg-red-100 text-red-700'
                                    }`}
                                >
                                    {data.payment_status.toUpperCase()}
                                </span>
                            </div>

                            {data.loans && data.loans.length > 0 && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                    <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                                        <AlertCircle className="h-4 w-4" />
                                        Active Loans
                                    </p>
                                    <div className="mt-3 space-y-2">
                                        {data.loans.map((loan) => (
                                            <div
                                                key={loan.id}
                                                className="rounded border border-amber-200 bg-white p-3 text-sm"
                                            >
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <span className="text-slate-600">Loan Amount:</span>
                                                        <span className="ml-2 font-semibold text-slate-900">
                                                            BDT {toSafeNumber(loan.loan_amount).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-600">Paid:</span>
                                                        <span className="ml-2 font-semibold text-green-600">
                                                            BDT {toSafeNumber(loan.paid_amount).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-600">Remaining:</span>
                                                        <span className="ml-2 font-semibold text-red-600">
                                                            BDT {toSafeNumber(loan.remaining_balance).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-600">Monthly Deduction:</span>
                                                        <span className="ml-2 font-semibold text-slate-900">
                                                            BDT {toSafeNumber(loan.monthly_deduction).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!data.can_pay && (
                                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
                                    <AlertCircle className="h-5 w-5" />
                                    <p className="text-sm font-medium">No payment required. Salary is fully paid.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-slate-500">No data available</div>
                    )}
                </div>

                <div className="flex justify-end border-t border-slate-200 p-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
