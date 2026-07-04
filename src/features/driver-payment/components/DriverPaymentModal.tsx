'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import ImagePickerField from '@/components/form/ImagePickerField'
import {FileSystemItem} from "@/features/files";
import {createDriverPaymentAction} from "@/features/driver-payment";

interface DriverPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  driverId: number
  driverName: string
  dueAmount: number
  tenantSlug: string
  initialFiles: FileSystemItem[]
  onSuccess?: () => void
}

export default function DriverPaymentModal({
  isOpen,
  onClose,
  driverId,
  driverName,
  dueAmount,
  tenantSlug,
  initialFiles,
  onSuccess,
}: DriverPaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [note, setNote] = useState('')
  const [billRef, setBillRef] = useState('')
  const [billDocument, setBillDocument] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const paymentAmount = parseFloat(amount)
    const dueAmountNum = typeof dueAmount === 'string' ? parseFloat(dueAmount) : dueAmount

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (paymentAmount > dueAmountNum) {
      toast.error(`Amount cannot exceed due amount of ৳${dueAmountNum.toFixed(2)}`)
      return
    }

    setLoading(true)

    try {
      const result = await createDriverPaymentAction(tenantSlug, {
        driver_id: driverId,
        office_id: 1, // TODO: Get from context
        amount: paymentAmount,
        payment_method: paymentMethod,
        note: note.trim(),
        bill_ref: billRef.trim(),
        bill_document: billDocument.trim(),
      })

      if (result.success) {
        toast.success(result.message || 'Payment recorded successfully')
        onSuccess?.()
        onClose()
        setAmount('')
        setNote('')
        setBillRef('')
        setBillDocument('')
      } else {
        toast.error(result.message || 'Failed to record payment')
      }
    } catch (error) {
      console.error('Error creating driver payment:', error)
      toast.error('Failed to record payment')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900">Pay Driver</h3>
          <p className="text-sm text-slate-600">{driverName}</p>
        </div>

        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Due Amount:</span>
            <span className="text-lg font-bold text-rose-600">
              ৳{(typeof dueAmount === 'string' ? parseFloat(dueAmount) : dueAmount).toFixed(2)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Amount *</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Payment Method *</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="check">Check</option>
              <option value="mobile_banking">Mobile Banking</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Bill Reference</label>
            <input
              type="text"
              value={billRef}
              onChange={(e) => setBillRef(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter bill reference (optional)"
            />
          </div>

          <ImagePickerField
            tenantSlug={tenantSlug}
            label="Bill Document"
            value={billDocument}
            onChange={setBillDocument}
            initialFiles={initialFiles}
            placeholder="Select bill document from file manager (optional)"
            triggerLabel="Choose File"
            uploadFieldName="bill_document"
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add a note (optional)"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
