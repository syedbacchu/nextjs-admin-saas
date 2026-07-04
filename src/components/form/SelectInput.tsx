'use client'

import { useId } from 'react'
import { useFieldValidation } from '@/hooks/useFieldValidation'
import { ValidatorFn } from '@/lib/validators'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface Props {
    label: string
    name?: string
    value?: string | number
    options: { label: string; value: string | number }[]
    onChange: (value: string) => void
    validators?: ValidatorFn[]
    id?: string
    required?: boolean
    includeEmptyOption?: boolean
    emptyOptionLabel?: string
}

export default function SelectInput({
                                        label,
                                        name,
                                        value,
                                        options,
                                        onChange,
                                        validators = [],
                                        id,
                                        required,
                                        includeEmptyOption = true,
                                        emptyOptionLabel = 'Select',
                                    }: Props) {
    const { error, validate } = useFieldValidation(value, validators)
    const reactId = useId()
    const fieldId = id || `${name || 'select'}-${reactId}`
    const { language } = useI18n()

    return (
        <div className="flex w-full flex-col gap-1">
            <label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
                {translateUiText(label, language)} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={fieldId}
                name={name}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                onBlur={validate}
                className={`w-full rounded border px-3 py-2 transition-all focus:outline-none focus:ring ${
                    error ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:border-blue-500'
                }`}
            >
                {includeEmptyOption && <option value="">{translateUiText(emptyOptionLabel, language)}</option>}
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {translateUiText(o.label, language)}
                    </option>
                ))}
            </select>
            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    )
}
