import { StaffForm } from "@/features/staff";
import { getStaffsAction } from '@/features/staff';
import { StaffLimitGuard } from '@/features/feature-check';

interface CreateStaffPageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

export default async function CreateStaffPage({ params }: CreateStaffPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()

    if (!tenantSlug) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid tenant route.
            </div>
        )
    }

    // Get current staff count for limit checking
    const staffResponse = await getStaffsAction(tenantSlug, 1, '')
    const currentCount = staffResponse.success && staffResponse.data ? staffResponse.data.total_count || 0 : 0

    return (
        <StaffLimitGuard currentUsage={currentCount}>
            <StaffForm tenantSlug={tenantSlug} submitLabel="Create Staff" />
        </StaffLimitGuard>
    )
}
