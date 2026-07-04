'use client'

import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner';
import {MdLogout} from "react-icons/md";
import {useAuthStore} from "@/stores/auth.store";
import {useI18n} from "@/components/providers/I18nProvider";
import {logoutAction} from "@/features/auth";

interface LogoutButtonProps {
    compact?: boolean
}

export default function LogoutButton({ compact = false }: LogoutButtonProps) {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const logout = useAuthStore((s) => s.logout)
    const { t } = useI18n()

    const handleLogout = async () => {
        const tenantSlug = typeof params?.tenant_slug === 'string' ? params.tenant_slug : ''
        try {
            await logoutAction()       // 1️⃣ delete cookie (server)
            logout()                   // 2️⃣ clear Zustand
            router.push(tenantSlug ? `/${tenantSlug}/login` : '/login')      // 3️⃣ redirect
            toast.success(t('admin', 'loggedOut'))
        } catch {
            toast.error(t('admin', 'logoutFailed'))
        }
    }

    return (
        <button onClick={handleLogout} aria-label={t('admin', 'logout')}>
            <span className={`text-sm text-gray-600 px-2 py-1 flex items-center gap-2 ${compact ? 'justify-center' : ''}`}>
                <MdLogout className="text-base" />
                {!compact && t('admin', 'logout')}
            </span>
        </button>
    )
}
