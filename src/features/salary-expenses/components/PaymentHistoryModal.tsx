'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { X, Loader2, IndianRupee } from 'lucide-react'
import { getPaymentHistoryClient } from '@/features/salary-expenses/actions/salary-payment.client'
import type { PaymentHistory } from '@/features/salary-expenses/salary-payment.types'

interface PaymentHistoryModalProps {
    tenantSlug: string
    salarySheetId: number
    isOpen: boolean
    onClose: () => void
}

export default function PaymentHistoryModal({
    tenantSlug,
    salarySheetId,
    isOpen,
    onClose,
}: PaymentHistoryModalProps) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<PaymentHistory | null>(null)

    const toSafeNumber = (value: any): number => {
        const num = typeof value === 'string' ? parseFloat(value) : Number(value)
        return isNaN(num) ? 0 : num
    }

    useEffect(() => {
        if (isOpen && salarySheetId) {
            fetchPaymentHistory()
        }
    }, [isOpen, salarySheetId])

    async function fetchPaymentHistory() {
        setLoading(true)
        try {
            const res = await getPaymentHistoryClient(tenantSlug, salarySheetId)
            if (res.success) {
                setData(res.data)
            } else {
                toast.error(res.message || 'Failed to fetch payment history')
            }
        } catch (error) {
            console.error('Error fetching payment history:', error)
            toast.error('Server error')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900">Payment History</h3>
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
                            <div className="grid grid-cols-4 gap-4 rounded-lg bg-slate-50 p-4">
                                <div>
                                    <p className="text-xs text-slate-600">Total Payable</p>
                                    <p className="mt-1 text-sm font-bold text-slate-900">
                                        BDT {' '}
                                        {toSafeNumber(data.total_payable).toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-600">Total Paid</p>
                                    <p className="mt-1 text-sm font-bold text-green-600">
                                        BDT {' '}
                                        {toSafeNumber(data.total_paid).toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-600">Remaining Due</p>
                                    <p className="mt-1 text-sm font-bold text-red-600">
                                        BDT {' '}
                                        {toSafeNumber(data.remaining_due).toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-600">Status</p>
                                    <span
                                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
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
                            </div>

                            {data.payments.length > 0 ? (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-slate-900">Payment Records</h4>
                                    {data.payments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-sm font-semibold text-slate-900">
                                                            Payment #{payment.id}
                                                        </p>
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                                payment.status === 1
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-red-100 text-red-700'
                                                            }`}
                                                        >
                                                            {payment.status === 1 ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-xs text-slate-600">
                                                        {payment.payment_date} by {payment.created_by_user?.name || 'Unknown'}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-600">
                                                        Method: <span className="font-medium">{payment.payment_method}</span>
                                                    </p>
                                                    {payment.transaction_id && (
                                                        <p className="text-xs text-slate-600">
                                                            Transaction ID: <span className="font-medium">{payment.transaction_id}</span>
                                                        </p>
                                                    )}
                                                    {payment.remarks && (
                                                        <p className="mt-2 text-xs text-slate-600">
                                                            Remarks: <span className="italic">{payment.remarks}</span>
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-green-600">
                                                        BDT {' '}
                                                        {toSafeNumber(payment.payment_amount).toFixed(2)}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-600">
                                                        Previous: BDT {' '}
                                                        {toSafeNumber(payment.previous_paid).toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-slate-600">
                                                        Due: BDT {' '}
                                                        {toSafeNumber(payment.remaining_due).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            {payment.salary_expense && (
                                                <div className="mt-3 rounded-md bg-slate-50 p-2 text-xs text-slate-600">
                                                    <span className="font-medium">Expense Record:</span> #{payment.salary_expense.id} -{' '}
                                                    {payment.salary_expense.category} ({payment.salary_expense.date})
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-slate-500">No payments found</div>
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
