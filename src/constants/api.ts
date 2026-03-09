export const API_CONFIG = {
    BASE_URL: process.env.API_BASE_URL!,
    SECRET: process.env.API_USER_SECRET!,
    LANG: process.env.API_LANG ?? 'en',
}

export const API_HEADERS = (server = false) => ({
    Accept: 'application/json',
    lang: process.env.NEXT_PUBLIC_API_LANG || 'en',
    ...(server && { userapisecret: process.env.API_USER_SECRET }), // only added if server
})
