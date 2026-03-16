'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { loginClient } from '@/services/auth/auth.client'
import type { AuthLoginData, AuthLoginResponse } from '@/services/auth/auth.types'
import TextInput from '@/components/form/TextInput'


export default function LoginPage() {
    const router = useRouter()
    const params = useParams<{ tenant_slug: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        const normalizedLogin = login.trim()
        const normalizedPassword = password

        if (!normalizedLogin) {
            toast.error('Username or email is required')
            return
        }
        if (!normalizedPassword) {
            toast.error('Password is required')
            return
        }

        if (!tenantSlug) {
            toast.error('Invalid tenant')
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
                toast.error(res.message) // show backend validation message
            }
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Server error'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="max-w-md mx-auto mt-20 border rounded p-6">
            <h1 className="text-xl font-bold mb-4">Login to Admin Panel</h1>

            {error && (
                <p className="text-red-500 text-sm mb-3">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full bg-black text-white py-2 rounded"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="text-right">
                    <Link
                        href={`/${tenantSlug}/forgot-password`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        Forgot password?
                    </Link>
                </div>
            </form>
        </div>
    )
}
