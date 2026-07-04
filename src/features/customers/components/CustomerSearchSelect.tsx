'use client'

import { useState } from 'react'
import SearchableSelect from '@/components/form/SearchableSelect'
import { CustomerCreateModal } from '@/features/customers'

interface CustomerOption {
    label: string
    value: string | number
}

interface CustomerSearchSelectProps {
    label: string
    name?: string
    value?: string | number
    options: CustomerOption[]
    onChange: (value: string | number) => void
    onCreateCustomer: (customerData: { name: string }) => Promise<boolean>
    placeholder?: string
    required?: boolean
    emptyStateText?: string
    createEmptyLabel?: string
}

export default function CustomerSearchSelect({
    label,
    name,
    value,
    options,
    onChange,
    onCreateCustomer,
    placeholder = 'Select...',
    required,
    emptyStateText = 'No results found',
    createEmptyLabel = 'Create',
}: CustomerSearchSelectProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [pendingSearch, setPendingSearch] = useState('')

    async function handleCreateWhenEmpty(search: string): Promise<boolean> {
        setPendingSearch(search)
        setIsModalOpen(true)
        // Return true to close the dropdown
        return true
    }

    async function handleModalCreate(customerData: { name: string }): Promise<boolean> {
        const success = await onCreateCustomer(customerData)
        if (success) {
            setIsModalOpen(false)
            setPendingSearch('')
        }
        return success
    }

    return (
        <>
            <SearchableSelect
                label={label}
                name={name}
                value={value}
                options={options}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                emptyStateText={emptyStateText}
                createEmptyLabel={createEmptyLabel}
                onCreateWhenEmpty={handleCreateWhenEmpty}
            />
            <CustomerCreateModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setPendingSearch('')
                }}
                onCreateCustomer={handleModalCreate}
                initialName={pendingSearch}
            />
        </>
    )
}
