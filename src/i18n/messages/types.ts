import type { en } from '@/i18n/messages/en'

type EnglishDictionary = typeof en

export type TranslationDictionary = {
    [Namespace in keyof EnglishDictionary]: {
        [Key in keyof EnglishDictionary[Namespace]]: string
    }
}
export type TranslationNamespace = keyof TranslationDictionary
export type TranslationKey<N extends TranslationNamespace> = keyof TranslationDictionary[N]
