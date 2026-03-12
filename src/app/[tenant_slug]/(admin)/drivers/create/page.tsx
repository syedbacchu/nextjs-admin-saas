import DriverForm from '@/components/driver/DriverForm'

interface CreateDriverPageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

export default async function CreateDriverPage({ params }: CreateDriverPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()

    if (!tenantSlug) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid tenant route.
            </div>
        )
    }

    return <DriverForm tenantSlug={tenantSlug} submitLabel="Create Driver" />
}
