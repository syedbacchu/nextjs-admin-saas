'use client'

import { useFieldValidation } from '@/hooks/useFieldValidation'

export function DateInput({ label, value, onChange, validators = [] }: any) {
    const { error, validate } = useFieldValidation(value, validators)

    return (
        <div className="flex w-full flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
                type="date"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                onBlur={validate}
                className={`w-full rounded border px-3 py-2 transition-all focus:outline-none focus:ring ${
                    error ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:border-blue-500'
                }`}
            />
            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    )
}

export function DateTimeInput({ label, value, onChange, validators = [] }: any) {
    const { error, validate } = useFieldValidation(value, validators)

    return (
        <div className="flex w-full flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
                type="datetime-local"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                onBlur={validate}
                className={`w-full rounded border px-3 py-2 transition-all focus:outline-none focus:ring ${
                    error ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:border-blue-500'
                }`}
            />
            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    )
}
