import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import BlogPublicList from '@/features/blog/components/BlogPublicList'

type PageProps = {
    searchParams: Promise<{
        category?: string
        tag?: string
    }>
}

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'Blogs',
        description: 'Latest blogs',
        image: '/og/default.png',
    })
}

export default async function page({ searchParams }: PageProps) {
    const { category, tag } = await searchParams

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            <div className="mx-auto px-4 py-8 -mt-6 relative z-10">
                <BlogPublicList
                    key={`${category || ''}:${tag || ''}`}
                    category={category}
                    tag={tag}
                />
            </div>
        </div>
    )
}
