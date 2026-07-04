import { getCustomerAction } from '@/features/customers'
import { getFilesAction } from '@/features/files'
import CustomerForm from "@/features/customers/components/CustomerForm";

interface EditCustomerPageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const customerId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !customerId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid customer route.
            </div>
        )
    }

    const [res, filesRes] = await Promise.all([
        getCustomerAction(tenantSlug, customerId),
        getFilesAction(tenantSlug, 1, ''),
    ])

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load customer</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const initialFiles = filesRes.success ? filesRes.data?.data || [] : []

    return (
        <CustomerForm
            tenantSlug={tenantSlug}
            customerId={customerId}
            initialData={res.data}
            initialFiles={initialFiles}
            submitLabel="Update Customer"
        />
    )
}
