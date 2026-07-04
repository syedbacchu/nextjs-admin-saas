'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface CustomerCreateModalProps {
    isOpen: boolean
    onClose: () => void
    onCreateCustomer: (customerData: { name: string }) => Promise<boolean>
    initialName?: string
}

export default function CustomerCreateModal({
    isOpen,
    onClose,
    onCreateCustomer,
    initialName = '',
}: CustomerCreateModalProps) {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(initialName)

    // Update name when initialName changes
    useEffect(() => {
        setName(initialName)
    }, [initialName])

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setName(initialName)
        }
    }, [isOpen, initialName])

    if (!isOpen) return null

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!name.trim()) {
            toast.error('Customer name is required')
            return
        }

        setLoading(true)
        try {
            const success = await onCreateCustomer({ name: name.trim() })
            if (success) {
                setName('')
                onClose()
            }
        } finally {
            setLoading(false)
        }
    }

    function handleClose() {
        setName('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900 bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Add New Customer</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Customer Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter customer name"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? 'Creating...' : 'Create Customer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
