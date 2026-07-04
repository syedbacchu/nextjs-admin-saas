'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import ListImage from '@/components/ui/ListImage'
import TableActions from '@/components/ui/TableActions'
import { ColumnDef } from '@/types/api'
import { Customer, CustomerListResponse, getCustomersAction, deleteCustomerClient } from '@/features/customers'

const EMPTY_CUSTOMER_LIST: CustomerListResponse = {
    success: false,
    message: 'Invalid tenant',
    status: 400,
    error_message: '',
    data: {
        total_count: 0,
        total_page: 1,
        per_page: 20,
        current_page: 1,
        data: [],
    },
}

function formatBalance(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined' || value === '') return 'N/A'
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

function formatAddresses(address?: Customer['address']): string {
    if (!address) return 'N/A'
    if (typeof address === 'string') return address || 'N/A'
    const items = address.filter(Boolean)
    if (items.length === 0) return 'N/A'
    return items.map((item) => item.name).join(', ')
}

export default function CustomersContent() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [refreshKey, setRefreshKey] = useState(0)

    const columns: ColumnDef<Customer>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        {
            header: 'Image',
            className: 'w-20',
            cell: (item) => <ListImage image={item.image} name={item.name} fallbackText="C" />,
        },
        { header: 'Name', accessorKey: 'name' },
        { header: 'Mobile', cell: (item) => <span>{item.creation_type === 2 ? 'Walk In Customer' : (item.mobile || 'N/A')}</span> },
        { header: 'Email', cell: (item) => <span>{item.email || 'N/A'}</span> },
        { header: 'Addresses', cell: (item) => <span>{formatAddresses(item.address)}</span> },
        { header: 'Rate', cell: (item) => <span>{item.rate_status || 'N/A'}</span> },
        { header: 'Opening Balance', cell: (item) => <span>{formatBalance(item.opening_balance)}</span> },
        {
            header: 'Status',
            cell: (item) => (
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    item.status === 1
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                }`}>
                    {item.status === 1 ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <TableActions
                    id={item.id}
                    hasView
                    hasEdit
                    hasDelete
                    viewLink={`/${tenantSlug}/customers/${item.id}`}
                    editLink={`/${tenantSlug}/customers/${item.id}/edit`}
                    onDelete={handleDelete}
                    itemName={item.name}
                    deleteTitle="Delete Customer?"
                    deleteMessage="Are you sure you want to delete this customer? This action cannot be undone."
                />
            ),
        },
    ]

    async function fetchCustomers(page: number, search: string) {
        if (!tenantSlug) return EMPTY_CUSTOMER_LIST
        return getCustomersAction(tenantSlug, page, search)
    }

    async function handleDelete(id: number | string) {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteCustomerClient(tenantSlug, id)

        if (res.success) {
            toast.success(res.message || 'Customer deleted successfully')
            setRefreshKey((prev) => prev + 1)
        } else {
            toast.error(res.message || 'Failed to delete customer')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Customer Management</h1>
                <button
                    onClick={() => router.push(`/${tenantSlug}/customers/create`)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    + Add Customer
                </button>
            </div>

            <DynamicTable
                key={refreshKey}
                title="Customers"
                fetchData={fetchCustomers}
                columns={columns}
            />
        </div>
    )
}
