import {getStaffAction, StaffForm} from '@/features/staff'

interface EditStaffPageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const staffId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !staffId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid staff route.
            </div>
        )
    }

    const res = await getStaffAction(tenantSlug, staffId)

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load staff</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    return (
        <StaffForm
            tenantSlug={tenantSlug}
            staffId={staffId}
            initialData={res.data}
            submitLabel="Update Staff"
        />
    )
}
