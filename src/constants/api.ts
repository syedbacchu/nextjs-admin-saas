import { getDefaultLanguage, LANGUAGE_COOKIE_NAME, normalizeSupportedLanguage } from '@/i18n/config'

export const API_CONFIG = {
    BASE_URL: process.env.API_BASE_URL!,
    SECRET: process.env.API_USER_SECRET!,
    LANG: process.env.API_LANG ?? 'en',
}

export const API_HEADERS = (server = false, language?: string) => ({
    Accept: 'application/json',
    lang: normalizeSupportedLanguage(language) || getDefaultLanguage(),
    ...(server && { userapisecret: process.env.API_USER_SECRET }), // only added if server
})

export function resolveClientLanguage(cookieHeader?: string) {
    if (!cookieHeader) return getDefaultLanguage()

    const cookieEntry = cookieHeader
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${LANGUAGE_COOKIE_NAME}=`))

    const cookieValue = cookieEntry?.split('=').slice(1).join('=')
    return normalizeSupportedLanguage(cookieValue)
}
