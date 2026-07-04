import AuthShell from "@/features/auth/components/AuthShell";
import LoginForm from "@/features/auth/components/LoginForm";


interface LoginPageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

export default async function LoginPage({ params }: LoginPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()

    return (
        <AuthShell tenantSlug={tenantSlug}>
            <LoginForm tenantSlug={tenantSlug} />
        </AuthShell>
    )
}
