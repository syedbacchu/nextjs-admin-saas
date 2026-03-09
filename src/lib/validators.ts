// Bangladesh mobile number validator
export function bdPhoneValidator(value: string): string | null {
    if (!value) return null

    if (!/^01[3-9]\d{8}$/.test(value)) {
        return 'Invalid Bangladeshi phone number'
    }

    if (value === '01900000000') {
        return 'This phone number is not allowed'
    }

    return null
}

export type ValidatorFn<T = any> = (value: T) => string | null

export const required = (label: string): ValidatorFn<any> => (value) =>
    value === null || value === undefined || value === ''
        ? `${label} is required`
        : null

export const minLength = (min: number): ValidatorFn<string> => (value) =>
    value && value.length < min ? `Minimum ${min} characters required` : null

export const maxLength = (max: number): ValidatorFn<string> => (value) =>
    value && value.length > max ? `Maximum ${max} characters allowed` : null

export const regex =
    (pattern: RegExp, message: string): ValidatorFn<string> =>
        (value) =>
            value && !pattern.test(value) ? message : null

// Bangladesh phone
export const bdPhone: ValidatorFn<string> = (value) => {
    if (!value) return null
    if (!/^01[3-9]\d{8}$/.test(value)) return 'Invalid BD phone number'
    if (value === '01900000000') return 'This number is not allowed'
    return null
}

// Date range
export const dateRange =
    (from: string): ValidatorFn<string> =>
        (to) =>
            from && to && new Date(to) < new Date(from)
                ? 'End date must be after start date'
                : null

export const isRequired: ValidatorFn = (value) => {
    // Checks for null, undefined, empty string, or empty array
    if (value === null || value === undefined || value === '') {
        return 'This field is required'
    }

    // Optional: Check if it's an empty array (if validating multi-selects)
    if (Array.isArray(value) && value.length === 0) {
        return 'This field is required'
    }

    return null
}

// <TextInput
//     label="Contact Number"
// name="contact_number"
// type="tel"
// maxLength={11}
// allowOnlyNumber
// required
// customValidator={bdPhoneValidator}
// onChange={(v) => setForm({ ...form, contact_number: v })}
// />

// <TextInput
//     label="Team Count"
// name="team_count"
// value={form.team_count}
// allowOnlyNumber
// onChange={(v) => setForm({ ...form, team_count: v })}
// />

// <TextInput
//     label="Slug"
// name="slug"
// value={form.slug}
// noSpace
// pattern={/^[a-z0-9-]+$/}
// onChange={(v) => setForm({ ...form, slug: v })}
// />
