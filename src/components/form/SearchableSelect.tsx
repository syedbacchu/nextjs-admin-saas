'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useFieldValidation } from '@/hooks/useFieldValidation'
import { ValidatorFn } from '@/lib/validators'

interface Props {
    label: string
    value?: string | number
    options: { label: string; value: string | number }[]
    onChange: (v: any) => void
    validators?: ValidatorFn[]
    placeholder?: string
}

export default function SearchableSelect({
     label,
     value,
     options,
     onChange,
     validators = [],
     placeholder = "Select..."
 }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Use validation on the actual value prop
    const { error, validate } = useFieldValidation(value, validators)

    // Sync search text with the selected option label
    useEffect(() => {
        const selectedOption = options.find(o => o.value === value)
        if (selectedOption) {
            setSearch(selectedOption.label)
        } else if (!isOpen) {
            // Only clear if closed and no value matches (prevents clearing while typing)
            setSearch('')
        }
    }, [value, options, isOpen])

    // Filter options based on search text
    const filteredOptions = useMemo(() => {
        return options.filter(option =>
            option.label.toLowerCase().includes(search.toLowerCase())
        )
    }, [options, search])

    // Handle clicking outside to close the dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)

                // If the user typed something but didn't select, revert to the actual selected value
                const selected = options.find(o => o.value === value)
                setSearch(selected ? selected.label : '')

                validate()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [wrapperRef, value, options, validate])

    const handleSelect = (optionValue: string | number, optionLabel: string) => {
        onChange(optionValue)
        setSearch(optionLabel)
        setIsOpen(false)
        validate()
    }

    return (
        <div className="flex flex-col gap-1 relative" ref={wrapperRef}>
            <label className="text-sm font-medium">{label}</label>

            <input
                type="text"
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
                value={search}
                onClick={() => setIsOpen(true)}
                onChange={(e) => {
                    setSearch(e.target.value)
                    setIsOpen(true)
                }}
            />

            {isOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 w-full max-h-60 overflow-y-auto bg-white border rounded shadow-lg z-50">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((o) => (
                            <div
                                key={o.value}
                                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${o.value === value ? 'bg-blue-50 text-blue-600' : ''}`}
                                onClick={() => handleSelect(o.value, o.label)}
                            >
                                {o.label}
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-gray-400 text-sm">No results found</div>
                    )}
                </div>
            )}

            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    )
}