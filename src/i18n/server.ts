import 'server-only'

import { cookies } from 'next/headers'
import { getAvailableLanguages, LANGUAGE_COOKIE_NAME, normalizeSupportedLanguage } from '@/i18n/config'
import { getDictionary } from '@/i18n/index'

export async function getRequestLanguage() {
    const cookieStore = await cookies()
    return normalizeSupportedLanguage(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value)
}

export async function getRequestDictionary() {
    return getDictionary(await getRequestLanguage())
}

export async function getI18nState() {
    const language = await getRequestLanguage()

    return {
        language,
        languages: getAvailableLanguages(),
        dictionary: getDictionary(language),
    }
}
