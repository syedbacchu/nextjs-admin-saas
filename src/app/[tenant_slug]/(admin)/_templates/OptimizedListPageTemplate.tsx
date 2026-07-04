'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import { ColumnDef } from '@/types/api'
import { useOptimizedListPage } from '@/hooks/useOptimizedListPage'

// ============== TEMPLATE CONFIGURATION ==============
// Replace these with your actual types and imports

type ListItem = {
  id: number | string
  // Add your item fields here
  [key: string]: unknown
}

type FilterState = {
  search_field: string
  another_field: string
  date_from: string
  date_to: string
}

// ============== EMPTY DATA CONSTANT ==============
const EMPTY_DATA = {
  success: false,
  data: { data: [], total_page: 1 },
}

// ============== HELPER FUNCTIONS ==============
function formatAmount(value?: number | null): string {
  if (value === null || typeof value === 'undefined') return 'N/A'
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
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

// ============== STATUS BADGES ==============
function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
    case 'paid':
      return (
        <span className="rounded-full px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700">
          {status}
        </span>
      )
    case 'pending':
    case 'partial':
      return (
        <span className="rounded-full px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700">
          {status}
        </span>
      )
    case 'inactive':
    case 'unpaid':
      return (
        <span className="rounded-full px-2 py-1 text-xs font-semibold bg-rose-100 text-rose-700">
          {status}
        </span>
      )
    default:
      return <span>{status}</span>
  }
}

// ============== MAIN PAGE COMPONENT ==============
export default function OptimizedListPageTemplate() {
  const params = useParams<{ tenant_slug?: string }>()
  const router = useRouter()
  const tenantSlug = String(params?.tenant_slug || '').trim()

  // ============== DROPDOWN DATA STATE ==============
  // Add states for dropdown filters (customers, suppliers, etc.)
  const [dropdownItems, setDropdownItems] = useState<any[]>([])

  // ============== USE OPTIMIZED HOOK ==============
  const {
    refreshKey,
    summary,
    tempFilters,
    isLoadingInitialData,
    optimizedFetchData,
    buildApiFilters,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handleRefresh,
  } = useOptimizedListPage<ListItem, FilterState>({
    tenantSlug,
    fetchListData: async (page, search, filters) => {
      // Replace with your actual API call
      // const result = await getYourItemsAction(tenantSlug, filters?.search_field, search)
      // return result

      // Example implementation:
      try {
        console.log('Fetching items for tenant:', tenantSlug, 'filters:', filters)

        // API CALL HERE
        // const result = await getYourItemsAction(tenantSlug, filters?.search_field, search)

        // Process data...
        return {
          success: true,
          data: {
            data: [], // Your processed data
            total_page: 1,
            stats: {
              total_items: 0,
              // Add your stats here
            },
          },
        }
      } catch (error) {
        console.error('Error fetching items:', error)
        return EMPTY_DATA
      }
    },
    fetchDropdownData: async () => {
      // Fetch dropdown data (customers, suppliers, etc.)
      try {
        // const result = await getDropdownItemsAction(tenantSlug, 1, '')
        // if (result.success) {
        //   setDropdownItems(result.data?.data || [])
        // }
      } catch (error) {
        console.error('Error fetching dropdown data:', error)
      }
    },
    initialFilters: {
      search_field: '',
      another_field: '',
      date_from: '',
      date_to: '',
    },
    enableInitialDataLoad: true,
  })

  // ============== TABLE COLUMNS ==============
  const columns: ColumnDef<ListItem>[] = useMemo(() => [
    {
      header: '#',
      cell: (item) => <span className="text-slate-500">{String(item._serial || '')}</span>,
      className: 'w-12',
    },
    {
      header: 'Name',
      cell: (item) => <span className="font-medium">{String(item.name || 'N/A')}</span>,
    },
    {
      header: 'Amount',
      cell: (item) => <span className="font-medium">{formatAmount(Number(item.amount) || 0)}</span>,
    },
    {
      header: 'Date',
      cell: (item) => <span>{formatDate(String(item.date || null))}</span>,
    },
    {
      header: 'Status',
      cell: (item) => getStatusBadge(String(item.status || 'unknown')),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (item) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handleViewDetails(item.id)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            View
          </button>
          <button
            onClick={() => handleEdit(item.id)}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
          >
            Edit
          </button>
        </div>
      ),
    },
  ], [])

  // ============== ACTION HANDLERS ==============
  function handleViewDetails(id: number | string) {
    // Navigate to details page or open modal
    console.log('View details:', id)
  }

  function handleEdit(id: number | string) {
    // Navigate to edit page or open modal
    router.push(`/${tenantSlug}/your-resource/${id}/edit`)
  }

  function handleActionSuccess() {
    // Refresh data after create/update/delete
    handleRefresh()
  }

  // ============== RENDER ==============
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your List Page</h1>
      </div>

      {/* Summary Cards - Optional */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="mb-2 text-sm font-medium text-blue-700">Total Items</div>
          <div className="text-2xl font-bold text-blue-900">{summary.total_items}</div>
        </div>

        {/* Add more summary cards as needed */}
      </div>

      {/* Filter Section */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {/* Dropdown Filter Example */}
          <label className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Search Field</span>
            <select
              value={tempFilters.search_field}
              onChange={(e) => handleFilterChange('search_field', e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All Items</option>
              {dropdownItems.map((item) => (
                <option key={item.id} value={String(item.id)}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          {/* Date Filter Example */}
          <label className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">From Date</span>
            <input
              type="date"
              value={tempFilters.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          {/* Add more filters as needed */}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={applyFilters}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DynamicTable
        key={refreshKey}
        title="Your Items"
        fetchData={optimizedFetchData}
        columns={columns}
        initialFilters={buildApiFilters}
      />

      {/* Loading State */}
      {isLoadingInitialData && (
        <div className="text-center py-8">
          <div className="text-sm text-slate-600">Loading initial data...</div>
        </div>
      )}
    </div>
  )
}