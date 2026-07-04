import { getAllEmployeesAction } from '@/features/employees'
import BonusForm from "@/features/bonuses/components/BonusForm";

interface CreateBonusPageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

export default async function CreateBonusPage({ params }: CreateBonusPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()

    if (!tenantSlug) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid tenant route.
            </div>
        )
    }

    const employeesRes = await getAllEmployeesAction(tenantSlug)
    const employees = (employeesRes.success && Array.isArray(employeesRes.data)) ? employeesRes.data : []

    return (
        <BonusForm
            tenantSlug={tenantSlug}
            employees={employees}
            submitLabel="Create Bonus"
        />
    )
}
