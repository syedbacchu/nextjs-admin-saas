export function objectToFormData(obj: Record<string, any>): FormData {
    const formData = new FormData()

    Object.entries(obj).forEach(([key, value]) => {
        // 1. Skip null/undefined
        if (value === null || value === undefined) return

        // 2. Handle File (append directly)
        if (value instanceof File) {
            formData.append(key, value)
        }
        // 3. Handle Boolean (convert to 1/0 for backend)
        else if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0')
        }
        // 4. Handle standard values (string/number)
        else {
            formData.append(key, String(value))
        }
    })

    return formData
}