'use client'

import { useParams, useRouter } from 'next/navigation'
import { logoutAction } from '@/services/auth/auth.actions'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'sonner';
import {MdLogout} from "react-icons/md";

export default function LogoutButton() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const logout = useAuthStore((s) => s.logout)

    const handleLogout = async () => {
        const tenantSlug = typeof params?.tenant_slug === 'string' ? params.tenant_slug : ''
        try {
            await logoutAction()       // 1️⃣ delete cookie (server)
            logout()                   // 2️⃣ clear Zustand
            router.push(tenantSlug ? `/${tenantSlug}/login` : '/login')      // 3️⃣ redirect
            toast.success('Logged out')
        } catch {
            toast.error('Logout failed')
        }
    }

    return (
        <button onClick={handleLogout}>
            <span className="text-sm text-gray-600 px-2 py-1 flex items-center gap-2">
                <MdLogout className="text-base" />
                {"Logout"}
            </span>
        </button>
    )
}
