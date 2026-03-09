'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner';
import {loginClient} from "@/actions/auth.client";
import {useAuthStore} from "@/stores/auth.store";


export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)

        try {
            const res = await loginClient(formData)

            if (res.success) {
                toast.success(res.message)
                useAuthStore.getState().setUser(res.data.user)
                router.push('/admin/profile/update')
            } else {
                toast.error(res.message) // show backend validation message
            }
        } catch (e: any) {
            toast.error(e.message || 'Server error')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="max-w-md mx-auto mt-20 border rounded p-6">
            <h1 className="text-xl font-bold mb-4">Login to SetMyScore</h1>

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
            </form>
        </div>
    )
}
