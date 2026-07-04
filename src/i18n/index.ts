import { dictionaries, TranslationDictionary } from '@/i18n/dictionaries'
import {
    getAvailableLanguages,
    getDefaultLanguage,
    normalizeSupportedLanguage,
} from '@/i18n/config'

export function getDictionary(language?: string): TranslationDictionary {
    const normalized = normalizeSupportedLanguage(language)
    return dictionaries[normalized] || dictionaries[getDefaultLanguage()] || dictionaries.en
}

type Params = Record<string, string | number>

export function interpolate(template: string, params?: Params) {
    if (!params) return template

    return Object.entries(params).reduce((result, [key, value]) => {
        return result.replaceAll(`{{${key}}}`, String(value))
    }, template)
}
