'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import TextInput from '@/components/form/TextInput'
import { useI18n } from '@/components/providers/I18nProvider'
import { resetPasswordClient } from '@/features/auth'
import { translateUiText } from '@/i18n/ui'

interface ResetPasswordFormProps {
    tenantSlug: string
    login: string
}

export default function ResetPasswordForm({ tenantSlug, login }: ResetPasswordFormProps) {
    const router = useRouter()
    const [otp, setOtp] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { language } = useI18n()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!tenantSlug) {
            toast.error(translateUiText('Invalid tenant', language))
            return
        }

        if (!login) {
            toast.error(translateUiText('Login not found. Please request OTP again.', language))
            router.push(`/${tenantSlug}/forgot-password`)
            return
        }

        if (!otp.trim()) {
            toast.error(translateUiText('OTP is required', language))
            return
        }

        if (!password) {
            toast.error(translateUiText('Password is required', language))
            return
        }

        if (password !== confirmPassword) {
            toast.error(translateUiText('Password and confirm password do not match', language))
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('login', login)
            formData.append('otp', otp.trim())
            formData.append('password', password)
            formData.append('confirm_password', confirmPassword)

            const res = await resetPasswordClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || translateUiText('Password reset successful', language))
                router.push(`/${tenantSlug}/login`)
            } else {
                toast.error(res.message || translateUiText('Failed to reset password', language))
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
                <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
                    Reset credentials
                </span>
                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                        {translateUiText('Reset Password', language)}
                    </h2>
                    <p className="text-sm leading-6 text-slate-500">
                        {translateUiText('Enter OTP and new password.', language)}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <input type="hidden" name="login" value={login} />

                <div className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_60%,#ecfeff_100%)] p-5">
                    <p className="text-sm font-semibold text-slate-900">Set a new password securely</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Use the OTP you received, then create a strong new password for your admin account.
                    </p>
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">{translateUiText('Login:', language)}</span>{' '}
                        {login || translateUiText('N/A', language)}
                    </div>
                </div>

                <TextInput
                    label="OTP"
                    name="otp"
                    value={otp}
                    onChange={setOtp}
                    placeholder="OTP"
                    required
                />
                <TextInput
                    label="New Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="New Password"
                    required
                />
                <TextInput
                    label="Confirm Password"
                    name="confirm_password"
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Confirm Password"
                    required
                />

                <button
                    disabled={loading}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? translateUiText('Resetting...', language) : translateUiText('Reset Password', language)}
                </button>

                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href={`/${tenantSlug}/forgot-password?login=${encodeURIComponent(login)}`}
                        className="text-sm font-semibold text-teal-700 transition hover:text-slate-900"
                    >
                        {translateUiText('Request new OTP', language)}
                    </Link>
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
