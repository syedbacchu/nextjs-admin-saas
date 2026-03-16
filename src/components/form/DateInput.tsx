'use client'

import { useId } from 'react'
import { useFieldValidation } from '@/hooks/useFieldValidation'
import { ValidatorFn } from '@/lib/validators'

interface DateInputProps {
    label: string
    value?: string | null
    onChange: (value: string) => void
    validators?: ValidatorFn<string>[]
    name?: string
    id?: string
    required?: boolean
}

export function DateInput({
    label,
    value,
    onChange,
    validators = [],
    name,
    id,
    required,
}: DateInputProps) {
    const { error, validate } = useFieldValidation(value, validators)
    const reactId = useId()
    const fieldId = id || `${name || 'date'}-${reactId}`

    return (
        <div className="flex w-full flex-col gap-1">
            <label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={fieldId}
                name={name}
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

interface DateTimeInputProps {
    label: string
    value?: string | null
    onChange: (value: string) => void
    validators?: ValidatorFn<string>[]
    name?: string
    id?: string
    required?: boolean
}

export function DateTimeInput({
    label,
    value,
    onChange,
    validators = [],
    name,
    id,
    required,
}: DateTimeInputProps) {
    const { error, validate } = useFieldValidation(value, validators)
    const reactId = useId()
    const fieldId = id || `${name || 'datetime'}-${reactId}`

    return (
        <div className="flex w-full flex-col gap-1">
            <label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={fieldId}
                name={name}
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
