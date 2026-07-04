'use server'

import {RequestConfig} from "@/types/http";
import {apiFetchServer} from "@/lib/http/fetch-server";
import {ApiResponse} from "@/types/api";

export async function request<T>({
     method,
     url,
     params,
     data,
     headers,
     includeServerSecret,
     includeAuthToken,
 }: RequestConfig): Promise<ApiResponse<T>> {
    const res = await apiFetchServer({
        method,
        url,
        params,
        data,
        headers,
        includeServerSecret,
        includeAuthToken,
    })

    const json = await res.json().catch(() => null)

    if (res.status >= 500) {
        // throw new Error(json?.message || 'Internal server error')
        return json
    }
    return json
}
