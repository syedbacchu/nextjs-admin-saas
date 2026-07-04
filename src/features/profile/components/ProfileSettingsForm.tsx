'use client'

import { FormEvent, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { changePasswordClient, updateProfileClient } from '@/features/profile'
import type { ProfileUser } from '@/features/profile'
import TextInput from '@/components/form/TextInput'
import ImagePickerField from '@/components/form/ImagePickerField'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'
import { getFilesAction } from '@/features/files'
import type { FileSystemItem } from '@/features/files'

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
    const { language: currentLanguage } = useI18n()
    const [name, setName] = useState(initialUser.name || '')
    const [email, setEmail] = useState(initialUser.email || '')
    const [phone, setPhone] = useState(initialUser.phone || '')
    const [address, setAddress] = useState(initialUser.address || '')
    const [language, setLanguage] = useState(initialUser.language || 'en')
    const [image, setImage] = useState(initialUser.image || '')
    const [initialFiles, setInitialFiles] = useState<FileSystemItem[]>([])

    const [updating, setUpdating] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)
    const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
        current_password: '',
        new_password: '',
        confirm_password: '',
    })

    // Load initial files for the file manager
    useEffect(() => {
        async function loadFiles() {
            try {
                const res = await getFilesAction(tenantSlug, 1, '')
                if (res.success) {
                    setInitialFiles(res.data?.data || [])
                }
            } catch (error) {
                console.error('Failed to load files:', error)
            }
        }
        void loadFiles()
    }, [tenantSlug])

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
            if (image) {
                formData.append('image', image)
            }

            const res = await updateProfileClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Profile updated successfully')
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
        <div className="mx-auto space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">{translateUiText('Update Profile', currentLanguage)}</h2>
                <p className="mt-1 text-sm text-slate-600">{translateUiText('Keep your account details up to date.', currentLanguage)}</p>

                <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
                    <div className="w-full md:max-w-sm">
                        <ImagePickerField
                            tenantSlug={tenantSlug}
                            label="Profile Image"
                            value={image}
                            onChange={setImage}
                            initialFiles={initialFiles}
                            placeholder="Select profile image from file manager"
                            triggerLabel="Choose Image"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <TextInput
                            label="Name"
                            name="name"
                            value={name}
                            onChange={setName}
                            placeholder="Name"
                            required
                        />
                        <TextInput
                            label="Email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="Email"
                            required
                        />
                        <TextInput
                            label="Phone"
                            name="phone"
                            value={phone}
                            onChange={setPhone}
                            placeholder="Phone"
                        />
                        <TextInput
                            label="Language"
                            name="language"
                            value={language}
                            onChange={setLanguage}
                            placeholder="Language"
                        />
                    </div>

                    <TextInput
                        label="Address"
                        name="address"
                        value={address}
                        onChange={setAddress}
                        placeholder="Address"
                        textarea
                        rows={3}
                    />

                    <button
                        disabled={updating}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                    >
                        {updating ? translateUiText('Updating...', currentLanguage) : translateUiText('Update Profile', currentLanguage)}
                    </button>
                </form>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">{translateUiText('Change Password', currentLanguage)}</h2>
                <p className="mt-1 text-sm text-slate-600">{translateUiText('Use a strong password for account security.', currentLanguage)}</p>

                <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                    <TextInput
                        label="Current Password"
                        name="current_password"
                        type="password"
                        value={passwordForm.current_password}
                        onChange={(value) => setPasswordForm((prev) => ({ ...prev, current_password: value }))}
                        placeholder="Current password"
                        required
                    />
                    <TextInput
                        label="New Password"
                        name="new_password"
                        type="password"
                        value={passwordForm.new_password}
                        onChange={(value) => setPasswordForm((prev) => ({ ...prev, new_password: value }))}
                        placeholder="New password"
                        required
                    />
                    <TextInput
                        label="Confirm Password"
                        name="confirm_password"
                        type="password"
                        value={passwordForm.confirm_password}
                        onChange={(value) => setPasswordForm((prev) => ({ ...prev, confirm_password: value }))}
                        placeholder="Confirm password"
                        required
                    />

                    <button
                        disabled={changingPassword}
                        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
                    >
                        {changingPassword ? translateUiText('Changing...', currentLanguage) : translateUiText('Change Password', currentLanguage)}
                    </button>
                </form>
            </section>
        </div>
    )
}
