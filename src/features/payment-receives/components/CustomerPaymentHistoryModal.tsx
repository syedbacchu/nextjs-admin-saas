'use client'

import React, { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { getCustomerPaymentHistoryAction } from '@/features/payment-receives/actions/trip-payment-receive.actions'
import { deleteCustomerPaymentHistoryClient } from '@/features/payment-receives/actions/trip-payment-receive.client'
import type { CustomerPaymentReceive } from '@/features/payment-receives/trip-payment-receive.types'

interface CustomerPaymentHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  tenantSlug: string
  customerId: number
  customerName: string
  onSuccess?: () => void
}

export default function CustomerPaymentHistoryModal({
  isOpen,
  onClose,
  tenantSlug,
  customerId,
  customerName,
  onSuccess,
}: CustomerPaymentHistoryModalProps) {
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [payments, setPayments] = useState<CustomerPaymentReceive[]>([])

  const formatAmount = (amount?: number | null): string => {
    if (amount === null || typeof amount === 'undefined') return '৳0.00'
    return `৳${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getCashTypeLabel = (cashType: string): string => {
    const labels: Record<string, string> = {
      cash: 'Cash',
      bank_transfer: 'Bank Transfer',
      check: 'Check',
      mobile_banking: 'Mobile Banking',
      other: 'Other',
    }
    return labels[cashType] || cashType
  }

  React.useEffect(() => {
    if (isOpen) {
      setPayments([]) // Clear previous data
      fetchPaymentHistory()
    }
  }, [isOpen, customerId])

  const fetchPaymentHistory = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getCustomerPaymentHistoryAction(tenantSlug, customerId)

      if (result.success && result.data) {
        setPayments(result.data)
      } else {
        toast.error(result.message || 'Failed to load payment history')
      }
    } catch (error) {
      console.error('Error loading payment history:', error)
      toast.error('Failed to load payment history')
    } finally {
      setLoading(false)
    }
  }, [tenantSlug, customerId])

  const totalReceived = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)

  async function handleDelete(paymentId: number) {
    if (!confirm('Are you sure you want to delete this payment record?')) {
      return
    }

    setDeletingId(paymentId)

    try {
      const result = await deleteCustomerPaymentHistoryClient(tenantSlug, customerId, paymentId)

      if (result.success) {
        toast.success(result.message || 'Payment deleted successfully')
        setPayments(payments.filter((p) => p.id !== paymentId))
        onSuccess?.()
      } else {
        toast.error(result.message || 'Failed to delete payment')
      }
    } catch (error) {
      console.error('Error deleting payment:', error)
      toast.error('Failed to delete payment')
    } finally {
      setDeletingId(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Payment History</h3>
            <p className="text-sm text-slate-600">
              Customer: {customerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        {/* Summary */}
        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-slate-600">Total Payments:</span>
              <span className="ml-auto text-lg font-bold text-slate-900">{payments.length}</span>
            </div>
            <div>
              <span className="text-sm text-slate-600">Total Received:</span>
              <span className="ml-auto text-lg font-bold text-emerald-600">{formatAmount(totalReceived)}</span>
            </div>
          </div>
        </div>

        {/* Payment History List */}
        {loading ? (
          <div className="py-8 text-center text-slate-500">Loading...</div>
        ) : payments.length === 0 ? (
          <div className="py-8 text-center text-slate-500">No payment records found</div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Date:</span>
                    <span className="ml-2 font-medium text-slate-900">
                      {formatDate(payment.date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Amount:</span>
                    <span className="ml-2 font-bold text-emerald-600">
                      {formatAmount(payment.amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Method:</span>
                    <span className="ml-2 font-medium text-slate-900">
                      {getCashTypeLabel(payment.cash_type)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Bill Ref:</span>
                    <span className="ml-2 font-medium text-slate-900">
                      {payment.bill_ref || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Payment ID:</span>
                    <span className="ml-2 font-mono text-xs text-slate-500">
                      #{payment.id}
                    </span>
                  </div>
                </div>
                {payment.note && (
                  <div>
                    <span className="text-slate-600">Note:</span>
                    <p className="mt-1 text-sm text-slate-800">{payment.note}</p>
                  </div>
                )}
                {payment.bill_document && (
                  <div>
                    <span className="text-slate-600">Document:</span>
                    <div className="mt-1">
                      <a
                        href={payment.bill_document}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleDelete(payment.id)}
                      disabled={loading || deletingId === payment.id}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading && deletingId === payment.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
