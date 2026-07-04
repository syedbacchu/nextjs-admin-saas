'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { LanguageOption } from '@/i18n/config'
import { LANGUAGE_COOKIE_NAME } from '@/i18n/config'
import { interpolate } from '@/i18n'
import type { TranslationDictionary } from '@/i18n/dictionaries'

type Params = Record<string, string | number>

type I18nContextValue = {
    dictionary: TranslationDictionary
    language: string
    languages: LanguageOption[]
    setLanguage: (value: string) => void
    t: <N extends keyof TranslationDictionary>(namespace: N, key: keyof TranslationDictionary[N], params?: Params) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

interface Props {
    children: React.ReactNode
    dictionary: TranslationDictionary
    language: string
    languages: LanguageOption[]
}

export default function I18nProvider({ children, dictionary, language, languages }: Props) {
    const router = useRouter()
    const [currentLanguage, setCurrentLanguage] = useState(language)

    const value = useMemo<I18nContextValue>(() => ({
        dictionary,
        language: currentLanguage,
        languages,
        setLanguage: (nextLanguage: string) => {
            document.cookie = `${LANGUAGE_COOKIE_NAME}=${nextLanguage}; path=/; max-age=31536000; samesite=lax`
            setCurrentLanguage(nextLanguage)
            router.refresh()
        },
        t: (namespace, key, params) => {
            const template = String(dictionary[namespace][key])
            return interpolate(template, params)
        },
    }), [currentLanguage, dictionary, languages, router])

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
    const context = useContext(I18nContext)

    if (!context) {
        throw new Error('useI18n must be used within I18nProvider')
    }

    return context
}
