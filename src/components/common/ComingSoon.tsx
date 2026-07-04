'use client'

import { type ComponentType } from 'react'
import { useI18n } from '@/components/providers/I18nProvider'

interface ComingSoonProps {
    title?: string
    description?: string
    icon?: ComponentType<{ className?: string }>
    estimatedTime?: string
    showContact?: boolean
    contactEmail?: string
}

export default function ComingSoon({
    title,
    description,
    icon: Icon,
    estimatedTime,
    showContact = false,
    contactEmail,
}: ComingSoonProps) {
    const { t } = useI18n()

    const defaultTitle = title || t('admin', 'comingSoon') || 'Coming Soon'
    const defaultDescription =
        description ||
        'We are working hard to bring you this feature. Stay tuned for updates!'

    return (
        <div className="flex min-h-[400px] items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl text-center">
                {/* Icon */}
                <div className="mb-6 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 p-6 dark:from-slate-800 dark:to-slate-900">
                    {Icon ? (
                        <Icon className="h-12 w-12 text-slate-600 dark:text-slate-400" />
                    ) : (
                        <svg
                            className="h-12 w-12 text-slate-600 dark:text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    )}
                </div>

                {/* Title */}
                <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
                    {defaultTitle}
                </h2>

                {/* Description */}
                <p className="mb-6 text-lg text-slate-600 dark:text-slate-400">
                    {defaultDescription}
                </p>

                {/* Estimated Time */}
                {estimatedTime && (
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>Expected: {estimatedTime}</span>
                    </div>
                )}

                {/* Contact Section */}
                {showContact && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Have questions or need this feature urgently?
                        </h3>
                        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                            We would love to hear from you. Contact us and we will prioritize this feature.
                        </p>
                        {contactEmail && (
                            <a
                                href={`mailto:${contactEmail}`}
                                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                Contact Us
                            </a>
                        )}
                    </div>
                )}

                {/* Decoration */}
                <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-400">
                    <div className="h-px w-12 bg-slate-300 dark:bg-slate-700" />
                    <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="h-px w-12 bg-slate-300 dark:bg-slate-700" />
                </div>
            </div>
        </div>
    )
}
