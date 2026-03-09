'use client'

import { FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { changePasswordClient, updateProfileClient } from '@/services/profile/profile.client'
import type { ProfileUser } from '@/services/profile/profile.types'

interface ProfileSettingsFormProps {
    tenantSlug: string
    initialUser: ProfileUser
}

interface PasswordFormState {
    current_password: string
    new_password: string
    confirm_password: string
}

export default function ProfileSettingsForm({ tenantSlug, initialUser }: ProfileSettingsFormProps) {
    const [name, setName] = useState(initialUser.name || '')
    const [email, setEmail] = useState(initialUser.email || '')
    const [phone, setPhone] = useState(initialUser.phone || '')
    const [address, setAddress] = useState(initialUser.address || '')
    const [language, setLanguage] = useState(initialUser.language || 'en')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const [updating, setUpdating] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)
    const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
        current_password: '',
        new_password: '',
        confirm_password: '',
    })

    useEffect(() => {
        if (!imageFile) {
            setPreviewUrl(null)
            return
        }

        const objectUrl = URL.createObjectURL(imageFile)
        setPreviewUrl(objectUrl)

        return () => {
            URL.revokeObjectURL(objectUrl)
        }
    }, [imageFile])

    const avatarSrc = previewUrl || initialUser.image || '/default-user.png'

    async function handleProfileSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!name.trim()) {
            toast.error('Name is required')
            return
        }

        if (!email.trim()) {
            toast.error('Email is required')
            return
        }

        setUpdating(true)
        try {
            const formData = new FormData()
            formData.append('name', name.trim())
            formData.append('email', email.trim())
            formData.append('phone', phone.trim())
            formData.append('address', address.trim())
            formData.append('language', language.trim() || 'en')
            if (imageFile) {
                formData.append('image', imageFile)
            }

            const res = await updateProfileClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Profile updated successfully')
                setImageFile(null)
            } else {
                toast.error(res.message || 'Failed to update profile')
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setUpdating(false)
        }
    }

    async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!passwordForm.current_password) {
            toast.error('Current password is required')
            return
        }

        if (!passwordForm.new_password) {
            toast.error('New password is required')
            return
        }

        if (passwordForm.new_password !== passwordForm.confirm_password) {
            toast.error('Password and confirm password do not match')
            return
        }

        setChangingPassword(true)
        try {
            const formData = new FormData()
            formData.append('current_password', passwordForm.current_password)
            formData.append('new_password', passwordForm.new_password)
            formData.append('confirm_password', passwordForm.confirm_password)

            const res = await changePasswordClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Password changed successfully')
                setPasswordForm({
                    current_password: '',
                    new_password: '',
                    confirm_password: '',
                })
            } else {
                toast.error(res.message || 'Failed to change password')
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setChangingPassword(false)
        }
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Update Profile</h2>
                <p className="mt-1 text-sm text-slate-600">Keep your account details up to date.</p>

                <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
                    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                        <Image
                            src={avatarSrc}
                            alt={name || 'User'}
                            width={72}
                            height={72}
                            unoptimized
                            className="h-18 w-18 rounded-full border border-slate-200 object-cover"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            className="w-full text-sm md:max-w-sm"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="w-full rounded border px-3 py-2"
                        />
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full rounded border px-3 py-2"
                        />
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone"
                            className="w-full rounded border px-3 py-2"
                        />
                        <input
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            placeholder="Language"
                            className="w-full rounded border px-3 py-2"
                        />
                    </div>

                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                        className="w-full rounded border px-3 py-2"
                        rows={3}
                    />

                    <button
                        disabled={updating}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                    >
                        {updating ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
                <p className="mt-1 text-sm text-slate-600">Use a strong password for account security.</p>

                <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                    <input
                        type="password"
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, current_password: e.target.value }))}
                        placeholder="Current password"
                        className="w-full rounded border px-3 py-2"
                    />
                    <input
                        type="password"
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, new_password: e.target.value }))}
                        placeholder="New password"
                        className="w-full rounded border px-3 py-2"
                    />
                    <input
                        type="password"
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm_password: e.target.value }))}
                        placeholder="Confirm password"
                        className="w-full rounded border px-3 py-2"
                    />

                    <button
                        disabled={changingPassword}
                        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
                    >
                        {changingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </section>
        </div>
    )
}
