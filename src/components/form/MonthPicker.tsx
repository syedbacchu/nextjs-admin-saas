'use client'

import { useId, useState, useRef, useEffect } from 'react'
import { useFieldValidation } from '@/hooks/useFieldValidation'
import { ValidatorFn } from '@/lib/validators'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

interface MonthPickerProps {
    label: string
    value?: string | null // expected format "YYYY-MM"
    onChange: (value: string) => void
    validators?: ValidatorFn<string>[]
    name?: string
    id?: string
    required?: boolean
    placeholder?: string
}

export function MonthPicker({
    label,
    value,
    onChange,
    validators = [],
    name,
    id,
    required,
    placeholder = 'Select Month',
}: MonthPickerProps) {
    const { error, validate } = useFieldValidation(value || '', validators)
    const reactId = useId()
    const fieldId = id || `${name || 'month'}-${reactId}`
    const { language } = useI18n()
    
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // parse value to Year and Month
    const currentYear = new Date().getFullYear()
    let initialYear = currentYear

    if (value && /^\d{4}-\d{2}$/.test(value)) {
        initialYear = parseInt(value.split('-')[0], 10)
    }

    const [viewYear, setViewYear] = useState(initialYear)

    // Handle outside click to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleSelectMonth = (monthIndex: number) => {
        const mm = String(monthIndex + 1).padStart(2, '0')
        const yyyy = viewYear
        onChange(`${yyyy}-${mm}`)
        setIsOpen(false)
        validate()
    }

    const formattedDisplay = value && /^\d{4}-\d{2}$/.test(value) 
        ? `${MONTHS[parseInt(value.split('-')[1], 10) - 1]} ${value.split('-')[0]}`
        : ''

    return (
        <div className="relative flex w-full flex-col gap-1" ref={containerRef}>
            <label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
                {translateUiText(label, language)} {required && <span className="text-red-500">*</span>}
            </label>
            <div 
                className={`flex w-full cursor-pointer items-center justify-between rounded border px-3 py-2 bg-white transition-all ${
                    error ? 'border-red-500 ring-red-100' : 'border-gray-300 focus-within:border-blue-500'
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <input
                    id={fieldId}
                    name={name}
                    type="text"
                    readOnly
                    placeholder={translateUiText(placeholder, language)}
                    value={formattedDisplay}
                    className="w-full cursor-pointer outline-none bg-transparent"
                />
                <CalendarIcon className="h-4 w-4 text-gray-400" />
            </div>
            {error && <span className="text-red-500 text-xs">{error}</span>}

            {isOpen && (
                <div className="absolute top-full z-10 mt-1 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setViewYear(viewYear - 1) }}
                            className="rounded p-1 hover:bg-gray-100"
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <span className="font-semibold text-gray-800">{viewYear}</span>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setViewYear(viewYear + 1) }}
                            className="rounded p-1 hover:bg-gray-100"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {MONTHS.map((m, index) => {
                            const isSelected = value === `${viewYear}-${String(index + 1).padStart(2, '0')}`
                            return (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleSelectMonth(index) }}
                                    className={`rounded py-2 text-sm font-medium transition-colors ${
                                        isSelected
                                            ? 'bg-slate-900 text-white'
                                            : 'text-gray-700 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    {m}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
