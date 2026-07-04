'use client'

import { useState, useEffect } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'

interface FilterWithApplyProps {
    initialFilters: Record<string, string>
    onApply: (filters: Record<string, string>) => void
    onReset: () => void
    renderFilters: (args: {
        filters: Record<string, string>
        onChange: (key: string, value: string) => void
    }) => React.ReactNode
    className?: string
    filtersGridClassName?: string
    title?: string
    collapsible?: boolean
    defaultCollapsed?: boolean
}

export default function FilterWithApply({
    initialFilters,
    onApply,
    onReset,
    renderFilters,
    className = '',
    filtersGridClassName = 'md:grid-cols-2',
    title = 'Filters',
    collapsible = false,
    defaultCollapsed = false,
}: FilterWithApplyProps) {
    const [pendingFilters, setPendingFilters] = useState<Record<string, string>>(initialFilters)
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

    // Update pending filters when initialFilters change from outside
    useEffect(() => {
        setPendingFilters(initialFilters)
    }, [initialFilters])

    const handleFilterChange = (key: string, value: string) => {
        setPendingFilters((prev) => ({ ...prev, [key]: value }))
    }

    const handleApply = () => {
        onApply(pendingFilters)
        if (collapsible) {
            setIsCollapsed(true)
        }
    }

    const handleReset = () => {
        const emptyFilters = Object.keys(initialFilters).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
        setPendingFilters(emptyFilters)
        onReset()
    }

    const hasActiveFilters = Object.values(pendingFilters).some((value) => value !== '')
    const activeFilterCount = Object.values(pendingFilters).filter((value) => value !== '').length

    return (
        <div className={`w-full rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
            {/* Header */}
            <div
                className={`flex items-center justify-between border-b border-slate-200 px-4 py-3 ${collapsible ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
            >
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-50 p-1.5">
                        <Filter className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                        {hasActiveFilters && (
                            <p className="text-xs text-slate-500">{activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active</p>
                        )}
                    </div>
                </div>
                {collapsible && (
                    <button className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                        {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </button>
                )}
            </div>

            {/* Filter Content */}
            {!isCollapsed && (
                <div className="p-4">
                    <div className={`grid gap-4 ${filtersGridClassName}`}>
                        {renderFilters({
                            filters: pendingFilters,
                            onChange: handleFilterChange,
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                        >
                            <X className="h-4 w-4" />
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={handleApply}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <Filter className="h-4 w-4" />
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
