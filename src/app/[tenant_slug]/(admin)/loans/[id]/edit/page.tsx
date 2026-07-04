import { notFound } from 'next/navigation'
import { getLoanAction } from '@/features/loans'
import { getAllEmployeesAction } from '@/features/employees'
import LoanForm from "@/features/loans/components/LoanForm";

interface EditLoanPageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

export default async function EditLoanPage({ params }: EditLoanPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const id = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !id) return notFound()

    const [loanRes, employeesRes] = await Promise.all([
        getLoanAction(tenantSlug, id),
        getAllEmployeesAction(tenantSlug),
    ])

    if (!loanRes.success || !loanRes.data) return notFound()

    const loan = loanRes.data
    const employees = (employeesRes.success && Array.isArray(employeesRes.data)) ? employeesRes.data : []

    return (
        <LoanForm
            tenantSlug={tenantSlug}
            employees={employees}
            initialData={loan}
            loanId={loan.id}
            submitLabel="Update Loan"
        />
    )
}
