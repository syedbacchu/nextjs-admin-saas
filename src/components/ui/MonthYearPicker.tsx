'use client'

import { useState, useRef, useEffect } from 'react'

interface MonthYearPickerProps {
    value: string // Format: YYYY-MM
    onChange: (value: string) => void
    placeholder?: string
}

const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export default function MonthYearPicker({ value, onChange, placeholder = 'Select Month' }: MonthYearPickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedYear, setSelectedYear] = useState(() => {
        if (value) {
            return parseInt(value.split('-')[0])
        }
        return new Date().getFullYear()
    })
    const [selectedMonth, setSelectedMonth] = useState(() => {
        if (value) {
            return parseInt(value.split('-')[1]) - 1
        }
        return new Date().getMonth()
    })

    const pickerRef = useRef<HTMLDivElement>(null)

    // Close picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Update state when value prop changes
    useEffect(() => {
        if (value) {
            const [year, month] = value.split('-')
            setSelectedYear(parseInt(year))
            setSelectedMonth(parseInt(month) - 1)
        }
    }, [value])

    const handleMonthClick = (monthIndex: number) => {
        setSelectedMonth(monthIndex)
        const monthValue = String(monthIndex + 1).padStart(2, '0')
        const newValue = `${selectedYear}-${monthValue}`
        onChange(newValue)
        setIsOpen(false)
    }

    const handleYearChange = (delta: number) => {
        setSelectedYear(prev => prev + delta)
    }

    const formatDisplayValue = () => {
        if (!value) return placeholder
        const [year, month] = value.split('-')
        const monthName = months[parseInt(month) - 1]
        return `${monthName} ${year}`
    }

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i)

    return (
        <div ref={pickerRef} className="relative">
            {/* Input Field */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >
                {formatDisplayValue()}
            </div>

            {/* Picker Popup */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-72 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
                    {/* Year Selector */}
                    <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                        <button
                            onClick={() => handleYearChange(-1)}
                            className="rounded-md p-1 text-slate-600 hover:bg-slate-100"
                            type="button"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-lg font-semibold text-slate-900">{selectedYear}</span>
                        <button
                            onClick={() => handleYearChange(1)}
                            className="rounded-md p-1 text-slate-600 hover:bg-slate-100"
                            type="button"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Year Dropdown (Alternative) */}
                    <div className="mb-4">
                        <label className="mb-1 block text-xs font-medium text-slate-600">Or select year:</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Month Grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {months.map((month, index) => (
                            <button
                                key={month}
                                onClick={() => handleMonthClick(index)}
                                type="button"
                                className={`rounded-md py-2 text-sm font-medium transition ${
                                    selectedMonth === index
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {month}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
