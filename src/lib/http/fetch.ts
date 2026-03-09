import { API_HEADERS } from '@/constants/api'

export interface FetchArgs {
    method: string
    url: string
    params?: Record<string, any>
    data?: any
    headers?: HeadersInit
}

export async function apiFetchClient({
     method,
     url,
     params,
     data,
     headers: customHeaders = {},
 }: FetchArgs): Promise<Response> {

    // Client-side always uses public URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    if (!baseUrl) throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined')

    const queryParams = new URLSearchParams()
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null) return
            queryParams.append(key, String(value))
        })
    }
    const queryString = queryParams.toString()
    const query = queryString ? `?${queryString}` : ''
    const fullUrl = `${baseUrl}${url}${query}`

    const headers: Record<string, string> = {
        ...API_HEADERS(false),
        ...(customHeaders as Record<string, string>),
    }

    let body: BodyInit | undefined = undefined

    if (data instanceof FormData) {
        body = data
        // Browser handles boundary automatically
    } else if (data) {
        body = JSON.stringify(data)
        headers['Content-Type'] = 'application/json'
    }

    return fetch(fullUrl, {
        method,
        headers,
        body,
        cache: 'no-store',
    })
}
