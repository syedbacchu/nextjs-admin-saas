'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import TextInput from '@/components/form/TextInput'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'
import {forgotPasswordClient} from "@/features/auth";

interface ForgotPasswordFormProps {
    tenantSlug: string
}

export default function ForgotPasswordForm({ tenantSlug }: ForgotPasswordFormProps) {
    const router = useRouter()
    const [login, setLogin] = useState('')
    const [loading, setLoading] = useState(false)
    const { language } = useI18n()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const normalizedLogin = login.trim()
        if (!normalizedLogin) {
            toast.error(translateUiText('Login is required', language))
            return
        }

        if (!tenantSlug) {
            toast.error(translateUiText('Invalid tenant', language))
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('login', normalizedLogin)

            const res = await forgotPasswordClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || translateUiText('OTP sent successfully', language))
                router.push(`/${tenantSlug}/reset-password?login=${encodeURIComponent(normalizedLogin)}`)
            } else {
                toast.error(res.message || translateUiText('Failed to send OTP', language))
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : translateUiText('Server error', language)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">
                    Password recovery
                </span>
                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                        {translateUiText('Forgot Password', language)}
                    </h2>
                    <p className="text-sm leading-6 text-slate-500">
                        {translateUiText('Enter your email or username to receive an OTP.', language)}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_55%,#f0fdfa_100%)] p-5">
                    <p className="text-sm font-semibold text-slate-900">Recover your account in two quick steps</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Enter your username or email first. We will send an OTP so you can create a new password
                        securely.
                    </p>
                </div>

                <TextInput
                    label="Username or Email"
                    name="login"
                    value={login}
                    onChange={setLogin}
                    placeholder="Username or Email"
                    required
                />

                <button
                    disabled={loading}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? translateUiText('Sending OTP...', language) : translateUiText('Send OTP', language)}
                </button>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Need account access?</p>
                    <Link
                        href={`/${tenantSlug}/login`}
                        className="text-sm font-semibold text-teal-700 transition hover:text-slate-900"
                    >
                        {translateUiText('Back to login', language)}
                    </Link>
                </div>
            </form>
        </div>
    )
}
