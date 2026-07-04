import { bn } from '@/i18n/messages/bn'
import { en } from '@/i18n/messages/en'
import type { TranslationDictionary } from '@/i18n/messages/types'

export type {
    TranslationKey,
    TranslationNamespace,
} from '@/i18n/messages/types'
export type { TranslationDictionary } from '@/i18n/messages/types'

export const dictionaries: Record<string, TranslationDictionary> = {
    en,
    bn,
}
