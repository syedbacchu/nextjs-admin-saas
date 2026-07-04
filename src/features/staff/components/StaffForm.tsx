'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createStaffClient, updateStaffClient, Staff } from '@/features/staff'
import TextInput from '@/components/form/TextInput'
import SelectInput from '@/components/form/SelectInput'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface StaffFormProps {
    tenantSlug: string
    initialData?: Partial<Staff>
    staffId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

const LOGIN_OPTIONS = [
    { label: 'Enabled', value: '1' },
    { label: 'Disabled', value: '0' },
]

export default function StaffForm({
    tenantSlug,
    initialData,
    staffId,
    submitLabel = 'Save Staff',
}: StaffFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { language } = useI18n()
    const resolvedSubmitLabel = translateUiText(submitLabel, language)

    const [name, setName] = useState(initialData?.name || '')
    const [username, setUsername] = useState(initialData?.username || '')
    const [email, setEmail] = useState(initialData?.email || '')
    const [phone, setPhone] = useState(initialData?.phone || '')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')
    const [enableLogin, setEnableLogin] = useState(initialData?.enable_login === 0 ? '0' : '1')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!name.trim()) {
            toast.error('Name is required')
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

        if (!staffId && !password.trim()) {
            toast.error('Password is required')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', name.trim())
            formData.append('email', email.trim())
            formData.append('phone', phone.trim())
            formData.append('status', status)
            formData.append('enable_login', enableLogin)

            if (username.trim()) {
                formData.append('username', username.trim())
            }

            if (password.trim()) {
                formData.append('password', password.trim())
            }

            const res = staffId
                ? await updateStaffClient(tenantSlug, staffId, formData)
                : await createStaffClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Staff saved successfully')
                router.push(`/${tenantSlug}/staff`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save staff')
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-xl font-bold text-slate-900">{resolvedSubmitLabel}</h2>
                <p className="mt-1 text-sm text-slate-600">Fill in staff details and save.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                    label="Staff Name"
                    name="name"
                    value={name}
                    onChange={setName}
                    placeholder="Staff Name"
                    required
                />
                <TextInput
                    label="Username"
                    name="username"
                    value={username}
                    onChange={setUsername}
                    placeholder="Username"
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
                    label={staffId ? 'Password (Optional)' : 'Password'}
                    name="password"
                    value={password}
                    onChange={setPassword}
                    placeholder={staffId ? 'Leave blank to keep existing password' : 'Password'}
                    type="password"
                    required={!staffId}
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
                    {loading ? translateUiText('Saving...', language) : resolvedSubmitLabel}
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${tenantSlug}/staff`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
