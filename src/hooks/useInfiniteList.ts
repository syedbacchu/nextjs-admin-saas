'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseInfiniteListProps<T> {
    fetchData: (page: number, search: string) => Promise<any> // Your service call
}

export function useInfiniteList<T>({ fetchData }: UseInfiniteListProps<T>) {
    const [items, setItems] = useState<T[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [search, setSearch] = useState('')
    const [stats, setStats] = useState<{ total: number, active_count: number, paid_count: number } | null>(null)

    // To prevent race conditions
    const isFetching = useRef(false)

    // 1. Debounced Search Handler
    const handleSearch = (text: string) => {
        setSearch(text)
        setPage(1) // Reset to page 1
        setItems([]) // Clear current list
        setHasMore(true)
    }

    // 2. Main Fetch Function
    const loadItems = useCallback(async () => {
        if (isFetching.current || (!hasMore && page !== 1)) return

        setLoading(true)
        isFetching.current = true

        try {
            const res = await fetchData(page, search)

            if (res.success) {
                const newData = res.data.data
                const totalPages = res.data.total_page

                setItems((prev) => (page === 1 ? newData : [...prev, ...newData]))
                setHasMore(page < totalPages)
                if (res.data?.stats) {
                    setStats(res.data.stats)
                }
            }
        } catch (error) {
            console.error('Failed to load list', error)
        } finally {
            setLoading(false)
            isFetching.current = false
        }
    }, [page, search, fetchData]) // Remove hasMore from deps to avoid stale closures if logic changes

    // 3. Trigger Fetch on dependency change
    useEffect(() => {
        loadItems()
    }, [loadItems])

    // 4. Infinite Scroll Observer Ref
    const observer = useRef<IntersectionObserver | null>(null)
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prev) => prev + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    return {
        items,
        loading,
        hasMore,
        lastElementRef,
        handleSearch,
        search,
        stats
    }
}