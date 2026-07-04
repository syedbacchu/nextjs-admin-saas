import AdminHeader from "@/components/layout/admin/AdminHeader";
import AdminLayoutWrapper from "@/components/layout/admin/AdminLayoutWrapper";
import {getPublicTenantSettingsAction} from "@/features/settings";
import {getProfileAction} from "@/features/profile";
import {getSubscriptionDetailsAction} from "@/features/subscription";
import {getStaffFeaturesAction, getMyFeaturesAction} from "@/features/staff";

export default async function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ tenant_slug: string }>
}) {
    const { tenant_slug: tenantSlug } = await params
    const [settingsRes, profileRes, subscriptionRes] = await Promise.all([
        getPublicTenantSettingsAction(tenantSlug),
        getProfileAction(tenantSlug),
        getSubscriptionDetailsAction(tenantSlug),
    ])
    const settings = settingsRes.success && settingsRes.data ? settingsRes.data : {}
    // Only use custom logo if it's a valid non-empty string, otherwise let AdminHeader use its default
    const logoSrc = settings.logo || settings.login_logo
      ? String(settings.logo || settings.login_logo).trim() || null
      : null
    const currentUser = profileRes.success && profileRes.data?.user ? profileRes.data.user : null

    // Load appropriate features based on user type
    let initialFeatures = {}
    if (currentUser?.user_type === 'staff') {
        // Load staff-specific features using the new my-features endpoint
        try {
            // Use the new endpoint that allows staff to access their own features
            const staffFeaturesRes = await getMyFeaturesAction(tenantSlug)

            if (staffFeaturesRes.success && staffFeaturesRes.data) {
                // Convert staff assignments to feature map
                const rawAssignments = staffFeaturesRes.data.staff_assignments || {}

                initialFeatures = Object.entries(rawAssignments)
                    .filter(([_, accessible]) => accessible === true || accessible === 1)
                    .reduce((acc, [key]) => {
                        acc[key] = true
                        return acc
                    }, {} as Record<string, boolean>)
            }
        } catch (error) {
            // Default to no features if loading fails
            initialFeatures = {}
        }
    } else {
        // Load tenant subscription features for admin/owner
        initialFeatures = subscriptionRes.success && subscriptionRes.data?.features ? subscriptionRes.data.features : {}
    }

    return (
        <AdminLayoutWrapper tenantSlug={tenantSlug} initialFeatures={initialFeatures}>
            <div className="min-h-screen bg-slate-50 md:flex">
                <AdminHeader logoSrc={logoSrc} currentUser={currentUser} />
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
        </AdminLayoutWrapper>
    )
}
