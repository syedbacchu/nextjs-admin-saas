import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import GenerateSalaryForm from "@/features/generate-salary/components/GenerateSalaryForm";

interface GenerateSalaryCreatePageProps {
    params: Promise<{ tenant_slug: string }>
}

export async function generateMetadata({ params }: GenerateSalaryCreatePageProps): Promise<Metadata> {
    const { tenant_slug } = await params
    return constructMetadata({
        title: `Generate Salary - ${tenant_slug}`,
        description: 'Generate a new salary sheet',
        noIndex: true,
    })
}

export default async function GenerateSalaryCreatePage({ params }: GenerateSalaryCreatePageProps) {
    const { tenant_slug } = await params

    return <GenerateSalaryForm tenantSlug={tenant_slug} />
}
