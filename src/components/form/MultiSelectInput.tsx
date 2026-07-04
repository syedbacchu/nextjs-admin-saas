'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface MultiSelectOption {
    label: string
    value: string | number
}

interface MultiSelectInputProps {
    label: string
    value: string[]
    options: MultiSelectOption[]
    onChange: (value: string[]) => void
    name?: string
    id?: string
    required?: boolean
    helpText?: string
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
}

export default function MultiSelectInput({
    label,
    value,
    options,
    onChange,
    name,
    id,
    required,
    helpText = 'Search and select multiple items',
    placeholder = 'Select items',
    searchPlaceholder = 'Search...',
    emptyText = 'No options found',
}: MultiSelectInputProps) {
    const reactId = useId()
    const fieldId = id || `${name || 'multi-select'}-${reactId}`
    const rootRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const { language } = useI18n()

    const translatedLabel = translateUiText(label, language)
    const translatedHelpText = translateUiText(helpText, language)
    const translatedPlaceholder = translateUiText(placeholder, language)
    const translatedSearchPlaceholder = translateUiText(searchPlaceholder, language)
    const translatedEmptyText = translateUiText(emptyText, language)

    const selectedOptions = useMemo(() => {
        const selectedSet = new Set(value.map((item) => String(item)))
        return options.filter((option) => selectedSet.has(String(option.value)))
    }, [options, value])

    const filteredOptions = useMemo(() => {
        const term = search.trim().toLowerCase()
        if (!term) return options
        return options.filter((option) => {
            const labelText = translateUiText(option.label, language).toLowerCase()
            const valueText = String(option.value).toLowerCase()
            return labelText.includes(term) || valueText.includes(term)
        })
    }, [language, options, search])

    useEffect(() => {
        if (!open) return

        function handleOutsideClick(event: MouseEvent) {
            if (!rootRef.current) return
            if (event.target instanceof Node && !rootRef.current.contains(event.target)) {
                setOpen(false)
                setSearch('')
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setOpen(false)
                setSearch('')
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [open])

    useEffect(() => {
        if (open) {
            searchInputRef.current?.focus()
            searchInputRef.current?.select()
        }
    }, [open])

    function toggleOption(optionValue: string) {
        const nextValue = value.includes(optionValue)
            ? value.filter((item) => item !== optionValue)
            : [...value, optionValue]
        onChange(nextValue)
    }

    function handleToggleOpen() {
        setOpen((current) => {
            const next = !current
            if (!next) setSearch('')
            return next
        })
    }

    const summaryText = selectedOptions.length > 0
        ? selectedOptions.map((option) => translateUiText(option.label, language)).join(', ')
        : translatedPlaceholder

    return (
        <div ref={rootRef} className="relative flex w-full flex-col gap-1">
            <label id={`${fieldId}-label`} className="text-sm font-medium text-gray-700">
                {translatedLabel} {required && <span className="text-red-500">*</span>}
            </label>

            <button
                id={fieldId}
                type="button"
                name={name}
                aria-labelledby={`${fieldId}-label`}
                onClick={handleToggleOpen}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`flex w-full items-center justify-between gap-3 rounded border bg-white px-3 py-2 text-left text-sm transition-all focus:outline-none focus:ring ${
                    open ? 'border-blue-500 ring-blue-100' : 'border-gray-300 hover:border-gray-400'
                }`}
            >
                <span className={`block min-w-0 flex-1 truncate ${selectedOptions.length > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                    {summaryText}
                </span>
                <span className="flex h-5 w-5 shrink-0 items-center justify-center text-gray-400">⌄</span>
            </button>

            {open && (
                <div className="absolute left-0 top-full z-30 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-2xl">
                    <div className="border-b border-gray-100 p-3">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={translatedSearchPlaceholder}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                        />
                    </div>

                    <div className="max-h-72 overflow-y-auto p-2">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const optionValue = String(option.value)
                                const selected = value.includes(optionValue)

                                return (
                                    <button
                                        key={optionValue}
                                        type="button"
                                        onClick={() => toggleOption(optionValue)}
                                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                                            selected
                                                ? 'bg-blue-500 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="min-w-0 flex-1 truncate">
                                            {translateUiText(option.label, language)}
                                        </span>
                                        <span className={`shrink-0 text-sm font-semibold ${selected ? 'text-white' : 'text-transparent'}`}>
                                            ✓
                                        </span>
                                    </button>
                                )
                            })
                        ) : (
                            <div className="px-3 py-8 text-center text-sm text-gray-500">
                                {translatedEmptyText}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <span className="text-xs text-gray-500">{translatedHelpText}</span>
        </div>
    )
}
