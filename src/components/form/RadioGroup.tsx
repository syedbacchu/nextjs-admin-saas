'use client'

import { useFieldValidation } from '@/hooks/useFieldValidation'

export default function RadioGroup({
                                       label,
                                       value,
                                       options,
                                       onChange,
                                       validators = [],
                                   }: any) {
    const { error, validate } = useFieldValidation(value, validators)

    return (
        <div>
            <p className="text-sm font-medium">{label}</p>
            {options.map((o: any) => (
                <label key={o.value} className="flex items-center gap-2">
                    <input
                        type="radio"
                        value={o.value}
                        checked={value === o.value}
                        onChange={() => onChange(o.value)}
                        onBlur={validate}
                    />
                    {o.label}
                </label>
            ))}
            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    )
}
