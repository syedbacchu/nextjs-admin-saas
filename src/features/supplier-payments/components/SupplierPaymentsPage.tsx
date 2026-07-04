'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import { ColumnDef } from '@/types/api'
import { AnyPurchase, getPaymentHistoryAction, getSupplierPaymentsAction, PurchasePaymentHistory } from '@/features/supplier-payments'
import { getSuppliersAction } from '@/features/suppliers/actions/supplier.actions'
import type { Supplier } from '@/features/suppliers/types'
import { getFilesAction } from '@/features/files/actions/file-system.actions'
import PaymentModal from "@/features/purchase-payments/components/PaymentModal";
import PaymentDetailsModal from "@/features/purchase-payments/components/PaymentDetailsModal";

const EMPTY_SUPPLIER_PAYMENT_LIST = {
    success: false,
    data: {
        data: [],
        total_page: 1,
    },
}

function formatDate(value?: string | null): string {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

function formatAmount(value?: number | null): string {
    if (value === null || typeof value === 'undefined') return 'N/A'
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
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

function getTypeBadge(type: string) {
    switch (type) {
        case 'fuel':
            return <span className="rounded-full px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700">Fuel</span>
        case 'maintenance':
            return <span className="rounded-full px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700">Maintenance</span>
        case 'official_product':
            return <span className="rounded-full px-2 py-1 text-xs font-semibold bg-green-100 text-green-700">Official Product</span>
        default:
            return <span>{type}</span>
    }
}

function getCategoryDisplay(item: AnyPurchase): string {
    if (item.type === 'fuel') return (item as any).fuel_type || 'N/A'
    return (item as any).category || 'N/A'
}

function getVehicleDisplay(item: AnyPurchase): string {
    if (item.type === 'fuel' || item.type === 'maintenance') return (item as any).vehicle?.vehicle_name || 'N/A'
    return 'N/A'
}

export default function SupplierPaymentsPage() {
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [refreshKey, setRefreshKey] = useState(0)
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [summary, setSummary] = useState({
        total_purchases: 0,
        total_amount: 0,
        total_paid: 0,
        total_due: 0,
        fuel_purchases: 0,
        maintenance_purchases: 0,
        official_product_purchases: 0,
        paid_count: 0,
        partial_count: 0,
        unpaid_count: 0,
    })
    const [tempFilters, setTempFilters] = useState({
        supplier_id: '',
        type: '',
        from_date: '',
        to_date: '',
    })
    const [initialDataLoaded, setInitialDataLoaded] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    const [selectedPurchase, setSelectedPurchase] = useState<{
        type: string
        purchaseId: number
        dueAmount: number
        purchaseTypeLabel: string
    } | null>(null)
    const [selectedPayments, setSelectedPayments] = useState<PurchasePaymentHistory[]>([])
    const [initialFiles, setInitialFiles] = useState<any[]>([])

    useEffect(() => {
        if (!tenantSlug || initialDataLoaded) return

        const fetchInitialData = async () => {
            try {
                const [suppliersRes, filesRes] = await Promise.all([
                    getSuppliersAction(tenantSlug, 1, ''),
                    getFilesAction(tenantSlug, 1, ''),
                ])

                if (suppliersRes.success) setSuppliers(suppliersRes.data?.data || [])
                if (filesRes.success) setInitialFiles(filesRes.data?.data || [])
            } catch (error) {
                console.error('Error fetching initial data:', error)
            } finally {
                setInitialDataLoaded(true)
            }
        }

        void fetchInitialData()
    }, [tenantSlug, initialDataLoaded])

    const columns: ColumnDef<AnyPurchase>[] = [
        { header: '#', cell: (item) => <span className="text-slate-500">{item._serial}</span>, className: 'w-12' },
        { header: 'Purchase Date', cell: (item) => <span>{formatDate(item.purchase_date)}</span> },
        { header: 'Type', cell: (item) => getTypeBadge(item.type) },
        { header: 'Supplier', cell: (item) => <span>{item.supplier?.name || 'N/A'}</span> },
        { header: 'Branch', cell: (item) => <span>{item.office?.branch_name || 'N/A'}</span> },
        { header: 'Category/Type', cell: (item) => <span>{getCategoryDisplay(item)}</span> },
        { header: 'Vehicle', cell: (item) => <span>{getVehicleDisplay(item)}</span> },
        { header: 'Total Amount', cell: (item) => <span className="font-medium">{formatAmount(item.total_purchase_amount)}</span> },
        { header: 'Paid Amount', cell: (item) => <span className="font-medium text-emerald-600">{formatAmount(item.paid_amount)}</span> },
        { header: 'Due Amount', cell: (item) => <span className="font-bold text-rose-600">{formatAmount(item.due_amount)}</span> },
        { header: 'Status', cell: (item) => getPaymentStatusBadge(item.payment_status) },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => {
                const hasPayments = item.payment_status === 'partial' || item.payment_status === 'paid'

                // Extract numeric ID from prefixed ID like "fuel-9" -> 9
                const extractNumericId = (id: number | string): number => {
                    if (typeof id === 'number') return id
                    const match = String(id).match(/\d+$/)
                    return match ? parseInt(match[0], 10) : parseInt(String(id), 10)
                }

                const numericId = extractNumericId(item.id)

                return (
                    <div className="flex gap-2 justify-end">
                        {item.due_amount > 0 && (
                            <button
                                onClick={() => handlePayNow(item.type, numericId, item.due_amount)}
                                disabled={item.due_amount <= 0}
                                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Pay Now
                            </button>
                        )}
                        {hasPayments && (
                            <button
                                onClick={() => handleViewDetails(item.type, numericId)}
                                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                title="View payment details"
                            >
                                Details
                            </button>
                        )}
                    </div>
                )
            },
        },
    ]

    const fetchSupplierPayments = useCallback(async (page: number, search: string, filters?: Record<string, string>) => {
        if (!tenantSlug) return EMPTY_SUPPLIER_PAYMENT_LIST

        try {
            const params = new URLSearchParams({
                page: String(page),
                per_page: '10',
                search: search || '',
            })

            if (filters?.supplier_id) params.append('supplier_id', filters.supplier_id)
            if (filters?.office_id) params.append('office_id', filters.office_id)
            if (filters?.type) params.append('type', filters.type)
            if (filters?.from_date) params.append('purchase_date_from', filters.from_date)
            if (filters?.to_date) params.append('purchase_date_to', filters.to_date)

            const result = await getSupplierPaymentsAction(tenantSlug, params.toString())
            if (!result.success || !result.data) return EMPTY_SUPPLIER_PAYMENT_LIST

            if (result.data.summary) setSummary(result.data.summary)

            const dataWithSerial = result.data.data.map((item, index) => ({
                ...item,
                _serial: ((page - 1) * 10) + index + 1,
            }))

            return {
                success: true,
                data: {
                    data: dataWithSerial,
                    total_page: result.data.total_page || 1,
                    summary: result.data.summary,
                },
            }
        } catch (error) {
            console.error('Error fetching supplier payments:', error)
            return EMPTY_SUPPLIER_PAYMENT_LIST
        }
    }, [tenantSlug])

    async function handlePayNow(type: string, purchaseId: number, dueAmount: number) {
        if (dueAmount <= 0) {
            await handleViewDetails(type, purchaseId)
            return
        }

        const purchaseTypeLabels: Record<string, string> = {
            fuel: 'Fuel',
            maintenance: 'Maintenance',
            official_product: 'Official Product',
        }

        setSelectedPurchase({
            type,
            purchaseId,
            dueAmount,
            purchaseTypeLabel: purchaseTypeLabels[type] || type,
        })
        setModalOpen(true)
    }

    async function handleViewDetails(type: string, purchaseId: number) {
        try {
            const result = await getPaymentHistoryAction(tenantSlug, type, purchaseId)
            if (result.success && result.data) {
                setSelectedPayments(result.data)
                const purchaseTypeLabels: Record<string, string> = {
                    fuel: 'Fuel',
                    maintenance: 'Maintenance',
                    official_product: 'Official Product',
                }
                setSelectedPurchase({
                    type,
                    purchaseId,
                    dueAmount: 0,
                    purchaseTypeLabel: purchaseTypeLabels[type] || type,
                })
                setDetailsModalOpen(true)
            } else {
                toast.error(result.message || 'Failed to load payment history')
            }
        } catch (error) {
            console.error('Error loading payment history:', error)
            toast.error('Failed to load payment history')
        }
    }

    function handlePaymentSuccess() {
        setRefreshKey((prev) => prev + 1)
    }

    function handlePaymentDetailsSuccess() {
        setRefreshKey((prev) => prev + 1)
        setDetailsModalOpen(false)
    }

    function handleFilterChange(key: string, value: string) {
        setTempFilters((prev) => ({ ...prev, [key]: value }))
    }

    function applyFilters() {
        setRefreshKey((prev) => prev + 1)
    }

    function resetFilters() {
        setTempFilters({
            supplier_id: '',
            type: '',
            from_date: '',
            to_date: '',
        })
        setRefreshKey((prev) => prev + 1)
    }

    const buildApiFilters = useMemo(() => ({
        supplier_id: tempFilters.supplier_id || '',
        type: tempFilters.type || '',
        from_date: tempFilters.from_date || '',
        to_date: tempFilters.to_date || '',
    }), [tempFilters.supplier_id, tempFilters.type, tempFilters.from_date, tempFilters.to_date])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Supplier Payments</h1>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4"><div className="mb-2 text-sm font-medium text-blue-700">Total Purchases</div><div className="text-2xl font-bold text-blue-900">{summary.total_purchases}</div></div>
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4"><div className="mb-2 text-sm font-medium text-orange-700">Total Amount</div><div className="text-2xl font-bold text-orange-900">{formatAmount(summary.total_amount)}</div></div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"><div className="mb-2 text-sm font-medium text-emerald-700">Total Paid</div><div className="text-2xl font-bold text-emerald-900">{formatAmount(summary.total_paid)}</div></div>
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4"><div className="mb-2 text-sm font-medium text-rose-700">Total Due</div><div className="text-2xl font-bold text-rose-900">{formatAmount(summary.total_due)}</div></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4"><div className="mb-2 text-sm font-medium text-blue-700">Fuel Purchases</div><div className="text-2xl font-bold text-blue-900">{summary.fuel_purchases}</div></div>
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4"><div className="mb-2 text-sm font-medium text-purple-700">Maintenance Purchases</div><div className="text-2xl font-bold text-purple-900">{summary.maintenance_purchases}</div></div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4"><div className="mb-2 text-sm font-medium text-green-700">Official Product Purchases</div><div className="text-2xl font-bold text-green-900">{summary.official_product_purchases}</div></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"><div className="mb-2 text-sm font-medium text-emerald-700">Paid Purchases</div><div className="text-2xl font-bold text-emerald-900">{summary.paid_count}</div></div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4"><div className="mb-2 text-sm font-medium text-amber-700">Partial Purchases</div><div className="text-2xl font-bold text-amber-900">{summary.partial_count}</div></div>
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4"><div className="mb-2 text-sm font-medium text-rose-700">Unpaid Purchases</div><div className="text-2xl font-bold text-rose-900">{summary.unpaid_count}</div></div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-4"><h3 className="text-sm font-semibold text-slate-900">Filters</h3></div>
                <div className="grid gap-4 md:grid-cols-4">
                    <label className="space-y-1">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Supplier</span>
                        <select value={tempFilters.supplier_id} onChange={(e) => handleFilterChange('supplier_id', e.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200">
                            <option value="">All Suppliers</option>
                            {suppliers.map((supplier) => <option key={supplier.id} value={String(supplier.id)}>{supplier.name}</option>)}
                        </select>
                    </label>
                    <label className="space-y-1">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Purchase Type</span>
                        <select value={tempFilters.type} onChange={(e) => handleFilterChange('type', e.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200">
                            <option value="">All Types</option>
                            <option value="fuel">Fuel</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="official_product">Official Product</option>
                        </select>
                    </label>
                    <label className="space-y-1">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">From Date</span>
                        <input type="date" value={tempFilters.from_date} onChange={(e) => handleFilterChange('from_date', e.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" />
                    </label>
                    <label className="space-y-1">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">To Date</span>
                        <input type="date" value={tempFilters.to_date} onChange={(e) => handleFilterChange('to_date', e.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" />
                    </label>
                </div>
                <div className="mt-4 flex gap-2">
                    <button onClick={applyFilters} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition">Apply Filters</button>
                    <button onClick={resetFilters} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">Reset</button>
                </div>
            </div>

            <DynamicTable key={refreshKey} title="All Supplier Purchases" fetchData={fetchSupplierPayments} columns={columns} initialFilters={buildApiFilters} />

            {selectedPurchase && (
                <PaymentModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    type={selectedPurchase.type}
                    purchaseId={selectedPurchase.purchaseId}
                    purchaseTypeLabel={selectedPurchase.purchaseTypeLabel}
                    dueAmount={selectedPurchase.dueAmount}
                    tenantSlug={tenantSlug}
                    initialFiles={initialFiles}
                    onSuccess={handlePaymentSuccess}
                />
            )}

            {selectedPurchase && (
                <PaymentDetailsModal
                    isOpen={detailsModalOpen}
                    onClose={() => setDetailsModalOpen(false)}
                    payments={selectedPayments}
                    tenantSlug={tenantSlug}
                    type={selectedPurchase.type}
                    purchaseId={selectedPurchase.purchaseId}
                    purchaseTypeLabel={selectedPurchase.purchaseTypeLabel}
                    onSuccess={handlePaymentDetailsSuccess}
                />
            )}
        </div>
    )
}
