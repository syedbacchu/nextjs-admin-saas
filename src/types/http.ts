export type RequestConfig<T = any> = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    url: string
    params?: Record<string, any>
    data?: any
    headers?: Record<string, string>
    server?: boolean
    includeServerSecret?: boolean
    includeAuthToken?: boolean
    responseType?: T
}
