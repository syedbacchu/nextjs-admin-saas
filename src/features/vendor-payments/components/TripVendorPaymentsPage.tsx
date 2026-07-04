'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DynamicTable from '@/components/ui/DynamicTable'
import { ColumnDef } from '@/types/api'
import { getVendorsAction } from '@/features/vendors'
import { getOfficesAction } from '@/features/offices/actions/office.actions'
import { getFilesAction } from '@/features/files/actions/file-system.actions'
import type { Vendor } from '@/features/vendors'
import type { Office } from '@/features/offices/types'
import type { FileSystemItem } from '@/features/files/types'
import { useOptimizedListPage } from '@/hooks/useOptimizedListPage'
import {VendorPaymentSummary} from "@/features/vendor-payments/types/trip-vendor-payment.types";
import {getVendorPaymentSummariesAction} from "@/features/vendor-payments/actions/trip-vendor-payment.actions";
import VendorPaymentModal from "@/features/vendor-payments/components/VendorPaymentModal";
import VendorPaymentHistoryModal from "@/features/vendor-payments/components/VendorPaymentHistoryModal";

type VendorPaymentRow = VendorPaymentSummary & { id: number; _serial: number }

const EMPTY_DATA = {
    success: false,
    data: { data: [], total_page: 1 },
}

function formatAmount(value?: number | null): string {
    if (value === null || typeof value === 'undefined') return '৳0.00'
    return `৳${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function getPaymentStatusBadge(status: string) {
    switch (status) {
        case 'paid':
            return <span className="rounded-full px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700">Paid</span>
        case 'partial':
            return <span className="rounded-full px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700">Partial</span>
        case 'unpaid':
            return <span className="rounded-full px-2 py-1 text-xs font-semibold bg-rose-100 text-rose-700">Unpaid</span>
        default:
            return <span>{status}</span>
    }
}

export default function TripVendorPaymentsPage() {
    const params = useParams<{ tenant_slug: string }>()
    const router = useRouter()
    const tenantSlug = String(params?.tenant_slug || '').trim()

    const [vendors, setVendors] = useState<Vendor[]>([])
    const [offices, setOffices] = useState<Office[]>([])
    const [initialFiles, setInitialFiles] = useState<FileSystemItem[]>([])
    const [summary, setSummary] = useState({
        total_vendors: 0,
        total_trips: 0,
        total_vendor_rent: 0,
        total_advance: 0,
        total_payments: 0,
        total_received: 0,
        total_due: 0,
        paid_count: 0,
        partial_count: 0,
        unpaid_count: 0,
    })
    const [paymentModalOpen, setPaymentModalOpen] = useState(false)
    const [historyModalOpen, setHistoryModalOpen] = useState(false)
    const [selectedVendor, setSelectedVendor] = useState<{ id: number; name: string; dueAmount: number } | null>(null)

    const fetchDropdownData = useCallback(async () => {
        try {
            const [vendorsRes, officesRes, filesRes] = await Promise.all([
                getVendorsAction(tenantSlug, 1, ''),
                getOfficesAction(tenantSlug, 1, ''),
                getFilesAction(tenantSlug, 1, ''),
            ])

            setVendors(vendorsRes.success ? (vendorsRes.data?.data || []) : [])
            setOffices(officesRes.success ? (officesRes.data?.data || []) : [])
            setInitialFiles(filesRes.success ? (filesRes.data?.data || []) : [])
        } catch (error) {
            console.error('Error fetching dropdown data:', error)
        }
    }, [tenantSlug])

    const { refreshKey, setRefreshKey, optimizedFetchData, tempFilters, buildApiFilters, handleFilterChange, applyFilters, resetFilters } = useOptimizedListPage({
        tenantSlug,
        fetchListData: useCallback(async (page: number, search: string, filters?: Record<string, string>) => {
            if (!tenantSlug) return EMPTY_DATA

            try {
                const params = new URLSearchParams({ page: String(page), per_page: '10', search: search || '' })
                if (filters?.vendor_id) params.append('vendor_id', filters.vendor_id)
                if (filters?.office_id) params.append('office_id', filters.office_id)
                if (filters?.from_date) params.append('from_date', filters.from_date)
                if (filters?.to_date) params.append('to_date', filters.to_date)

                const result = await getVendorPaymentSummariesAction(tenantSlug, params.toString())
                if (!result.success || !result.data) return EMPTY_DATA

                if (result.data.summary) {
                    const summaryData = result.data.summary
                    setSummary({
                        total_vendors: summaryData.total_vendors,
                        total_trips: summaryData.total_trips,
                        total_vendor_rent: parseFloat(summaryData.total_vendor_rent) || 0,
                        total_advance: parseFloat(summaryData.total_advance) || 0,
                        total_payments: parseFloat(summaryData.total_payments) || 0,
                        total_received: parseFloat(summaryData.total_received) || 0,
                        total_due: parseFloat(summaryData.total_due) || 0,
                        paid_count: summaryData.paid_count,
                        partial_count: summaryData.partial_count,
                        unpaid_count: summaryData.unpaid_count,
                    })
                }

                const dataWithSerial = result.data.data.map((item, index) => ({
                    ...item,
                    id: item.vendor_id,
                    _serial: ((page - 1) * 10) + index + 1,
                }))

                return { success: true, data: { data: dataWithSerial, total_page: result.data.total_page || 1 } }
            } catch (error) {
                console.error('Error fetching vendor summaries:', error)
                return EMPTY_DATA
            }
        }, [tenantSlug]),
        fetchDropdownData,
        initialFilters: { vendor_id: '', office_id: '', from_date: '', to_date: '' },
        enableInitialDataLoad: true,
    })

    const columns: ColumnDef<VendorPaymentRow>[] = [
        { header: '#', cell: (item) => <span className="text-slate-500">{item._serial}</span>, className: 'w-12' },
        { header: 'Vendor', cell: (item) => <span className="font-medium">{item.vendor?.name || 'N/A'}</span> },
        { header: 'Branch', cell: (item) => <span>{item.office?.branch_name || 'N/A'}</span> },
        { header: 'Trip Count', cell: (item) => <span>{item.trip_count}</span> },
        { header: 'Total Vendor Rent', cell: (item) => <span className="font-medium">{formatAmount(item.total_vendor_rent)}</span> },
        { header: 'Advance Paid', cell: (item) => <span className="font-medium text-emerald-600">{formatAmount(item.advance_paid)}</span> },
        { header: 'Paid Amount', cell: (item) => <span className="font-medium text-blue-600">{formatAmount(item.payment_received)}</span> },
        { header: 'Due Amount', cell: (item) => <span className="font-bold text-rose-600">{formatAmount(item.due_amount)}</span> },
        { header: 'Status', cell: (item) => getPaymentStatusBadge(item.payment_status) },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex gap-2 justify-end">
                    {item.due_amount > 0 && <button onClick={() => handlePayNow(item)} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700">Pay Now</button>}
                    <button onClick={() => handleViewHistory(item)} className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100" title="View payment history">History</button>
                    <button onClick={() => handleViewTrips(item.vendor_id)} className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100" title="View vendor trips">Trips</button>
                </div>
            ),
        },
    ]

    function handlePayNow(vendor: VendorPaymentSummary) {
        setSelectedVendor({ id: vendor.vendor_id, name: vendor.vendor?.name || 'Unknown', dueAmount: vendor.due_amount })
        setPaymentModalOpen(true)
    }

    function handleViewHistory(vendor: VendorPaymentSummary) {
        setSelectedVendor({ id: vendor.vendor_id, name: vendor.vendor?.name || 'Unknown', dueAmount: vendor.due_amount })
        setHistoryModalOpen(true)
    }

    function handlePaymentSuccess() {
        setRefreshKey((prev) => prev + 1)
    }

    function handleViewTrips(vendorId: number) {
        router.push(`/${tenantSlug}/trips?vendor_id=${vendorId}`)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Vendor Payments (Trip-wise)</h1></div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4"><div className="mb-2 text-sm font-medium text-blue-700">Total Vendors</div><div className="text-2xl font-bold text-blue-900">{summary.total_vendors}</div></div>
                <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4"><div className="mb-2 text-sm font-medium text-indigo-700">Total Trips</div><div className="text-2xl font-bold text-indigo-900">{summary.total_trips}</div></div>
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4"><div className="mb-2 text-sm font-medium text-orange-700">Total Vendor Rent</div><div className="text-2xl font-bold text-orange-900">{formatAmount(summary.total_vendor_rent)}</div></div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"><div className="mb-2 text-sm font-medium text-emerald-700">Total Received</div><div className="text-2xl font-bold text-emerald-900">{formatAmount(summary.total_received)}</div></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-4"><div className="mb-2 text-sm font-medium text-teal-700">Total Advance</div><div className="text-2xl font-bold text-teal-900">{formatAmount(summary.total_advance)}</div></div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4"><div className="mb-2 text-sm font-medium text-blue-700">Total Payments</div><div className="text-2xl font-bold text-blue-900">{formatAmount(summary.total_payments)}</div></div>
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4"><div className="mb-2 text-sm font-medium text-rose-700">Total Due</div><div className="text-2xl font-bold text-rose-900">{formatAmount(summary.total_due)}</div></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"><div className="mb-2 text-sm font-medium text-emerald-700">Paid Vendors</div><div className="text-2xl font-bold text-emerald-900">{summary.paid_count}</div></div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4"><div className="mb-2 text-sm font-medium text-amber-700">Partial Vendors</div><div className="text-2xl font-bold text-amber-900">{summary.partial_count}</div></div>
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4"><div className="mb-2 text-sm font-medium text-rose-700">Unpaid Vendors</div><div className="text-2xl font-bold text-rose-900">{summary.unpaid_count}</div></div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-4"><h3 className="text-sm font-semibold text-slate-900">Filters</h3></div>
                <div className="grid gap-4 md:grid-cols-4">
                    <label className="space-y-1"><span className="text-xs font-medium uppercase tracking-wide text-slate-500">Vendor</span><select value={tempFilters.vendor_id} onChange={(e) => handleFilterChange('vendor_id', e.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"><option value="">All Vendors</option>{vendors.map((vendor) => <option key={vendor.id} value={String(vendor.id)}>{vendor.name}</option>)}</select></label>
                    <label className="space-y-1"><span className="text-xs font-medium uppercase tracking-wide text-slate-500">Branch/Office</span><select value={tempFilters.office_id} onChange={(e) => handleFilterChange('office_id', e.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"><option value="">All Branches</option>{offices.map((office) => <option key={office.id} value={String(office.id)}>{office.branch_name}</option>)}</select></label>
                    <label className="space-y-1"><span className="text-xs font-medium uppercase tracking-wide text-slate-500">From Date</span><input type="date" value={tempFilters.from_date} onChange={(e) => handleFilterChange('from_date', e.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" /></label>
                    <label className="space-y-1"><span className="text-xs font-medium uppercase tracking-wide text-slate-500">To Date</span><input type="date" value={tempFilters.to_date} onChange={(e) => handleFilterChange('to_date', e.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" /></label>
                </div>
                <div className="mt-4 flex gap-2"><button onClick={applyFilters} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition">Apply Filters</button><button onClick={resetFilters} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">Reset</button></div>
            </div>
            <DynamicTable key={refreshKey} title="Vendor Payment Summary" fetchData={optimizedFetchData} columns={columns} initialFilters={buildApiFilters} />
            {selectedVendor && <>
                <VendorPaymentModal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} vendorId={selectedVendor.id} vendorName={selectedVendor.name} dueAmount={selectedVendor.dueAmount} tenantSlug={tenantSlug} initialFiles={initialFiles} onSuccess={handlePaymentSuccess} />
                <VendorPaymentHistoryModal isOpen={historyModalOpen} onClose={() => setHistoryModalOpen(false)} tenantSlug={tenantSlug} vendorId={selectedVendor.id} vendorName={selectedVendor.name} onSuccess={handlePaymentSuccess} />
            </>}
        </div>
    )
}
