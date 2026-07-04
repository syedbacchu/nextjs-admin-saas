'use client'

import { useState } from 'react'

interface DateRangePickerProps {
    value: { from: string; to: string }
    onChange: (value: { from: string; to: string }) => void
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
    const [fromDate, setFromDate] = useState(value.from)
    const [toDate, setToDate] = useState(value.to)

    const handleApply = () => {
        onChange({ from: fromDate, to: toDate })
    }

    const handleClear = () => {
        setFromDate('')
        setToDate('')
        onChange({ from: '', to: '' })
    }

    const handleLast7Days = () => {
        const today = new Date()
        const lastWeek = new Date(today)
        lastWeek.setDate(lastWeek.getDate() - 6)

        const from = lastWeek.toISOString().split('T')[0]
        const to = today.toISOString().split('T')[0]

        setFromDate(from)
        setToDate(to)
        onChange({ from, to })
    }

    const handleLast30Days = () => {
        const today = new Date()
        const lastMonth = new Date(today)
        lastMonth.setDate(lastMonth.getDate() - 29)

        const from = lastMonth.toISOString().split('T')[0]
        const to = today.toISOString().split('T')[0]

        setFromDate(from)
        setToDate(to)
        onChange({ from, to })
    }

    const handleThisMonth = () => {
        const today = new Date()
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)

        const from = firstDay.toISOString().split('T')[0]
        const to = today.toISOString().split('T')[0]

        setFromDate(from)
        setToDate(to)
        onChange({ from, to })
    }

    const handleLastMonth = () => {
        const today = new Date()
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

        const from = firstDayLastMonth.toISOString().split('T')[0]
        const to = lastDayLastMonth.toISOString().split('T')[0]

        setFromDate(from)
        setToDate(to)
        onChange({ from, to })
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">From Date</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">To Date</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleApply}
                    className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    Apply Range
                </button>
                <button
                    onClick={handleClear}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    Clear
                </button>
            </div>

            {/* Quick Select Options */}
            <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                <span className="text-xs font-medium text-slate-600">Quick Select:</span>
                <button
                    onClick={handleLast7Days}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                    Last 7 Days
                </button>
                <button
                    onClick={handleLast30Days}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                    Last 30 Days
                </button>
                <button
                    onClick={handleThisMonth}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                    This Month
                </button>
                <button
                    onClick={handleLastMonth}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                    Last Month
                </button>
            </div>
        </div>
    )
}
