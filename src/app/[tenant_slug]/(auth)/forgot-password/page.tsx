import AuthShell from "@/features/auth/components/AuthShell";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";


interface ForgotPasswordPageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

export default async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()

    return (
        <AuthShell tenantSlug={tenantSlug}>
            <ForgotPasswordForm tenantSlug={tenantSlug} />
        </AuthShell>
    )
}
