import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import { getFilesAction } from '@/features/files'
import CustomerForm from "@/features/customers/components/CustomerForm";

interface CreateCustomerPageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

export async function generateMetadata({ params }: CreateCustomerPageProps): Promise<Metadata> {
    const { tenant_slug } = await params
    return constructMetadata({
        title: `Create Customer - ${tenant_slug}`,
        description: 'Create a new customer for your transport business',
        noIndex: true,
    })
}

export default async function CreateCustomerPage({ params }: CreateCustomerPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()

    if (!tenantSlug) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid tenant route.
            </div>
        )
    }

    const filesRes = await getFilesAction(tenantSlug, 1, '')
    const initialFiles = filesRes.success ? filesRes.data?.data || [] : []

    return <CustomerForm tenantSlug={tenantSlug} initialFiles={initialFiles} submitLabel="Create Customer" />
}
