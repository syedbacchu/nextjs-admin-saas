const DEFAULT_BLOG_IMAGE = '/placeholder.png'

function getBackendOrigin() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL
    if (!apiBaseUrl) return ''

    try {
        return new URL(apiBaseUrl).origin
    } catch {
        return ''
    }
}

export function resolveBlogImageUrl(...candidates: Array<string | null | undefined>) {
    const raw = candidates.find((value) => value?.trim())?.trim()
    if (!raw) return DEFAULT_BLOG_IMAGE

    if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) {
        return raw
    }

    if (raw.startsWith('/')) {
        const backendOrigin = getBackendOrigin()
        return backendOrigin ? `${backendOrigin}${raw}` : raw
    }

    return raw
}

export function isUnoptimizedBlogImage(src: string) {
    return /^https?:\/\//i.test(src)
}
