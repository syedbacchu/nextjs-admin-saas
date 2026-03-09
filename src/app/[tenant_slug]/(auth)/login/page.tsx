'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner';
import {loginClient} from "@/services/auth/auth.client";
import type { AuthLoginData, AuthLoginResponse } from '@/services/auth/auth.types'


export default function LoginPage() {
    const router = useRouter()
    const params = useParams<{ tenant_slug: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)

        if (!tenantSlug) {
            toast.error('Invalid tenant')
            setLoading(false)
            return
        }

        try {
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
                <input
                    name="login"
                    placeholder="Username or Email"
                    // required
                    className="w-full border px-3 py-2 rounded"
                />

                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    // required
                    className="w-full border px-3 py-2 rounded"
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
