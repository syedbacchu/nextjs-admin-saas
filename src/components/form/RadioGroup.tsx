'use client'

import { useFieldValidation } from '@/hooks/useFieldValidation'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

export default function RadioGroup({
                                       label,
                                       value,
                                       options,
                                       onChange,
                                   validators = [],
                               }: any) {
    const { error, validate } = useFieldValidation(value, validators)
    const { language } = useI18n()

    return (
        <div>
            <p className="text-sm font-medium">{translateUiText(label, language)}</p>
            {options.map((o: any) => (
                <label key={o.value} className="flex items-center gap-2">
                    <input
                        type="radio"
                        value={o.value}
                        checked={value === o.value}
                        onChange={() => onChange(o.value)}
                        onBlur={validate}
                    />
                    {translateUiText(o.label, language)}
                </label>
            ))}
            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    )
}
