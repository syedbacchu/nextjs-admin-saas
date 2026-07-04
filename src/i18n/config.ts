export type LanguageOption = {
    code: string
    label: string
}

export const LANGUAGE_COOKIE_NAME = 'site_language'

const FALLBACK_LANGUAGES: LanguageOption[] = [
    { code: 'en', label: 'English' },
    { code: 'bn', label: 'Bangla' },
]

function normalizeLanguageCode(value: string) {
    return value.trim().toLowerCase()
}

function parseLanguagesEnv(value?: string): LanguageOption[] {
    if (!value?.trim()) return FALLBACK_LANGUAGES

    const parsed = value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
            const [rawCode, ...labelParts] = entry.split(':')
            const code = normalizeLanguageCode(rawCode || '')
            const label = labelParts.join(':').trim()

            if (!code || !label) return null

            return { code, label }
        })
        .filter((entry): entry is LanguageOption => Boolean(entry))

    return parsed.length > 0 ? parsed : FALLBACK_LANGUAGES
}

export function getAvailableLanguages(): LanguageOption[] {
    return parseLanguagesEnv(process.env.APP_LANGUAGES)
}

export function getDefaultLanguage(): string {
    const languages = getAvailableLanguages()
    const fallback = languages[0]?.code || 'en'
    const configured = normalizeLanguageCode(process.env.APP_DEFAULT_LANGUAGE || '')

    return languages.some((language) => language.code === configured) ? configured : fallback
}

export function isSupportedLanguage(value?: string | null): value is string {
    if (!value) return false

    const code = normalizeLanguageCode(value)
    return getAvailableLanguages().some((language) => language.code === code)
}

export function normalizeSupportedLanguage(value?: string | null) {
    if (!value) return getDefaultLanguage()

    const code = normalizeLanguageCode(value)
    return isSupportedLanguage(code) ? code : getDefaultLanguage()
}
