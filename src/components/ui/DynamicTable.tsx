'use client'

import { ColumnDef } from '@/types/api'
import { useInfiniteList } from '@/hooks/useInfiniteList'
import { ReactNode } from "react";

// 1. Reusing the same Configuration Logic
type StatVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

export interface StatConfig {
    key: string;
    label: string;
    variant?: StatVariant;
    icon?: ReactNode;
}

interface Props<T> {
    fetchData: (page: number, search: string) => Promise<any>
    columns: ColumnDef<T>[]
    title?: string
    // 2. New Props for Stats
    showStats?: boolean
    statsConfig?: StatConfig[]
    statsGridClassName?: string
}

// 3. Shared Styling Map
const VARIANT_STYLES: Record<StatVariant, { bg: string, border: string, text: string, label: string }> = {
    default: { bg: 'bg-white', border: 'border-slate-200', text: 'text-slate-800', label: 'text-slate-400' },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', label: 'text-emerald-600' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', label: 'text-amber-600' },
    danger:  { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700', label: 'text-rose-600' },
    info:    { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', label: 'text-blue-600' },
    purple:  { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-700', label: 'text-violet-600' },
};

export default function DynamicTable<T extends { id: number | string }>({
    fetchData,
    columns,
    title,
    showStats = false,
    statsConfig = [],
    statsGridClassName
}: Props<T>) {

    // 4. Get 'stats' from the hook
    const {
        items,
        loading,
        lastElementRef,
        handleSearch,
        search,
        stats
    } = useInfiniteList<T>({ fetchData })

    // Auto-calculate grid layout for stats
    const defaultStatsGrid = statsConfig.length === 4
        ? "grid-cols-2 md:grid-cols-4"
        : "grid-cols-3";

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">

            {showStats && stats && statsConfig.length > 0 && (
                <div className={`grid gap-3 mb-4 ${statsGridClassName || defaultStatsGrid}`}>
                    {statsConfig.map((conf) => {
                        const style = VARIANT_STYLES[conf.variant || 'default'];
                        const value = (stats as Record<string, any>)[conf.key] ?? 0;

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
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-lg font-bold text-gray-800">{title || 'List'}</h2>
                <div className="w-full md:w-64">
                    {/* Simple search input */}
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto relative h-[600px] overflow-y-auto border rounded">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase sticky top-0 z-10">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={`px-4 py-3 font-medium ${col.className || ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {items.length > 0 ? (
                        items.map((item, index) => { // 👈 'index' comes from here
                            const isLast = items.length === index + 1
                            return (
                                <tr
                                    key={item.id}
                                    ref={isLast ? (lastElementRef as any) : null}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((col, i) => (
                                        <td key={i} className="px-4 py-3">
                                            {col.cell
                                                ? col.cell(item, index) // 👈 ✅ PASS THE INDEX HERE
                                                : (col.accessorKey ? item[col.accessorKey] as React.ReactNode : '-')}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })
                    ) : (
                        !loading && (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                                    No data found
                                </td>
                            </tr>
                        )
                    )}
                    </tbody>
                </table>

                {/* Loading Skeleton / Spinner */}
                {loading && (
                    <div className="py-4 text-center text-sm text-blue-500">
                        Loading more data...
                    </div>
                )}
            </div>
        </div>
    )
}