import { create } from 'zustand'

export interface User {
    id: number
    name: string
    username: string
    email?: string | null
    phone?: string | null
    image?: string | null
}

interface AuthState {
    user: User | null
    loading: boolean
    setUser: (user: User | null) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true, // 👈 starts true
    setUser: (user) => set({ user, loading: false }),
    logout: () => set({ user: null, loading: false }),
}))