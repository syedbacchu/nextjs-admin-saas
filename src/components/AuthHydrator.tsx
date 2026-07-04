'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { meAction, AuthUser } from '@/features/auth'

interface AuthHydratorProps {
    initialUser?: AuthUser | null
}

export default function AuthHydrator({ initialUser = null }: AuthHydratorProps) {
    const setUser = useAuthStore((s) => s.setUser)

    useEffect(() => {
        setUser(initialUser)
    }, [initialUser, setUser])

    useEffect(() => {
        if (initialUser) return

        async function hydrate() {
            try {
                const user = await meAction()
                setUser(user)
            } catch {
                setUser(null)
            }
        }

        hydrate()
    }, [initialUser, setUser])

    return null
}
