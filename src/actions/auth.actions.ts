'use server'

import { cookies } from 'next/headers'
import { AuthService } from '@/services/auth.service'

export async function meAction() {
    const token = cookies().get('access_token')?.value
    if (!token) return null

    const res = await AuthService.me(token)

    return res.success ? res.data.user : null
}
