const toRemotePattern = (value?: string) => {
    if (!value) return null

    try {
        const url = new URL(value)
        return {
            protocol: url.protocol.replace(':', ''),
            hostname: url.hostname,
            ...(url.port ? { port: url.port } : {}),
            pathname: '/**',
        }
    } catch {
        return null
    }
}

const remotePatterns = [
    toRemotePattern(process.env.API_BASE_URL),
    toRemotePattern(process.env.NEXT_PUBLIC_API_BASE_URL),
    toRemotePattern(process.env.NEXT_PUBLIC_APP_URL),
    toRemotePattern(process.env.NEXT_PUBLIC_CLIENT_URL),
    {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
    },
    {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
    },
].filter(Boolean)

/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns,
        // Keep responsive widths large enough for cards/hero images.
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    async rewrites() {
        const apiBase = process.env.API_BASE_URL || 'http://localhost:8000'
        return [
            {
                source: '/api/:path*',
                destination: `${apiBase}/api/:path*`,
            },
        ]
    },
    experimental: {
        serverActions: {
            allowedOrigins: [process.env.NEXT_PUBLIC_APP_URL, process.env.NEXT_PUBLIC_CLIENT_URL].filter(Boolean),
        },
    },
};

export default nextConfig;
