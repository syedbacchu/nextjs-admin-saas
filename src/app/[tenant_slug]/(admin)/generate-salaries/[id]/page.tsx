import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import { redirect } from 'next/navigation'
import SalarySheetDetailClient from './SalarySheetDetailClient'
import {getSalarySheetAction} from "@/features/salary-expenses/actions/salary-payment.actions";

interface SalarySheetDetailPageProps {
    params: Promise<{ tenant_slug: string; id: string }>
}

export async function generateMetadata({ params }: SalarySheetDetailPageProps): Promise<Metadata> {
    const { tenant_slug, id } = await params
    return constructMetadata({
        title: `Salary Sheet #${id} - ${tenant_slug}`,
        description: 'View salary sheet details and process payments',
        noIndex: true,
    })
}

export default async function SalarySheetDetailPage({ params }: SalarySheetDetailPageProps) {
    const { tenant_slug, id } = await params

    try {
        const response = await getSalarySheetAction(tenant_slug, Number(id))

        if (!response.success) {
            redirect(`/${tenant_slug}/generate-salaries`)
        }

        return <SalarySheetDetailClient tenantSlug={tenant_slug} data={response.data} />
    } catch (error) {
        console.error('Error fetching salary sheet:', error)
        redirect(`/${tenant_slug}/generate-salaries`)
    }
}
