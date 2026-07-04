'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useFieldValidation } from '@/hooks/useFieldValidation'
import { ValidatorFn } from '@/lib/validators'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface Props {
    label: string
    name?: string
    value?: string | number
    options: { label: string; value: string | number }[]
    onChange: (v: string | number) => void
    validators?: ValidatorFn[]
    placeholder?: string
    required?: boolean
    emptyStateText?: string
    onCreateWhenEmpty?: (search: string) => boolean | Promise<boolean>
    createEmptyLabel?: string
    onSearch?: (search: string) => void | Promise<void>
    searchMinLength?: number
}

export default function SearchableSelect({
     label,
     name,
     value,
     options,
     onChange,
     validators = [],
     placeholder = "Select...",
     required,
     emptyStateText = 'No results found',
     onCreateWhenEmpty,
     createEmptyLabel = 'Create',
     onSearch,
     searchMinLength = 0,
 }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const wrapperRef = useRef<HTMLDivElement>(null)
    const { language } = useI18n()

    // Use validation on the actual value prop
    const { error, validate } = useFieldValidation(value, validators)

    // Filter options based on search text
    const filteredOptions = useMemo(() => {
        return options.filter(option =>
            translateUiText(option.label, language).toLowerCase().includes(search.toLowerCase())
        )
    }, [language, options, search])

    // Handle clicking outside to close the dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                const selected = options.find(o => String(o.value) === String(value))
                setSearch(selected ? translateUiText(selected.label, language) : '')
                validate()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [language, options, validate, value])

    const handleSelect = (optionValue: string | number, optionLabel: string) => {
        onChange(optionValue)
        setSearch(translateUiText(optionLabel, language))
        setIsOpen(false)
        validate()
    }

    const selectedLabel = options.find((o) => String(o.value) === String(value))
    const displayValue = isOpen ? search : selectedLabel ? translateUiText(selectedLabel.label, language) : ''

    return (
        <div className="flex flex-col gap-1 relative" ref={wrapperRef}>
            <label className="text-sm font-medium">
                {translateUiText(label, language)} {required && <span className="text-red-500">*</span>}
            </label>
            

            <input
                type="text"
                name={name}
                aria-required={required || undefined}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={translateUiText(placeholder, language)}
                value={displayValue}
                onClick={() => {
                    const selected = options.find((o) => String(o.value) === String(value))
                    setSearch(selected ? translateUiText(selected.label, language) : '')
                    setIsOpen(true)
                }}
                onChange={(e) => {
                    const newValue = e.target.value
                    setSearch(newValue)
                    setIsOpen(true)
                    if (!onSearch) {
                        return
                    }

                    const trimmedValue = newValue.trim()
                    if (!trimmedValue || trimmedValue.length < searchMinLength) {
                        onSearch('')
                        return
                    }

                    onSearch(trimmedValue)
                }}
            />

            {isOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 w-full max-h-60 overflow-y-auto bg-white border rounded shadow-lg z-50">
                    {filteredOptions.length > 0 ? (
                            filteredOptions.map((o) => (
                                <div
                                    key={o.value}
                                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${String(o.value) === String(value) ? 'bg-blue-50 text-blue-600' : ''}`}
                                    onClick={() => handleSelect(o.value, o.label)}
                                >
                                {translateUiText(o.label, language)}
                            </div>
                        ))
                    ) : (
                        <div className="space-y-2 px-3 py-3">
                            <div className="text-gray-400 text-sm">{translateUiText(emptyStateText, language)}</div>
                            {onCreateWhenEmpty && search.trim() && (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const created = await onCreateWhenEmpty(search.trim())
                                        if (created) {
                                            setIsOpen(false)
                                        }
                                    }}
                                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    {translateUiText(createEmptyLabel, language)} {search.trim()}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    )
}
