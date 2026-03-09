'use client' // must be client-side

import { useAuthStore } from '@/stores/auth.store'
import { loginAction } from '@/server/auth.actions' // server action

export async function loginClient(formData: FormData) {
    // call server action
    const res = await loginAction(formData)

    // if login successful, update client store
    if (res.success && res.data?.user) {
        useAuthStore.getState().setUser(res.data.user)
    }

    return res
}
