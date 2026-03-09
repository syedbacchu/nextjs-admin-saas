import Link from 'next/link'
import Image from 'next/image'
import { getProfileAction } from '@/services/profile/profile.actions'

interface ProfilePageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
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

    if (!res.success || !res.data?.user || !res.data?.tenant) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load profile</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const { user, tenant } = res.data

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Image
                            src={user.image || '/default-user.png'}
                            alt={user.name}
                            width={64}
                            height={64}
                            unoptimized
                            className="h-16 w-16 rounded-full border border-slate-200 object-cover"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                            <p className="text-sm text-slate-600">@{user.username}</p>
                        </div>
                    </div>

                    <Link
                        href={`/${tenantSlug}/profile/update`}
                        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        Update Profile
                    </Link>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">User Info</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Email:</span> <span className="text-slate-600">{user.email || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Phone:</span> <span className="text-slate-600">{user.phone || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Language:</span> <span className="text-slate-600">{user.language || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Address:</span> <span className="text-slate-600">{user.address || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Status:</span> <span className="text-slate-600">{user.status === 1 ? 'Active' : 'Inactive'}</span></p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Tenant Info</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Company:</span> <span className="text-slate-600">{tenant.company_name}</span></p>
                        <p><span className="font-medium text-slate-700">Tenant Username:</span> <span className="text-slate-600">{tenant.company_username}</span></p>
                        <p><span className="font-medium text-slate-700">Tenant Status:</span> <span className="text-slate-600">{tenant.status || 'N/A'}</span></p>
                    </div>
                </div>
            </section>
        </div>
    )
}
