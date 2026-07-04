import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import { redirect } from 'next/navigation'
import GenerateSalaryListClient from './GenerateSalaryListClient'
import {getGeneratedSalaryListAction} from "@/features/salary-expenses/actions/salary-payment.actions";

interface GenerateSalaryListPageProps {
    params: Promise<{ tenant_slug: string }>
    searchParams: Promise<{ page?: string; search?: string }>
}

export async function generateMetadata({ params }: GenerateSalaryListPageProps): Promise<Metadata> {
    const { tenant_slug } = await params
    return constructMetadata({
        title: `Generated Salaries - ${tenant_slug}`,
        description: 'Manage generated salary sheets and process payments',
        noIndex: true,
    })
}

export default async function GenerateSalaryListPage({
                                                         params,
                                                         searchParams,
                                                     }: GenerateSalaryListPageProps) {
    const { tenant_slug } = await params
    const { page = '1', search = '' } = await searchParams

    try {
        const response = await getGeneratedSalaryListAction(tenant_slug, Number(page), search)

        if (!response.success) {
            redirect(`/${tenant_slug}`)
        }

        return (
            <GenerateSalaryListClient
                tenantSlug={tenant_slug}
                initialData={response.data}
                currentPage={Number(page)}
                searchQuery={search}
            />
        )
    } catch (error) {
        console.error('Error fetching generated salaries:', error)
        redirect(`/${tenant_slug}`)
    }
}
