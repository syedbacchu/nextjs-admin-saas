
import ProfileSettingsForm from '@/components/ProfileSettingsForm'
import { getProfileAction } from '@/services/profile/profile.actions'

interface UpdateProfilePageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

export default async function UpdateProfilePage({ params }: UpdateProfilePageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()

    if (!tenantSlug) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid tenant route.
            </div>
        )
    }

    const res = await getProfileAction(tenantSlug)

    if (!res.success || !res.data?.user) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load profile</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    return <ProfileSettingsForm tenantSlug={tenantSlug} initialUser={res.data.user} />
}
