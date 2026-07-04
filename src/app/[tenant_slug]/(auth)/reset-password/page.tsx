import AuthShell from "@/features/auth/components/AuthShell";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";


interface ResetPasswordPageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
    searchParams?: Promise<{
        login?: string
    }> | {
        login?: string
    }
}

export default async function ResetPasswordPage({ params, searchParams }: ResetPasswordPageProps) {
    const resolvedParams = await params
    const resolvedSearchParams = searchParams ? await searchParams : undefined
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const login = String(resolvedSearchParams?.login || '').trim()

    return (
        <AuthShell tenantSlug={tenantSlug}>
            <ResetPasswordForm tenantSlug={tenantSlug} login={login} />
        </AuthShell>
    )
}
