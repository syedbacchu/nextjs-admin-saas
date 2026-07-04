'use client'

import { useState } from 'react'

interface YearRangePickerProps {
    value: { from: string; to: string }
    onChange: (value: { from: string; to: string }) => void
}

export default function YearRangePicker({ value, onChange }: YearRangePickerProps) {
    const [fromYear, setFromYear] = useState(value.from)
    const [toYear, setToYear] = useState(value.to)

    const handleApply = () => {
        onChange({ from: fromYear, to: toYear })
    }

    const handleClear = () => {
        setFromYear('')
        setToYear('')
        onChange({ from: '', to: '' })
    }

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i) // Last 50 years

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">From Year</label>
                    <select
                        value={fromYear}
                        onChange={(e) => setFromYear(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">Select Year</option>
                        {years.map((year) => (
                            <option key={year} value={String(year)}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">To Year</label>
                    <select
                        value={toYear}
                        onChange={(e) => setToYear(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">Select Year</option>
                        {years.map((year) => (
                            <option key={year} value={String(year)}>
                                {year}
                            </option>
                        ))}
                    </select>
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
        </div>
    )
}
