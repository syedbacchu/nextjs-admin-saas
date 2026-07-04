import { Metadata } from 'next'
import { getFilesAction } from '@/features/files'
import {getTenantSettingsAction, TenantSettingsForm} from "@/features/settings";
import { constructMetadata } from '@/lib/seo';

interface TenantSettingsPageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'Settings',
        description: 'Manage your transport business settings, configure preferences, and customize your workspace.',
        noIndex: true,
    })
}

export default async function TenantSettingsPage({ params }: TenantSettingsPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()

    if (!tenantSlug) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid tenant route.
            </div>
        )
    }

    const [settingsRes, filesRes] = await Promise.all([
        getTenantSettingsAction(tenantSlug),
        getFilesAction(tenantSlug, 1, ''),
    ])

    if (!settingsRes.success || !settingsRes.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load settings</h1>
                <p className="mt-1 text-sm text-red-600">{settingsRes.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const initialFiles = filesRes.success ? filesRes.data?.data || [] : []

    return (
        <TenantSettingsForm
            tenantSlug={tenantSlug}
            initialSettings={settingsRes.data}
            initialFiles={initialFiles}
        />
    )
}
