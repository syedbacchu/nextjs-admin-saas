'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import ImagePickerField from '@/components/form/ImagePickerField'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'
import { createPurchasePaymentClient } from '@/features/supplier-payments'
import type { FileSystemItem } from '@/features/files'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    type: string
    purchaseId: number
    purchaseTypeLabel: string
    dueAmount: number
    tenantSlug: string
    initialFiles: FileSystemItem[]
    onSuccess?: () => void
}

const PAYMENT_METHODS = [
    { label: 'Cash', value: 'cash' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'Check', value: 'check' },
    { label: 'Mobile Banking', value: 'mobile_banking' },
    { label: 'Other', value: 'other' },
]

export default function PaymentModal({
    isOpen,
    onClose,
    type,
    purchaseId,
    purchaseTypeLabel,
    dueAmount,
    tenantSlug,
    initialFiles,
    onSuccess,
}: PaymentModalProps) {
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [note, setNote] = useState('')
    const [attachment, setAttachment] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const paymentAmount = Number.parseFloat(amount)

        if (!amount || paymentAmount <= 0) {
            toast.error('Please enter a valid amount')
            return
        }

        if (paymentAmount > dueAmount) {
            toast.error(`Payment amount cannot exceed due amount (${dueAmount})`)
            return
        }

        setLoading(true)
        try {
            const result = await createPurchasePaymentClient(tenantSlug, {
                type: type as any,
                purchase_id: purchaseId,
                amount: paymentAmount,
                payment_method: paymentMethod,
                note: note.trim(),
                attachment: attachment,
                payment_date: new Date().toISOString().split('T')[0],
            })

            if (result.success) {
                toast.success(result.message || 'Payment recorded successfully')
                onSuccess?.()
                onClose()
                // Reset form
                setAmount('')
                setPaymentMethod('cash')
                setNote('')
                setAttachment('')
            } else {
                toast.error(result.message || 'Failed to record payment')
            }
        } catch (error) {
            console.error('Error creating payment:', error)
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
                    <h3 className="text-xl font-bold text-slate-900">Record Payment</h3>
                    <p className="text-sm text-slate-600">
                        {purchaseTypeLabel} Purchase # {purchaseId}
                    </p>
                </div>

                {/* Due Amount Display */}
                <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Due Amount:</span>
                        <span className="text-lg font-bold text-rose-600">
                            ৳{dueAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextInput
                        label="Payment Amount"
                        name="amount"
                        value={amount}
                        onChange={setAmount}
                        placeholder="Enter payment amount"
                        type="number"
                        required
                        helpText={`Maximum payable: ৳${dueAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    />

                    <SelectInput
                        label="Payment Method"
                        name="payment_method"
                        value={paymentMethod}
                        options={PAYMENT_METHODS}
                        onChange={setPaymentMethod}
                        emptyOptionLabel="Select payment method"
                        required
                    />

                    <TextInput
                        label="Note"
                        name="note"
                        value={note}
                        onChange={setNote}
                        placeholder="Enter payment note (optional)"
                        textarea
                        rows={3}
                    />

                    <ImagePickerField
                        tenantSlug={tenantSlug}
                        label="Attachment"
                        value={attachment}
                        onChange={setAttachment}
                        initialFiles={initialFiles}
                        placeholder="Select attachment from file manager (optional)"
                        triggerLabel="Choose File"
                        uploadFieldName="attachment"
                    />

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                        >
                            {loading ? 'Processing...' : 'Record Payment'}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
