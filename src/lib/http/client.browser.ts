import axios from 'axios'
import { API_HEADERS, resolveClientLanguage } from '@/constants/api'

export const browserClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: API_HEADERS(false),
})

browserClient.interceptors.request.use((config) => {
    config.headers = config.headers || {}
    config.headers.lang = resolveClientLanguage(typeof document === 'undefined' ? undefined : document.cookie)
    return config
})
