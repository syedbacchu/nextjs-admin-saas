'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface InfiniteListResponse<T> {
    success: boolean
    data: {
        total_page: number
        data: T[]
        stats?: Record<string, unknown> | null
        summary?: unknown
    }
}

interface UseInfiniteListProps<T> {
    fetchData: (page: number, search: string, filters: Record<string, string>) => Promise<InfiniteListResponse<T>>
    initialFilters?: Record<string, string>
}

export function useInfiniteList<T>({ fetchData, initialFilters = {} }: UseInfiniteListProps<T>) {
    const [items, setItems] = useState<T[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [search, setSearch] = useState('')
    const [stats, setStats] = useState<Record<string, unknown> | null>(null)
    const [filters, setFilters] = useState<Record<string, string>>(initialFilters)

    // Use a ref to store fetchData to avoid dependency issues
    const fetchDataRef = useRef(fetchData)
    fetchDataRef.current = fetchData

    // To prevent race conditions
    const isFetching = useRef(false)

    // 1. Debounced Search Handler
    const handleSearch = (text: string) => {
        setSearch(text)
        setPage(1) // Reset to page 1
        setItems([]) // Clear current list
        setHasMore(true)
    }

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
        setPage(1)
        setItems([])
        setHasMore(true)
    }

    const resetFilters = () => {
        setFilters(initialFilters)
        setPage(1)
        setItems([])
        setHasMore(true)
    }

    // 2. Main Fetch Function
    const loadItems = useCallback(async () => {
        if (isFetching.current || (!hasMore && page !== 1)) return

        setLoading(true)
        isFetching.current = true

        try {
            const res = await fetchDataRef.current(page, search, filters)

            if (res.success) {
                const newData = res.data.data
                const totalPages = res.data.total_page

                setItems((prev) => (page === 1 ? newData : [...prev, ...newData]))
                setHasMore(page < totalPages)
                setStats((res.data?.stats || res.data?.summary || null) as Record<string, unknown> | null)
            }
        } catch (error) {
            console.error('Failed to load list', error)
        } finally {
            setLoading(false)
            isFetching.current = false
        }
    }, [page, search, filters, hasMore])

    // 3. Trigger Fetch on dependency change
    useEffect(() => {
        loadItems()
    }, [loadItems])

    // 4. Infinite Scroll Observer Ref
    const observer = useRef<IntersectionObserver | null>(null)
    const lastElementRef = useCallback((node: HTMLTableRowElement | null) => {
        if (loading) return
        if (isFetching.current) return // Prevent multiple simultaneous calls
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !isFetching.current) {
                setPage((prev) => prev + 1)
            }
        }, {
            rootMargin: '100px', // Only trigger when 100px from bottom
            threshold: 0.1 // Require at least 10% visibility
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    return {
        items,
        loading,
        hasMore,
        lastElementRef,
        handleSearch,
        handleFilterChange,
        resetFilters,
        search,
        stats,
        filters,
    }
}
