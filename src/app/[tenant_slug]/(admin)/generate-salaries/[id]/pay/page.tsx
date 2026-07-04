import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import { getOfficesAction } from '@/features/offices'
import { getFilesAction } from '@/features/files'
import { redirect } from 'next/navigation'
import {getSalarySheetAction} from "@/features/salary-expenses/actions/salary-payment.actions";
import SalaryPaymentForm from "@/features/salary-expenses/components/SalaryPaymentForm";

interface SalaryPaymentPageProps {
    params: Promise<{ tenant_slug: string; id: string }>
    searchParams: Promise<{ sheet_id?: string }>
}

export async function generateMetadata({ params }: SalaryPaymentPageProps): Promise<Metadata> {
    const { tenant_slug, id } = await params
    return constructMetadata({
        title: `Process Payment - Salary Sheet #${id} - ${tenant_slug}`,
        description: 'Process salary payment for employee',
        noIndex: true,
    })
}

export default async function SalaryPaymentPage({ params, searchParams }: SalaryPaymentPageProps) {
    const { tenant_slug, id } = await params
    const { sheet_id } = await searchParams

    try {
        const [salarySheetRes, officesRes, filesRes] = await Promise.all([
            getSalarySheetAction(tenant_slug, Number(id)),
            getOfficesAction(tenant_slug, 1, ''),
            getFilesAction(tenant_slug, 1, ''),
        ])

        if (!salarySheetRes.success) {
            redirect(`/${tenant_slug}/generate-salaries`)
        }

        // Find the specific salary sheet using the query parameter
        const salarySheet = sheet_id
            ? salarySheetRes.data.salary_sheet?.find((s) => s.id === Number(sheet_id))
            : salarySheetRes.data.salary_sheet?.[0] // Fallback to first sheet if no sheet_id provided

        if (!salarySheet) {
            redirect(`/${tenant_slug}/generate-salaries`)
        }

        return (
            <SalaryPaymentForm
                tenantSlug={tenant_slug}
                salarySheet={salarySheet}
                offices={officesRes.data?.data || []}
                initialFiles={filesRes.data?.data || []}
            />
        )
    } catch (error) {
        console.error('Error loading payment page:', error)
        redirect(`/${tenant_slug}/generate-salaries`)
    }
}
