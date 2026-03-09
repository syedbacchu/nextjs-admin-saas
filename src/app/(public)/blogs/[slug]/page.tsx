import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { cache } from 'react'
import { constructMetadata } from '@/lib/seo'
import { BlogService } from '@/services/blog/blog.service'
import { BlogDetailsData } from '@/services/blog/blog.types'
import BlogCommentsSection from '@/components/blog/BlogCommentsSection'

const DEFAULT_BLOG_IMAGE = '/images/tournament.png'

const getBlog = cache(async (slug: string) => {
    return await BlogService.details(String(slug))
})

interface PageProps {
    params: { slug: string }
}

function formatDate(value?: string | null) {
    if (!value) return ''
    const date = new Date(value.replace(' ', 'T'))
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function trimText(text?: string | null, length: number = 160) {
    if (!text) return ''
    const normalized = text.replace(/\s+/g, ' ').trim()
    if (normalized.length <= length) return normalized
    return `${normalized.slice(0, length).trim()}...`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const res = await getBlog(params.slug)

    if (!res.success || !res.data) {
        return constructMetadata({
            title: 'Blog Not Found',
            description: 'The requested blog post could not be found.',
        })
    }

    const blog = res.data as unknown as BlogDetailsData

    return constructMetadata({
        title: blog.meta_title || blog.title,
        description: blog.meta_description || trimText(blog.excerpt, 200),
        image: blog.featured_img || blog.thumbnail_img || '/og/default.png',
    })
}

export default async function page({ params }: PageProps) {
    const res = await getBlog(params.slug)

    if (!res.success || !res.data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="text-6xl mb-4">📰</div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Blog Not Found</h1>
                    <p className="text-slate-600">The blog you are looking for does not exist or is unavailable.</p>
                    <Link
                        href="/blogs"
                        className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-medium"
                    >
                        Back To Blogs
                    </Link>
                </div>
            </div>
        )
    }

    const blog = res.data as unknown as BlogDetailsData
    const heroImage = blog.featured_img || blog.thumbnail_img || DEFAULT_BLOG_IMAGE
    const published = formatDate(blog.published_at)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            <div className="max-w-4xl mx-auto px-4 py-10">
                <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 mb-6">
                    <span>←</span>
                    <span>Back To Blogs</span>
                </Link>

                <article className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="relative h-72 md:h-96 bg-slate-100">
                        <Image
                            src={heroImage}
                            alt={blog.title}
                            fill
                            quality={100}
                            sizes="(max-width: 768px) 100vw, 1024px"
                            priority
                            className="object-cover"
                        />
                    </div>

                    <div className="p-5 md:p-8">
                        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                            {blog.title}
                        </h1>

                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span className="font-semibold text-slate-700">{blog.author?.name || 'Admin'}</span>
                            {published && <span>{published}</span>}
                        </div>

                        {(blog.categories?.length || blog.tags?.length) && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {blog.categories?.map((category) => (
                                    <span key={`category-${category.id}`} className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                        {category.name}
                                    </span>
                                ))}
                                {blog.tags?.map((tag) => (
                                    <span key={`tag-${tag.id}`} className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {blog.excerpt && (
                            <p className="mt-6 text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                                {blog.excerpt}
                            </p>
                        )}

                        {blog.content && (
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <p className="text-base text-slate-700 leading-8 whitespace-pre-line">
                                    {blog.content}
                                </p>
                            </div>
                        )}
                    </div>
                </article>

                <BlogCommentsSection slug={params.slug} />
            </div>
        </div>
    )
}
