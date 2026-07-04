import axios from 'axios'
import { cookies } from 'next/headers'
import { API_CONFIG } from '@/constants/api'
import { LANGUAGE_COOKIE_NAME, normalizeSupportedLanguage } from '@/i18n/config'

export const serverClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        Accept: 'application/json',
        userapisecret: API_CONFIG.SECRET,
        lang: API_CONFIG.LANG,
    },
})

serverClient.interceptors.request.use(async (config) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    const language = normalizeSupportedLanguage(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value)

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    config.headers.lang = language

    return config
})
