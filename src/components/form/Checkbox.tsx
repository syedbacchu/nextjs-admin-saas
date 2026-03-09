'use client'

import { useFieldValidation } from '@/hooks/useFieldValidation'
import { ValidatorFn } from '@/lib/validators'

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

    return (
        <div>
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    onBlur={validate}
                />
                {label}
            </label>
            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    )
}
