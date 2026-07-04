'use client'

import { useFieldValidation } from '@/hooks/useFieldValidation'
import { ValidatorFn } from '@/lib/validators'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface Props {
    label: string
    checked: boolean
    onChange: (v: boolean) => void
    validators?: ValidatorFn<boolean>[]
}

export default function Checkbox({
                                     label,
                                     checked,
                                     onChange,
                                     validators = [],
 }: Props) {
    const { error, validate } = useFieldValidation(checked, validators)
    const { language } = useI18n()

    return (
        <div>
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    onBlur={validate}
                />
                {translateUiText(label, language)}
            </label>
            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    )
}
