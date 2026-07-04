'use client'

import { useId, useState } from 'react'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface Props {
    label: string
    name: string
    value?: string | null
    onChange: (value: string) => void
    error?: string
    textarea?: boolean
    readOnly?: boolean

    // ✅ New Props
    placeholder?: string
    helpText?: string

    // Validation props
    required?: boolean
    type?: 'text' | 'number' | 'tel' | 'email' | 'password' | 'month' | 'date' | 'time'
    maxLength?: number
    minLength?: number
    pattern?: RegExp
    noSpace?: boolean
    allowOnlyNumber?: boolean
    validators?: Array<(value: string) => string | null>
    id?: string
    rows?: number
}

export default function TextInput({
                                      label,
                                      name,
                                      value,
                                      onChange,
                                      error,
                                      textarea,
                                      readOnly,
                                      placeholder, // Destructured
                                      helpText,    // Destructured
                                      required,
                                      type = 'text',
                                      maxLength,
                                      minLength,
                                      pattern,
                                      noSpace,
                                      allowOnlyNumber,
                                      validators = [],
                                      id,
                                      rows = 4,
                                  }: Props) {
    const [localError, setLocalError] = useState<string | null>(null)
    const reactId = useId()
    const fieldId = id || `${name}-${reactId}`
    const { language, t } = useI18n()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let val = e.target.value

        if (noSpace) val = val.replace(/\s/g, '')
        if (allowOnlyNumber) val = val.replace(/\D/g, '')
        if (maxLength) val = val.slice(0, maxLength)

        onChange(val)

        if (localError) setLocalError(null)
    }

    const handleBlur = () => {
        const valToCheck = value || ''

        if (required && !valToCheck) {
            setLocalError(t('validation', 'required'))
            return
        }

        if (minLength && valToCheck.length < minLength) {
            setLocalError(t('validation', 'minCharacters', { count: minLength }))
            return
        }

        if (pattern && !pattern.test(valToCheck)) {
            setLocalError(t('validation', 'invalidFormat'))
            return
        }

        if (validators && validators.length > 0) {
            for (const validate of validators) {
                const msg = validate(valToCheck)
                if (msg) {
                    setLocalError(msg)
                    return
                }
            }
        }

        setLocalError(null)
    }

    // Determine if we have an active error (prop or local)
    const activeError = error || localError
    const translatedLabel = translateUiText(label, language)
    const translatedPlaceholder = placeholder ? translateUiText(placeholder, language) : undefined
    const translatedHelpText = helpText ? translateUiText(helpText, language) : undefined

    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
                {translatedLabel} {required && <span className="text-red-500">*</span>}
            </label>

            {textarea ? (
                <textarea
                    id={fieldId}
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly={readOnly}
                    placeholder={translatedPlaceholder}
                    className={`border rounded px-3 py-2 focus:outline-none focus:ring transition-all
                        w-full
                        ${readOnly ? 'bg-slate-50 cursor-not-allowed' : ''}
                        ${activeError ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:border-blue-500'}
                    `}
                    rows={rows}
                />
            ) : (
                <input
                    id={fieldId}
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly={readOnly}
                    placeholder={translatedPlaceholder}
                    className={`border rounded px-3 py-2 focus:outline-none focus:ring transition-all
                        w-full
                        ${readOnly ? 'bg-slate-50 cursor-not-allowed' : ''}
                        ${activeError ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:border-blue-500'}
                    `}
                />
            )}

            {/* Logic: Show Error if exists, otherwise show Help Text */}
            {activeError ? (
                <span className="text-red-500 text-xs animate-pulse">{activeError}</span>
            ) : translatedHelpText ? (
                <span className="text-gray-500 text-xs">{translatedHelpText}</span>
            ) : null}
        </div>
    )
}
