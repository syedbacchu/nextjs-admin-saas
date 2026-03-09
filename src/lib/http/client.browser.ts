import axios from 'axios'

export const browserClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Accept: 'application/json',
        lang: 'en',
    },
})
