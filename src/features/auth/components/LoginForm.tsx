'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import TextInput from '@/components/form/TextInput'
import { useI18n } from '@/components/providers/I18nProvider'
import type { AuthLoginData, AuthLoginResponse } from '@/features/auth'
import { translateUiText } from '@/i18n/ui'
import {loginClient} from "@/actions/auth.client";

interface LoginFormProps {
    tenantSlug: string
}

export default function LoginForm({ tenantSlug }: LoginFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const { language } = useI18n()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const normalizedLogin = login.trim()
        const normalizedPassword = password

        if (!normalizedLogin) {
            toast.error(translateUiText('Username or email is required', language))
            return
        }
        if (!normalizedPassword) {
            toast.error(translateUiText('Password is required', language))
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
            formData.append('password', normalizedPassword)
            const res = await loginClient(tenantSlug, formData) as AuthLoginResponse

            if (res.success) {
                toast.success(res.message)
                const loginData = res.data as AuthLoginData
                const resolvedTenantSlug =
                    typeof loginData?.tenant?.company_username === 'string' && loginData.tenant.company_username.trim()
                        ? loginData.tenant.company_username.trim()
                        : tenantSlug
                router.push(`/${resolvedTenantSlug}`)
            } else {
                toast.error(res.message)
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
                <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
                    Admin access
                </span>
                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                        {translateUiText('Login to Admin Panel', language)}
                    </h2>
                    <p className="text-sm leading-6 text-slate-500">
                        {translateUiText('Use your username or email and password to enter the dashboard.', language)}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <TextInput
                    label="Username or Email"
                    name="login"
                    value={login}
                    onChange={setLogin}
                    placeholder="Username or Email"
                    required
                />
                <TextInput
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Password"
                    required
                />

                <button
                    disabled={loading}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-purple-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? translateUiText('Logging in...', language) : translateUiText('Login', language)}
                </button>

                <div className="flex items-center justify-end">
                    <Link
                        href={`/${tenantSlug}/forgot-password`}
                        className="text-sm font-semibold text-teal-700 transition hover:text-slate-900"
                    >
                        {translateUiText('Forgot password?', language)}
                    </Link>
                </div>
            </form>
        </div>
    )
}
