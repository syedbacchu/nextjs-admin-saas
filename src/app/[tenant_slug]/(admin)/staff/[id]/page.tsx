import Link from 'next/link'
import { getStaffAction } from '@/features/staff'

interface StaffDetailsPageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

function formatDate(value?: string | null): string {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export default async function StaffDetailsPage({ params }: StaffDetailsPageProps) {
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

    const staff = res.data

    return (
        <div className="mx-auto space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{staff.name}</h1>
                        <p className="mt-1 text-sm text-slate-600">@{staff.username}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/${tenantSlug}/staff`}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            Back
                        </Link>
                        <Link
                            href={`/${tenantSlug}/staff/${staff.id}/edit`}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Edit Staff
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Staff Info</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Email:</span> <span className="text-slate-600">{staff.email || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Phone:</span> <span className="text-slate-600">{staff.phone || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Language:</span> <span className="text-slate-600">{staff.language || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Address:</span> <span className="text-slate-600">{staff.address || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Status:</span> <span className="text-slate-600">{staff.status === 1 ? 'Active' : 'Inactive'}</span></p>
                        <p><span className="font-medium text-slate-700">Login:</span> <span className="text-slate-600">{staff.enable_login === 1 ? 'Enabled' : 'Disabled'}</span></p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Meta</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Role Module:</span> <span className="text-slate-600">{staff.role_module ?? 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Role ID:</span> <span className="text-slate-600">{staff.role_id ?? 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">User Type:</span> <span className="text-slate-600">{staff.user_type || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Tenant Driver ID:</span> <span className="text-slate-600">{staff.tenant_driver_id ?? 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Created At:</span> <span className="text-slate-600">{formatDate(staff.created_at)}</span></p>
                        <p><span className="font-medium text-slate-700">Updated At:</span> <span className="text-slate-600">{formatDate(staff.updated_at)}</span></p>
                    </div>
                </div>
            </section>
        </div>
    )
}
