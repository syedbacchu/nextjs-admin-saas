'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import TextInput from '@/components/form/TextInput'
import ImagePickerField from '@/components/form/ImagePickerField'
import type { FileSystemItem } from '@/features/files'
import {deleteTenantSettingsClient, TenantSettingsMap, updateTenantSettingsClient} from "@/features/settings";

interface TenantSettingsFormProps {
    tenantSlug: string
    initialSettings: TenantSettingsMap
    initialFiles: FileSystemItem[]
}

type SettingsTab = 'general' | 'branding' | 'trip'

type FieldConfig = {
    slug: string
    label: string
    placeholder: string
    textarea?: boolean
    rows?: number
}

const GENERAL_FIELDS: FieldConfig[] = [
    { slug: 'site_title', label: 'Site Title', placeholder: 'Enter site title' },
    { slug: 'tag_title', label: 'Tag Title', placeholder: 'Enter tag title' },
    { slug: 'login_heading', label: 'Login Title', placeholder: 'Login Heading' },
    { slug: 'contact_email', label: 'Contact Email', placeholder: 'Enter contact email' },
    { slug: 'contact_phone', label: 'Contact Phone', placeholder: 'Enter contact phone' },
    { slug: 'copy_right_text', label: 'Copyright Text', placeholder: 'Enter copyright text' },
    { slug: 'login_footer_text', label: 'Login Footer Text', textarea: true, placeholder: 'Login Footer text' },
    { slug: 'footer_text', label: 'Footer Text', placeholder: 'Enter footer text', textarea: true, rows: 3 },
    { slug: 'address', label: 'Address', placeholder: 'Enter address', textarea: true, rows: 3 },
]

const BRANDING_FIELDS: FieldConfig[] = [
    { slug: 'logo', label: 'Logo', placeholder: 'Select site logo' },
    { slug: 'login_logo', label: 'Login Logo', placeholder: 'Select login logo' },
    { slug: 'login_left_image', label: 'Login Left Image', placeholder: 'Select login left image' },
    { slug: 'favicon', label: 'Favicon', placeholder: 'Select favicon' },
]

const TRIP_FIELDS: FieldConfig[] = [
    { slug: 'challan_no_format', label: 'Challan No Date Format', placeholder: 'Enter date format (e.g., Ymd, Y-m-d)' },
    { slug: 'challan_no_separator', label: 'Challan No Separator', placeholder: 'Enter separator (e.g., -, _, /)' },
    { slug: 'challan_no_sequence_length', label: 'Challan No Sequence Length', placeholder: 'Enter sequence length (e.g., 4, 6, 8)' },
]

const MEDIA_SLUG_HINTS = ['logo', 'banner', 'image', 'favicon', 'icon']
const IMAGE_VALUE_PATTERN = /\.(png|jpe?g|gif|svg|webp|bmp|ico)(\?.*)?$/i

function normalizeSettings(settings: TenantSettingsMap, fieldConfigs: FieldConfig[]): Record<string, string> {
    const normalized: Record<string, string> = {}

    Object.entries(settings || {}).forEach(([slug, value]) => {
        normalized[slug] = typeof value === 'string' ? value : ''
    })

    fieldConfigs.forEach((field) => {
        if (!(field.slug in normalized)) {
            normalized[field.slug] = ''
        }
    })

    return normalized
}

function toLabel(slug: string): string {
    return slug
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

function isMediaSetting(slug: string, value: string): boolean {
    const normalizedSlug = slug.toLowerCase()
    if (MEDIA_SLUG_HINTS.some((hint) => normalizedSlug.includes(hint))) {
        return true
    }

    return /^https?:\/\//i.test(value) && IMAGE_VALUE_PATTERN.test(value)
}

export default function TenantSettingsForm({
    tenantSlug,
    initialSettings,
    initialFiles,
}: TenantSettingsFormProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general')
    const [settings, setSettings] = useState<Record<string, string>>(() =>
        normalizeSettings(initialSettings, [...GENERAL_FIELDS, ...BRANDING_FIELDS, ...TRIP_FIELDS]),
    )
    const [saving, setSaving] = useState(false)
    const [removingSlug, setRemovingSlug] = useState<string | null>(null)

    const generalFieldSlugs = useMemo(() => new Set(GENERAL_FIELDS.map((field) => field.slug)), [])
    const brandingFieldSlugs = useMemo(() => new Set(BRANDING_FIELDS.map((field) => field.slug)), [])
    const tripFieldSlugs = useMemo(() => new Set(TRIP_FIELDS.map((field) => field.slug)), [])

    const extraGeneralFields = useMemo(() => (
        Object.entries(settings)
            .filter(([slug, value]) => !generalFieldSlugs.has(slug) && !brandingFieldSlugs.has(slug) && !tripFieldSlugs.has(slug) && !isMediaSetting(slug, value))
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([slug]) => ({
                slug,
                label: toLabel(slug),
                placeholder: `Enter ${slug.replace(/_/g, ' ')}`,
                textarea: slug.includes('text') || slug.includes('description'),
                rows: 3,
            }))
    ), [brandingFieldSlugs, generalFieldSlugs, tripFieldSlugs, settings])

    const extraBrandingFields = useMemo(() => (
        Object.entries(settings)
            .filter(([slug, value]) => !generalFieldSlugs.has(slug) && !brandingFieldSlugs.has(slug) && !tripFieldSlugs.has(slug) && isMediaSetting(slug, value))
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([slug]) => ({
                slug,
                label: toLabel(slug),
                placeholder: `Select ${slug.replace(/_/g, ' ')}`,
            }))
    ), [brandingFieldSlugs, generalFieldSlugs, tripFieldSlugs, settings])

    const generalFields = useMemo(() => [...GENERAL_FIELDS, ...extraGeneralFields], [extraGeneralFields])
    const brandingFields = useMemo(() => [...BRANDING_FIELDS, ...extraBrandingFields], [extraBrandingFields])
    const tripFields = useMemo(() => [...TRIP_FIELDS], [TRIP_FIELDS])

    function updateSetting(slug: string, value: string) {
        setSettings((prev) => ({
            ...prev,
            [slug]: value,
        }))
    }

    async function handleSave() {
        setSaving(true)

        try {
            const payload = Object.entries(settings).map(([slug, value]) => ({
                slug,
                value: value ?? '',
            }))

            const res = await updateTenantSettingsClient(tenantSlug, payload)

            if (!res.success) {
                toast.error(res.message || 'Failed to save settings')
                return
            }

            const updatedSettings = normalizeSettings(res.data || {}, [...generalFields, ...brandingFields, ...tripFields])
            setSettings(updatedSettings)
            toast.success(res.message || 'Settings updated successfully')
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setSaving(false)
        }
    }

    async function handleDeleteSetting(slug: string) {
        setRemovingSlug(slug)

        try {
            const res = await deleteTenantSettingsClient(tenantSlug, { slugs: [slug] })

            if (!res.success) {
                toast.error(res.message || 'Failed to remove setting')
                return
            }

            setSettings((prev) => ({
                ...prev,
                [slug]: '',
            }))
            toast.success('Setting removed successfully')
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setRemovingSlug(null)
        }
    }

    return (
        <div className="mx-auto ">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Tenant Settings</h1>
                        <p className="mt-1 text-sm text-slate-600">
                            Manage the tenant title, branding assets, trip settings, and other public-facing settings.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 border-b border-slate-200 pb-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            activeTab === 'general'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                        General Settings
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('branding')}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            activeTab === 'branding'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                        Logo Settings
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('trip')}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            activeTab === 'trip'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                        Trip Settings
                    </button>
                </div>

                {activeTab === 'general' && (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {generalFields.map((field) => (
                            <div
                                key={field.slug}
                                className={field.textarea ? 'md:col-span-2' : ''}
                            >
                                <TextInput
                                    label={field.label}
                                    name={field.slug}
                                    value={settings[field.slug] || ''}
                                    onChange={(value) => updateSetting(field.slug, value)}
                                    placeholder={field.placeholder}
                                    textarea={field.textarea}
                                    rows={field.rows}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'branding' && (
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        {brandingFields.map((field) => (
                            <div key={field.slug} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <ImagePickerField
                                    tenantSlug={tenantSlug}
                                    label={field.label}
                                    value={settings[field.slug] || ''}
                                    onChange={(value) => updateSetting(field.slug, value)}
                                    initialFiles={initialFiles}
                                    placeholder={field.placeholder}
                                    previewAlt={field.label}
                                    triggerLabel="Choose from Media"
                                    modalTitle={`${field.label} Manager`}
                                    modalDescription={`Select ${field.label.toLowerCase()} from the media manager or upload a new file.`}
                                />

                                <div className="mt-3 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSetting(field.slug)}
                                        disabled={removingSlug === field.slug}
                                        className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                                    >
                                        {removingSlug === field.slug ? 'Removing...' : 'Remove'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'trip' && (
                    <div className="mt-6">
                        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <h3 className="text-sm font-semibold text-blue-900">About Challan Number Settings</h3>
                            <p className="mt-2 text-sm text-blue-700">
                                Configure how challan numbers are auto-generated for trips. The format combines date and sequence.
                                <br />
                                <strong>Examples:</strong>
                                <br />
                                • Format: <code>Ymd</code>, Separator: <code>-</code>, Length: <code>6</code> → <code>20260421-000001</code>
                                <br />
                                • Format: <code>Y-m-d</code>, Separator: <code>_</code>, Length: <code>4</code> → <code>2026-04-21_0001</code>
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {tripFields.map((field) => (
                                <div key={field.slug} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <TextInput
                                        label={field.label}
                                        name={field.slug}
                                        value={settings[field.slug] || ''}
                                        onChange={(value) => updateSetting(field.slug, value)}
                                        placeholder={field.placeholder}
                                        helpText={
                                            field.slug === 'challan_no_format'
                                                ? 'PHP date format (e.g., Ymd, Y-m-d, d/m/Y)'
                                                : field.slug === 'challan_no_separator'
                                                    ? 'Character between date and sequence (e.g., -, _, /)'
                                                    : field.slug === 'challan_no_sequence_length'
                                                        ? 'Number of digits in sequence (e.g., 4 for 0001, 6 for 000001)'
                                                        : undefined
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="text-sm font-semibold text-slate-900 mb-3">Preview</h4>
                            <div className="text-sm text-slate-600">
                                <p className="mb-2">Today's challan numbers will look like:</p>
                                <code className="block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm">
                                    {(() => {
                                        const format = settings.challan_no_format || 'Ymd'
                                        const separator = settings.challan_no_separator || '-'
                                        const length = parseInt(settings.challan_no_sequence_length || '6', 10)
                                        const today = new Date()

                                        // Simple date formatter based on format string
                                        const year = today.getFullYear()
                                        const month = String(today.getMonth() + 1).padStart(2, '0')
                                        const day = String(today.getDate()).padStart(2, '0')

                                        let datePart = format
                                            .replace(/Y+/g, year.toString())
                                            .replace(/m+/g, month)
                                            .replace(/d+/g, day)

                                        const sequencePart = '1'.padStart(length, '0')
                                        return `${datePart}${separator}${sequencePart}`
                                    })()}
                                </code>
                                <p className="mt-2 text-xs text-slate-500">
                                    Next trip on the same day will increment the sequence: {
                                        (() => {
                                            const format = settings.challan_no_format || 'Ymd'
                                            const separator = settings.challan_no_separator || '-'
                                            const length = parseInt(settings.challan_no_sequence_length || '6', 10)
                                            const today = new Date()
                                            const year = today.getFullYear()
                                            const month = String(today.getMonth() + 1).padStart(2, '0')
                                            const day = String(today.getDate()).padStart(2, '0')

                                            let datePart = format
                                                .replace(/Y+/g, year.toString())
                                                .replace(/m+/g, month)
                                                .replace(/d+/g, day)

                                            const sequencePart = '2'.padStart(length, '0')
                                            return `${datePart}${separator}${sequencePart}`
                                        })()
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}
