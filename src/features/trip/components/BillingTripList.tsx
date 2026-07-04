'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import TableActions from '@/components/ui/TableActions'
import { billSubmitTripsClient, deleteTripClient, getTripsAction, Trip } from '@/features/trip'

interface BillingTripListProps {
    tenantSlug: string
    title: string
    description: string
    status?: number
    allowBulkSubmit?: boolean
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

function formatAmount(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined' || value === '') return 'N/A'
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

function getTransportTypeLabel(value?: string | null): string {
    if (value === 'own_transport') return 'Own Transport'
    if (value === 'vendor_transport') return 'Vendor Transport'
    return value || 'N/A'
}

export default function BillingTripList({
    tenantSlug,
    title,
    description,
    status,
    allowBulkSubmit = false,
}: BillingTripListProps) {
    const pathname = usePathname()
    const [items, setItems] = useState<Trip[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [search, setSearch] = useState('')
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [submitting, setSubmitting] = useState(false)
    const [reloadToken, setReloadToken] = useState(0)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const requestTokenRef = useRef(0)
    const hasMoreRef = useRef(true)
    const selectAllRef = useRef<HTMLInputElement | null>(null)

    const tabs = useMemo(() => {
        const base = `/${tenantSlug}/billing`

        return [
            { key: 'pending' as const, label: 'Pending Trips', href: `${base}/pending-trips` },
            { key: 'submitted' as const, label: 'Submitted Trips', href: `${base}/submitted-trips` },
            { key: 'all' as const, label: 'All Trips', href: `${base}/all-trips` },
        ]
    }, [tenantSlug])

    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
    const selectableIds = useMemo(
        () => items.filter((item) => item.status === 0).map((item) => item.id),
        [items],
    )
    const selectedCount = selectedIds.length
    const allLoadedSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedSet.has(id))
    const someLoadedSelected = selectableIds.some((id) => selectedSet.has(id))

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someLoadedSelected && !allLoadedSelected
        }
    }, [allLoadedSelected, someLoadedSelected])

    useEffect(() => {
        hasMoreRef.current = hasMore
    }, [hasMore])

    const reloadList = useCallback(() => {
        setItems([])
        setPage(1)
        setHasMore(true)
        setSelectedIds([])
        setReloadToken((prev) => prev + 1)
    }, [])

    useEffect(() => {
        if (!tenantSlug) return
        if (page !== 1 && !hasMoreRef.current) return

        const currentToken = ++requestTokenRef.current
        setLoading(true)

        const loadTrips = async () => {
            try {
                const res = await getTripsAction(tenantSlug, page, search.trim(), status)

                if (currentToken !== requestTokenRef.current) return

                if (res.success) {
                    const nextItems = res.data.data
                    setItems((prev) => (page === 1 ? nextItems : [...prev, ...nextItems]))
                    setHasMore(page < res.data.total_page)
                } else {
                    toast.error(res.message || 'Failed to load trips')
                }
            } catch (error) {
                console.error('Failed to load trips', error)
                if (currentToken === requestTokenRef.current) {
                    toast.error('Failed to load trips')
                }
            } finally {
                if (currentToken === requestTokenRef.current) {
                    setLoading(false)
                }
            }
        }

        void loadTrips()
    }, [tenantSlug, page, search, status, reloadToken])

    const lastRowRef = useCallback(
        (node: HTMLTableRowElement | null) => {
            if (loading) return
            if (observerRef.current) observerRef.current.disconnect()

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0]?.isIntersecting && hasMore) {
                    setPage((prev) => prev + 1)
                }
            })

            if (node) observerRef.current.observe(node)
        },
        [loading, hasMore],
    )

    const toggleSelection = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
    }

    const toggleAllLoaded = () => {
        setSelectedIds((prev) => {
            if (allLoadedSelected) {
                return prev.filter((id) => !selectableIds.includes(id))
            }

            const next = new Set(prev)
            selectableIds.forEach((id) => next.add(id))
            return Array.from(next)
        })
    }

    const handleDelete = async (id: number | string) => {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteTripClient(tenantSlug, id)
        if (res.success) {
            toast.success(res.message || 'Trip deleted successfully')
            reloadList()
        } else {
            toast.error(res.message || 'Failed to delete trip')
        }
    }

    const handleBulkSubmit = async () => {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const tripIds = Array.from(new Set(selectedIds))
        if (tripIds.length === 0) {
            toast.error('Select at least one pending trip')
            return
        }

        setSubmitting(true)
        try {
            const res = await billSubmitTripsClient(tenantSlug, tripIds)

            if (res.success) {
                toast.success(res.message || 'Trips submitted successfully')
                reloadList()
            } else {
                toast.error(res.message || 'Failed to submit trips')
            }
        } finally {
            setSubmitting(false)
        }
    }

    if (!tenantSlug) {
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                Invalid tenant
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-5 text-white shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Billing</p>
                        <div>
                            <h1 className="text-2xl font-bold">{title}</h1>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{description}</p>
                        </div>
                    </div>

                    {allowBulkSubmit && (
                        <button
                            type="button"
                            onClick={handleBulkSubmit}
                            disabled={submitting || selectedCount === 0}
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-600"
                        >
                            {submitting ? 'Submitting...' : `Submit Selected (${selectedCount})`}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:grid-cols-3">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href

                    return (
                        <Link
                            key={tab.key}
                            href={tab.href}
                            className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                                isActive
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    )
                })}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                        <span className="rounded-full bg-slate-100 px-3 py-1">Loaded: {items.length}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">Selected: {selectedCount}</span>
                        {allowBulkSubmit && (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                                Pending selectable: {selectableIds.length}
                            </span>
                        )}
                    </div>

                    <div className="w-full md:max-w-sm">
                        <input
                            type="text"
                            placeholder="Search trips..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                                setItems([])
                                setHasMore(true)
                                setSelectedIds([])
                            }}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                {allowBulkSubmit && (
                                    <th className="w-12 px-4 py-3">
                                        <input
                                            ref={selectAllRef}
                                            type="checkbox"
                                            checked={allLoadedSelected}
                                            onChange={toggleAllLoaded}
                                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                            aria-label="Select all loaded pending trips"
                                        />
                                    </th>
                                )}
                                <th className="px-4 py-3 font-medium">#</th>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Customer</th>
                                <th className="px-4 py-3 font-medium">Branch</th>
                                <th className="px-4 py-3 font-medium">Load Point</th>
                                <th className="px-4 py-3 font-medium">Unload Point</th>
                                <th className="px-4 py-3 font-medium">Transport</th>
                                <th className="px-4 py-3 font-medium">Vehicle No</th>
                                <th className="px-4 py-3 font-medium">Driver</th>
                                <th className="px-4 py-3 font-medium">Supervisor</th>
                                <th className="px-4 py-3 font-medium">Rent Bill</th>
                                <th className="px-4 py-3 font-medium">Total Expense</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.length > 0 ? (
                                items.map((item, index) => {
                                    const isLast = items.length === index + 1
                                    const isSelected = selectedSet.has(item.id)

                                    return (
                                        <tr
                                            key={item.id}
                                            ref={isLast ? lastRowRef : null}
                                            className={`transition-colors hover:bg-slate-50 ${
                                                isSelected ? 'bg-emerald-50/50' : ''
                                            }`}
                                        >
                                            {allowBulkSubmit && (
                                                <td className="px-4 py-3 align-middle">
                                                    {item.status === 0 ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleSelection(item.id)}
                                                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                                            aria-label={`Select trip ${item.id}`}
                                                        />
                                                    ) : null}
                                                </td>
                                            )}
                                            <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                                            <td className="px-4 py-3">{formatDate(item.date)}</td>
                                            <td className="px-4 py-3">{item.customer?.name || (item.customer_id ? `#${item.customer_id}` : 'N/A')}</td>
                                            <td className="px-4 py-3">{item.office?.branch_name || (item.office_id ? `#${item.office_id}` : 'N/A')}</td>
                                            <td className="px-4 py-3">{item.load_area?.name || (item.load_area_id ? `#${item.load_area_id}` : 'N/A')}</td>
                                            <td className="px-4 py-3">{item.unload_area?.name || (item.unload_area_id ? `#${item.unload_area_id}` : 'N/A')}</td>
                                            <td className="px-4 py-3">{getTransportTypeLabel(item.transport_type)}</td>
                                            <td className="px-4 py-3">{item.vehicle_no || 'N/A'}</td>
                                            <td className="px-4 py-3">{item.driver?.name || (item.driver_id ? `#${item.driver_id}` : 'N/A')}</td>
                                            <td className="px-4 py-3">{item.supervisor?.name || (item.supervisor_id ? `#${item.supervisor_id}` : 'N/A')}</td>
                                            <td className="px-4 py-3">{formatAmount(item.total_rent_bill_amount)}</td>
                                            <td className="px-4 py-3">{formatAmount(item.total_expense)}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                        item.status === 1
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                    }`}
                                                >
                                                    {item.status === 1 ? 'Submitted' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {item.status === 1 ? (
                                                    <TableActions
                                                        id={item.id}
                                                        hasView
                                                        viewLink={`/${tenantSlug}/trips/${item.id}`}
                                                        hasPrint
                                                        printLink={`/${tenantSlug}/trips/${item.id}?print=1`}
                                                    />
                                                ) : (
                                                    <TableActions
                                                        id={item.id}
                                                        hasView
                                                        hasPrint
                                                        hasEdit
                                                        hasDelete
                                                        viewLink={`/${tenantSlug}/trips/${item.id}`}
                                                        printLink={`/${tenantSlug}/trips/${item.id}?print=1`}
                                                        editLink={`/${tenantSlug}/trips/${item.id}/edit`}
                                                        onDelete={handleDelete}
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                !loading && (
                                    <tr>
                                        <td
                                            colSpan={allowBulkSubmit ? 15 : 14}
                                            className="px-4 py-10 text-center text-slate-400"
                                        >
                                            No trips found
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="border-t border-slate-200 px-4 py-3 text-center text-sm text-slate-500">
                        Loading more trips...
                    </div>
                )}
            </div>
        </div>
    )
}
