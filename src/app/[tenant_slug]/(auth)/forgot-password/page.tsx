'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { forgotPasswordClient } from '@/services/auth/auth.client'

export default function ForgotPasswordPage() {
    const router = useRouter()
    const params = useParams<{ tenant_slug: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [login, setLogin] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const normalizedLogin = login.trim()
        if (!normalizedLogin) {
            toast.error('Login is required')
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

            const res = await forgotPasswordClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'OTP sent successfully')
                router.push(`/${tenantSlug}/reset-password?login=${encodeURIComponent(normalizedLogin)}`)
            } else {
                toast.error(res.message || 'Failed to send OTP')
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20 border rounded p-6 bg-white">
            <h1 className="text-xl font-bold mb-2">Forgot Password</h1>
            <p className="text-sm text-slate-600 mb-4">Enter your email or username to receive an OTP.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Username or Email"
                    className="w-full border px-3 py-2 rounded"
                />

                <button
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
                >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>

                <div className="text-right">
                    <Link href={`/${tenantSlug}/login`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        Back to login
                    </Link>
                </div>
            </form>
        </div>
    )
}
