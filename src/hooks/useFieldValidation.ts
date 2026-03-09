import { useState } from 'react'
import { ValidatorFn } from '@/lib/validators'

export function useFieldValidation<T>(
    value: T,
    validators: ValidatorFn<T>[] = []
) {
    const [error, setError] = useState<string | null>(null)

    const validate = () => {
        for (const rule of validators) {
            const msg = rule(value)
            if (msg) {
                setError(msg)
                return false
            }
        }
        setError(null)
        return true
    }

    return { error, validate }
}
