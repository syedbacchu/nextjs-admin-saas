'use client'

import { useI18n } from '@/components/providers/I18nProvider'

interface Props {
    className?: string
}

export default function LanguageSwitcher({ className }: Props) {
    const { language, languages, setLanguage, t } = useI18n()

    return (
        <label className={className}>
            <span className="sr-only">{t('common', 'language')}</span>
            <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                aria-label={t('common', 'language')}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-500"
            >
                {languages.map((option) => (
                    <option key={option.code} value={option.code}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    )
}
