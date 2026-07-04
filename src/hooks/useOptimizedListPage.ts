'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

interface UseOptimizedListPageProps<T, TFilter = Record<string, string>> {
  tenantSlug: string
  fetchListData: (page: number, search: string, filters?: Record<string, string>) => Promise<{
    success: boolean
    data: {
      data: T[]
      total_page: number
      stats?: Record<string, unknown> | null
      summary?: unknown
    }
  }>
  fetchDropdownData?: () => Promise<void>
  initialFilters?: TFilter
  enableInitialDataLoad?: boolean
}

interface SummaryState {
  total_items: number
  // Add other common summary fields as needed
  [key: string]: number
}

/**
 * Optimized hook for list pages to prevent multiple API calls
 * Handles:
 * - Single combined useEffect for initial data
 * - Memoized fetchData function
 * - Loading state guards
 * - Proper dependency management
 */
export function useOptimizedListPage<T, TFilter = Record<string, string>>({
  tenantSlug,
  fetchListData,
  fetchDropdownData,
  initialFilters = {} as TFilter,
  enableInitialDataLoad = true,
}: UseOptimizedListPageProps<T, TFilter>) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [summary, setSummary] = useState<SummaryState>({
    total_items: 0,
  })
  const [tempFilters, setTempFilters] = useState<TFilter>(initialFilters)

  // Loading state guards to prevent duplicate requests
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false)
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)

  // Combined initial data fetch with loading guards
  useEffect(() => {
    if (!tenantSlug || !enableInitialDataLoad || initialDataLoaded) return

    const fetchInitialData = async () => {
      setIsLoadingInitialData(true)
      try {
        if (fetchDropdownData) {
          await fetchDropdownData()
        }
      } catch (error) {
        console.error('Error fetching initial data:', error)
      } finally {
        setIsLoadingInitialData(false)
        setInitialDataLoaded(true)
      }
    }

    fetchInitialData()
  }, [tenantSlug, enableInitialDataLoad, initialDataLoaded, fetchDropdownData])

  // Memoized fetch function to prevent unnecessary re-renders
  const optimizedFetchData = useCallback(async (page: number, search: string, filters?: Record<string, string>) => {
    if (!tenantSlug) {
      console.log('No tenant slug provided')
      return {
        success: false,
        data: { data: [], total_page: 1 },
      }
    }

    try {
      const result = await fetchListData(page, search, filters)

      if (result.success && result.data) {
        // Calculate summary if stats/summary is provided
        if (result.data.stats || result.data.summary) {
          const statsData = (result.data.stats || result.data.summary) as Record<string, unknown>
          setSummary((prev) => ({
            ...prev,
            ...statsData,
            total_items: result.data.data.length,
          }))
        }
      }

      return result
    } catch (error) {
      console.error('Error fetching list data:', error)
      return {
        success: false,
        data: { data: [], total_page: 1 },
      }
    }
  }, [tenantSlug, fetchListData])

  // Memoized filters object to prevent unnecessary re-renders
  const buildApiFilters = useMemo(() => {
    const filters: Record<string, string> = {}
    Object.entries(tempFilters as Record<string, string>).forEach(([key, value]) => {
      filters[key] = String(value || '')
    })
    return filters
  }, [tempFilters])

  // Filter handlers
  const handleFilterChange = (key: string, value: string) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const resetFilters = () => {
    setTempFilters(initialFilters)
    setRefreshKey((prev) => prev + 1)
  }

  // Refresh handler
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return {
    // State
    refreshKey,
    summary,
    tempFilters,
    isLoadingInitialData,
    initialDataLoaded,

    // Fetch function
    optimizedFetchData,

    // Filter utilities
    buildApiFilters,
    handleFilterChange,
    applyFilters,
    resetFilters,

    // Refresh handler
    handleRefresh,
    setRefreshKey,
  }
}