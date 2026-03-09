'use server'

import { cookies } from 'next/headers'
import { AuthService } from '@/services/auth.service'

export async function loginAction(formData: FormData) {
    const res = await AuthService.login(formData)

    if (res.success === true) {
        cookies().set('access_token', res.data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: res.data.expires_in,
            path: '/',
        })
    }

    return res
}


export async function logoutAction() {
    cookies().delete('access_token')
}
