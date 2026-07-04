import type { Metadata } from 'next'
import {getPublicTenantSettingsAction} from "@/features/settings";

type TenantLayoutProps = {
    children: React.ReactNode
    params: Promise<{ tenant_slug: string }>
}

export async function generateMetadata({ params }: TenantLayoutProps): Promise<Metadata> {
    const { tenant_slug: tenantSlug } = await params
    const settingsRes = await getPublicTenantSettingsAction(tenantSlug)
    const settings = settingsRes.success && settingsRes.data ? settingsRes.data : {}
    const favicon = String(settings.favicon || settings.logo || '').trim()

    if (!favicon) {
        return {}
    }

    return {
        icons: {
            icon: [{ url: favicon }],
            shortcut: [{ url: favicon }],
            apple: [{ url: favicon }],
        },
    }
}

export default async function TenantLayout({ children }: TenantLayoutProps) {
    return children
}
