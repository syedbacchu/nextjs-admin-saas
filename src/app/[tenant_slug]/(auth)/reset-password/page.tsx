'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { resetPasswordClient } from '@/services/auth/auth.client'

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams<{ tenant_slug: string }>()

    const tenantSlug = String(params?.tenant_slug || '').trim()
    const login = String(searchParams.get('login') || '').trim()

    const [otp, setOtp] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        if (!login) {
            toast.error('Login not found. Please request OTP again.')
            router.push(`/${tenantSlug}/forgot-password`)
            return
        }

        if (!otp.trim()) {
            toast.error('OTP is required')
            return
        }

        if (!password) {
            toast.error('Password is required')
            return
        }

        if (password !== confirmPassword) {
            toast.error('Password and confirm password do not match')
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
                toast.success(res.message || 'Password reset successful')
                router.push(`/${tenantSlug}/login`)
            } else {
                toast.error(res.message || 'Failed to reset password')
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
            <h1 className="text-xl font-bold mb-2">Reset Password</h1>
            <p className="text-sm text-slate-600 mb-4">Enter OTP and new password.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="login" value={login} />

                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    Login: {login || 'N/A'}
                </div>

                <input
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="OTP"
                    className="w-full border px-3 py-2 rounded"
                />

                <input
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="New Password"
                    className="w-full border px-3 py-2 rounded"
                />

                <input
                    name="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border px-3 py-2 rounded"
                />

                <button
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <div className="flex items-center justify-between">
                    <Link href={`/${tenantSlug}/forgot-password?login=${encodeURIComponent(login)}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        Request new OTP
                    </Link>
                    <Link href={`/${tenantSlug}/login`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        Back to login
                    </Link>
                </div>
            </form>
        </div>
    )
}
