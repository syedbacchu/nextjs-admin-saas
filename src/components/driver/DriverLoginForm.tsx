'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createDriverLoginClient } from '@/services/driver/driver.client'
import SelectInput from '@/components/form/SelectInput'
import TextInput from '@/components/form/TextInput'

interface DriverLoginFormProps {
    tenantSlug: string
    driverId: number | string
    initialName?: string
    initialPhone?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

const LOGIN_OPTIONS = [
    { label: 'Enabled', value: '1' },
    { label: 'Disabled', value: '0' },
]

export default function DriverLoginForm({
    tenantSlug,
    driverId,
    initialName = '',
    initialPhone = '',
}: DriverLoginFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const [name, setName] = useState(initialName)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState(initialPhone)
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('1')
    const [enableLogin, setEnableLogin] = useState('1')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSubmitError('')

        if (!name.trim()) {
            toast.error('Name is required')
            return
        }

        if (!username.trim()) {
            toast.error('Username is required')
            return
        }

        if (!email.trim()) {
            toast.error('Email is required')
            return
        }

        if (!phone.trim()) {
            toast.error('Phone is required')
            return
        }

        if (!password.trim()) {
            toast.error('Password is required')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', name.trim())
            formData.append('username', username.trim())
            formData.append('email', email.trim())
            formData.append('phone', phone.trim())
            formData.append('password', password.trim())
            formData.append('status', status)
            formData.append('enable_login', enableLogin)

            const res = await createDriverLoginClient(tenantSlug, driverId, formData)

            if (res.success) {
                toast.success(res.message || 'Driver login created successfully')
                router.push(`/${tenantSlug}/drivers/${driverId}`)
                router.refresh()
            } else {
                const message = res.message || 'Failed to create driver login'
                setSubmitError(message)
                toast.error(message)
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            setSubmitError(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-xl font-bold text-slate-900">Create Driver Login</h2>
                <p className="mt-1 text-sm text-slate-600">Create login credentials for this driver.</p>
            </div>

            {submitError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                    label="Name"
                    name="name"
                    value={name}
                    onChange={setName}
                    placeholder="Driver Name"
                    required
                />
                <TextInput
                    label="Username"
                    name="username"
                    value={username}
                    onChange={setUsername}
                    placeholder="Username"
                    required
                />
                <TextInput
                    label="Email"
                    name="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Email"
                    type="email"
                    required
                />
                <TextInput
                    label="Phone"
                    name="phone"
                    value={phone}
                    onChange={setPhone}
                    placeholder="Phone"
                    required
                />
                <TextInput
                    label="Password"
                    name="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Password"
                    type="password"
                    required
                />
                <SelectInput
                    label="Status"
                    name="status"
                    value={status}
                    options={STATUS_OPTIONS}
                    onChange={setStatus}
                    includeEmptyOption={false}
                />
                <SelectInput
                    label="Enable Login"
                    name="enable_login"
                    value={enableLogin}
                    options={LOGIN_OPTIONS}
                    onChange={setEnableLogin}
                    includeEmptyOption={false}
                />
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                >
                    {loading ? 'Creating...' : 'Create Login'}
                </button>
                <button
                    type="button"
                    onClick={() => router.push(`/${tenantSlug}/drivers/${driverId}`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
