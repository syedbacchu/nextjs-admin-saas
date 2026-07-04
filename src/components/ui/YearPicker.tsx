'use client'

import { useState, useRef, useEffect } from 'react'

interface YearPickerProps {
    value: string // Format: YYYY
    onChange: (value: string) => void
    placeholder?: string
    minYear?: number
    maxYear?: number
}

export default function YearPicker({
    value,
    onChange,
    placeholder = 'Select Year',
    minYear = 2000,
    maxYear = 2100
}: YearPickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedYear, setSelectedYear] = useState(() => {
        if (value) {
            return parseInt(value)
        }
        return new Date().getFullYear()
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
            setSelectedYear(parseInt(value))
        }
    }, [value])

    const handleYearClick = (year: number) => {
        setSelectedYear(year)
        onChange(String(year))
        setIsOpen(false)
    }

    const formatDisplayValue = () => {
        if (!value) return placeholder
        return value
    }

    // Generate range of years around the selected year
    const generateYearRange = () => {
        const years = []
        const currentYear = new Date().getFullYear()
        const rangeStart = Math.max(minYear, selectedYear - 6)
        const rangeEnd = Math.min(maxYear, selectedYear + 6)

        for (let year = rangeStart; year <= rangeEnd; year++) {
            years.push(year)
        }
        return years
    }

    const years = generateYearRange()

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
                <div className="absolute z-50 mt-1 w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
                    {/* Current Selection Display */}
                    <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                        <button
                            onClick={() => {
                                const newYear = Math.max(minYear, selectedYear - 12)
                                setSelectedYear(newYear)
                            }}
                            className="rounded-md p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="button"
                            disabled={selectedYear <= minYear}
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-lg font-semibold text-slate-900">{selectedYear}</span>
                        <button
                            onClick={() => {
                                const newYear = Math.min(maxYear, selectedYear + 12)
                                setSelectedYear(newYear)
                            }}
                            className="rounded-md p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="button"
                            disabled={selectedYear >= maxYear}
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Year Grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {years.map((year) => {
                            const isCurrentYear = year === new Date().getFullYear()
                            const isSelected = year === selectedYear

                            return (
                                <button
                                    key={year}
                                    onClick={() => handleYearClick(year)}
                                    type="button"
                                    className={`rounded-md py-2 text-sm font-medium transition ${
                                        isSelected
                                            ? 'bg-slate-900 text-white'
                                            : isCurrentYear
                                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {year}
                                </button>
                            )
                        })}
                    </div>

                    {/* Quick Select Buttons */}
                    <div className="mt-4 flex gap-2 border-t border-slate-200 pt-3">
                        <button
                            onClick={() => handleYearClick(new Date().getFullYear())}
                            type="button"
                            className="flex-1 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                        >
                            Current Year
                        </button>
                        <button
                            onClick={() => handleYearClick(new Date().getFullYear() - 1)}
                            type="button"
                            className="flex-1 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                        >
                            Last Year
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
