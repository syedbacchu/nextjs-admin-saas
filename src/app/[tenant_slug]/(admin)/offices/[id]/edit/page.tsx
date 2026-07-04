import { getOfficeAction } from '@/features/offices'
import OfficeForm from "@/features/offices/components/OfficeForm";

interface EditOfficePageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

export default async function EditOfficePage({ params }: EditOfficePageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const officeId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !officeId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid office route.
            </div>
        )
    }

    const res = await getOfficeAction(tenantSlug, officeId)

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load office</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    return (
        <OfficeForm
            tenantSlug={tenantSlug}
            officeId={officeId}
            initialData={res.data}
            submitLabel="Update Office"
        />
    )
}
