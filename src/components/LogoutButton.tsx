'use client'

import { useRouter } from 'next/navigation'
import { logoutAction } from '@/server/auth.actions'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'sonner';
import {MdLogout} from "react-icons/md";

export default function LogoutButton() {
    const router = useRouter()
    const logout = useAuthStore((s) => s.logout)

    const handleLogout = async () => {
        try {
            await logoutAction()       // 1️⃣ delete cookie (server)
            logout()                   // 2️⃣ clear Zustand
            router.push('/login')      // 3️⃣ redirect
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
