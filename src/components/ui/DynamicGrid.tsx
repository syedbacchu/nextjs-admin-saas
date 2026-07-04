'use client'

import { useInfiniteList } from '@/hooks/useInfiniteList'
import { ReactNode } from "react";

// 1. Define Valid Color Variants
type StatVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

// 2. Define the Configuration Interface
export interface StatConfig {
    key: string;       // Matches the API key (e.g., 'active_count')
    label: string;     // What to show the user (e.g., 'Active Players')
    variant?: StatVariant|'info'; // Color theme
    icon?: ReactNode;  // Optional Icon
}

interface Props<T> {
    fetchData: (page: number, search: string) => Promise<any>
    renderItem: (item: T) => ReactNode
    title?: string
    gridClassName?: string
    // 3. New Props for Dynamic Stats
    showStats?: boolean
    statsConfig?: StatConfig[]
    statsGridClassName?: string
}

// 4. Color Style Mappings (Safe for Tailwind)
const VARIANT_STYLES: Record<StatVariant, { bg: string, border: string, text: string, label: string }> = {
    default: { bg: 'bg-white', border: 'border-slate-200', text: 'text-slate-800', label: 'text-slate-400' },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', label: 'text-emerald-600' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', label: 'text-amber-600' },
    danger:  { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700', label: 'text-rose-600' },
    info:    { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', label: 'text-blue-600' },
    purple:  { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-700', label: 'text-violet-600' },
};

export default function DynamicGrid<T extends { id: number | string }>({
   fetchData,
   renderItem,
   title,
   gridClassName = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
   showStats = false,
   statsConfig = [],
   statsGridClassName // Optional override for stats grid layout
}: Props<T>) {

    const {
        items,
        loading,
        lastElementRef,
        handleSearch,
        search,
        stats
    } = useInfiniteList<T>({ fetchData })

    // Calculate generic grid cols if not provided
    const defaultStatsGrid = statsConfig.length === 4
        ? "grid-cols-2 md:grid-cols-4" // 4 items = 2x2 on mobile, 4x1 on desktop
        : "grid-cols-3"; // Default to 3 cols

    return (
        <div className="space-y-6">
            {/* DYNAMIC STATS SECTION */}
            {showStats && stats && statsConfig.length > 0 && (
                <div className={`grid gap-3 mb-2 ${statsGridClassName || defaultStatsGrid}`}>
                    {statsConfig.map((conf) => {
                        const style = VARIANT_STYLES[conf.variant || 'default'];
                        const value = (stats as Record<string, any>)[conf.key] ?? 0; // Get value from API response using key

                        return (
                            <div
                                key={conf.key}
                                className={`${style.bg} ${style.border} p-3 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center`}
                            >
                                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${style.label}`}>
                                    {conf.label}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    {conf.icon && <span className="text-lg opacity-80">{conf.icon}</span>}
                                    <span className={`text-xl md:text-2xl font-black ${style.text}`}>
                                        {value}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                {title && (
                    <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-blue-600 pl-3">
                        {title}
                    </h2>
                )}

                <div className="w-full md:w-72 relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search ..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Grid Container */}
            <div className={`grid gap-6 ${gridClassName}`}>
                {items.map((item, index) => {
                    const isLast = items.length === index + 1
                    return (
                        <div
                            key={item.id}
                            ref={isLast ? lastElementRef : null}
                            className="h-full" // Ensure card takes full height
                        >
                            {renderItem(item)}
                        </div>
                    )
                })}
            </div>

            {/* Empty State */}
            {!loading && items.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="text-slate-500 font-medium">No results found matching "{search}"</p>
                </div>
            )}

            {/* Loading Spinner */}
            {loading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}
        </div>
    )
}