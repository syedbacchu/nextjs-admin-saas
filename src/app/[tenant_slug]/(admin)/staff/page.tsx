'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import TableActions from '@/components/ui/TableActions'
import { ColumnDef } from '@/types/api'
import { getStaffsAction, deleteStaffClient, Staff, StaffListResponse } from '@/features/staff'
import StaffFeatureAccess from '@/features/staff/components/StaffFeatureAccess'
import { StaffLimitGuard, useStaffTier } from '@/features/feature-check'

const EMPTY_STAFF_LIST: StaffListResponse = {
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

export default function StaffPage() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [refreshKey, setRefreshKey] = useState(0)
    const [featureModalOpen, setFeatureModalOpen] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
    const [currentStaffCount, setCurrentStaffCount] = useState(0)
    const { limit: staffLimit } = useStaffTier()

    const columns: ColumnDef<Staff>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Name', accessorKey: 'name' },
        { header: 'Username', accessorKey: 'username' },
        { header: 'Email', cell: (item) => <span>{item.email || 'N/A'}</span> },
        { header: 'Phone', cell: (item) => <span>{item.phone || 'N/A'}</span> },
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
            header: 'Login',
            cell: (item) => (
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    item.enable_login === 1
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                }`}>
                    {item.enable_login === 1 ? 'Enabled' : 'Disabled'}
                </span>
            ),
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => handleManageAccess(item)}
                        className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Manage Access
                    </button>
                    <TableActions
                        id={item.id}
                        hasView
                        hasEdit
                        hasDelete
                        viewLink={`/${tenantSlug}/staff/${item.id}`}
                        editLink={`/${tenantSlug}/staff/${item.id}/edit`}
                        onDelete={handleDelete}
                        itemName={item.name}
                        deleteTitle="Delete Staff?"
                        deleteMessage="Are you sure you want to delete this staff member? This action cannot be undone."
                    />
                </div>
            ),
        },
    ]

    async function fetchStaff(page: number, search: string) {
        if (!tenantSlug) return EMPTY_STAFF_LIST
        const result = await getStaffsAction(tenantSlug, page, search)
        if (result.success && result.data) {
            setCurrentStaffCount(result.data.total_count || 0)
        }
        return result
    }

    async function handleDelete(id: number | string) {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteStaffClient(tenantSlug, id)

        if (res.success) {
            toast.success(res.message || 'Staff deleted successfully')
            setRefreshKey((prev) => prev + 1)
        } else {
            toast.error(res.message || 'Failed to delete staff')
        }
    }

    function handleManageAccess(staff: Staff) {
        setSelectedStaff(staff)
        setFeatureModalOpen(true)
    }

    function handleCloseFeatureModal() {
        setFeatureModalOpen(false)
        setSelectedStaff(null)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
                <div className="flex items-center gap-4">
                    {staffLimit && (
                        <div className="text-sm text-slate-600">
                            <span className="font-medium">{currentStaffCount}</span>
                            <span className="mx-1">/</span>
                            <span className="font-medium">{staffLimit}</span>
                            <span className="ml-1 text-slate-500">staff used</span>
                        </div>
                    )}
                    <StaffLimitGuard currentUsage={currentStaffCount}>
                        <button
                            onClick={() => router.push(`/${tenantSlug}/staff/create`)}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            + Add Staff
                        </button>
                    </StaffLimitGuard>
                </div>
            </div>

            <DynamicTable
                key={refreshKey}
                title="Staff"
                fetchData={fetchStaff}
                columns={columns}
            />

            {featureModalOpen && selectedStaff && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
                        <StaffFeatureAccess
                            tenantSlug={tenantSlug}
                            staffId={selectedStaff.id}
                            staffName={selectedStaff.name}
                            onClose={handleCloseFeatureModal}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
