'use client'

import { useState } from 'react'

interface Props {
    label: string
    name: string
    value?: string | null
    onChange: (value: string) => void
    error?: string
    textarea?: boolean

    // ✅ New Props
    placeholder?: string
    helpText?: string

    // Validation props
    required?: boolean
    type?: 'text' | 'number' | 'tel' | 'email' | 'password'
    maxLength?: number
    minLength?: number
    pattern?: RegExp
    noSpace?: boolean
    allowOnlyNumber?: boolean
    validators?: Array<(value: string) => string | null>
}

export default function TextInput({
                                      label,
                                      name,
                                      value,
                                      onChange,
                                      error,
                                      textarea,
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
                                  }: Props) {
    const [localError, setLocalError] = useState<string | null>(null)

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
            setLocalError('This field is required')
            return
        }

        if (minLength && valToCheck.length < minLength) {
            setLocalError(`Minimum ${minLength} characters required`)
            return
        }

        if (pattern && !pattern.test(valToCheck)) {
            setLocalError('Invalid format')
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

    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {textarea ? (
                <textarea
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={`border rounded px-3 py-2 focus:outline-none focus:ring transition-all
                        ${activeError ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:border-blue-500'}
                    `}
                    rows={4}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={`border rounded px-3 py-2 focus:outline-none focus:ring transition-all
                        ${activeError ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:border-blue-500'}
                    `}
                />
            )}

            {/* Logic: Show Error if exists, otherwise show Help Text */}
            {activeError ? (
                <span className="text-red-500 text-xs animate-pulse">{activeError}</span>
            ) : helpText ? (
                <span className="text-gray-500 text-xs">{helpText}</span>
            ) : null}
        </div>
    )
}