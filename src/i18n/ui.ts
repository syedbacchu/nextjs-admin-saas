import { normalizeSupportedLanguage } from '@/i18n/config'
import { bnUiTranslations } from '@/i18n/ui-translations/bn'
import { enUiTranslations } from '@/i18n/ui-translations/en'
import type { UiTranslationBundle } from '@/i18n/ui-translations/types'

const UI_TRANSLATIONS: Record<string, UiTranslationBundle> = {
    en: enUiTranslations,
    bn: bnUiTranslations,
}

function getBundle(language?: string) {
    return UI_TRANSLATIONS[normalizeSupportedLanguage(language)] || enUiTranslations
}

function translateResource(bundle: UiTranslationBundle, value: string) {
    return bundle.resourceSingular?.[value] || bundle.resourcePlural?.[value] || bundle.exact[value]
}

export function translateUiText(text: string, language?: string) {
    if (!text) return text

    const bundle = getBundle(language)
    const exact = bundle.exact[text]
    if (exact) return exact

    const resourceOnly = translateResource(bundle, text)
    if (resourceOnly) return resourceOnly

    const createMatch = text.match(/^Create (.+)$/)
    if (createMatch && bundle.templates?.create) {
        return bundle.templates.create(translateResource(bundle, createMatch[1]) || createMatch[1])
    }

    const updateMatch = text.match(/^Update (.+)$/)
    if (updateMatch && bundle.templates?.update) {
        return bundle.templates.update(translateResource(bundle, updateMatch[1]) || updateMatch[1])
    }

    const saveMatch = text.match(/^Save (.+)$/)
    if (saveMatch && bundle.templates?.save) {
        return bundle.templates.save(translateResource(bundle, saveMatch[1]) || saveMatch[1])
    }

    const addMatch = text.match(/^Add (.+)$/)
    if (addMatch && bundle.templates?.add) {
        return bundle.templates.add(translateResource(bundle, addMatch[1]) || addMatch[1])
    }

    const detailsMatch = text.match(/^(.+) Details$/)
    if (detailsMatch && bundle.templates?.details) {
        return bundle.templates.details(translateResource(bundle, detailsMatch[1]) || detailsMatch[1])
    }

    const managementMatch = text.match(/^(.+) Management$/)
    if (managementMatch && bundle.templates?.management) {
        return bundle.templates.management(translateResource(bundle, managementMatch[1]) || managementMatch[1])
    }

    const searchPrefixMatch = text.match(/^Search (.+)$/)
    if (searchPrefixMatch && bundle.templates?.search) {
        return bundle.templates.search(translateResource(bundle, searchPrefixMatch[1]) || searchPrefixMatch[1])
    }

    return text
}
