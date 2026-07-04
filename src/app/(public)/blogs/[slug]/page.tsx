import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { cache } from 'react'
import { constructMetadata } from '@/lib/seo'
import { BlogDetailsData, BlogService, BlogSummaryCategory, BlogSummaryResponse } from '@/features/blog'
import BlogCommentsSection from '@/features/blog/components/BlogCommentsSection'
import SimilarBlogsCarousel from '@/features/blog/components/SimilarBlogsCarousel'

const DEFAULT_BLOG_IMAGE = '/placeholder.png'

const getBlog = cache(async (slug: string) => {
    return await BlogService.details(String(slug))
})

const getBlogSummary = cache(async () => {
    return await BlogService.summary()
})

interface PageProps {
    params: Promise<{ slug: string }>
}

function isLocalAsset(url: string) {
    return url.startsWith('http://localhost:8000/') || url.startsWith('http://127.0.0.1:8000/')
}

function buildBlogFilterHref(type: 'category' | 'tag', slug?: string | null) {
    if (!slug) return '/blogs'
    return type === 'category' ? `/blogs?category=${encodeURIComponent(slug)}` : `/blogs?tag=${encodeURIComponent(slug)}`
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
    const { slug } = await params
    const res = await getBlog(slug)

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
    const { slug } = await params
    const [res, summaryResponse] = await Promise.all([getBlog(slug), getBlogSummary()])

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
    const unoptimized = isLocalAsset(heroImage)
    const summary = summaryResponse as unknown as BlogSummaryResponse
    const latestBlogs = (summary.data?.latest_blogs || [])
        .filter((item) => item.slug !== slug)
        .slice(0, 6)
    const similarBlogs = (blog.similar_blogs || []).filter((item) => item.slug !== slug)
    const categorySummary = (summary.data?.categories || []) as BlogSummaryCategory[]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            <div className="mx-auto max-w-7xl px-1 py-2 sm:px-2">
                <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 flex-wrap items-center gap-2 text-sm text-slate-500 md:mb-6">
                    <Link href="/" className="font-medium hover:text-slate-700">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/blogs" className="font-medium hover:text-slate-700">
                        Blogs
                    </Link>
                    <span>/</span>
                    <span className="min-w-0 flex-1 truncate font-semibold text-slate-800">
                        {blog.title}
                    </span>
                </nav>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-8">
                    <div className="min-w-0 space-y-5 lg:space-y-8">
                        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="bg-white p-3 sm:p-4">
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-50 md:aspect-[16/10] lg:aspect-[5/3]">
                                    <Image
                                        src={heroImage}
                                        alt={blog.title}
                                        fill
                                        quality={100}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 900px"
                                        priority
                                        unoptimized={unoptimized}
                                        className="object-contain object-center"
                                    />
                                </div>
                            </div>

                            <div className="p-4 sm:p-5 md:p-8">
                                <h1 className="break-words text-2xl font-extrabold leading-tight text-slate-900 md:text-4xl">
                                    {blog.title}
                                </h1>

                                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                    <span className="font-semibold text-slate-700">{blog.author?.name || 'SetMyScore'}</span>
                                    {published && <span>{published}</span>}
                                </div>

                                {(blog.categories?.length || blog.tags?.length) && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {blog.categories?.map((category) => (
                                            <Link
                                                key={`category-${category.id}`}
                                                href={buildBlogFilterHref('category', category.slug)}
                                                className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                                            >
                                                {category.name}
                                            </Link>
                                        ))}
                                        {blog.tags?.map((tag) => (
                                            <Link
                                                key={`tag-${tag.id}`}
                                                href={buildBlogFilterHref('tag', tag.slug)}
                                                className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100"
                                            >
                                                #{tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {blog.excerpt && (
                                    <p className="mt-6 break-words text-base font-medium leading-relaxed text-slate-700 md:text-lg">
                                        {blog.excerpt}
                                    </p>
                                )}

                                {blog.content && (
                                    <div className="mt-8 pt-6 border-t border-slate-100">
                                        <p className="break-words whitespace-pre-line text-base leading-8 text-slate-700">
                                            {blog.content}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </article>

                        <SimilarBlogsCarousel items={similarBlogs} />

                        <BlogCommentsSection slug={slug} />
                    </div>

                    <aside className="min-w-0 space-y-5 lg:space-y-6">
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="text-xl font-extrabold text-slate-900">
                                Latest Blog
                            </h2>

                            <div className="mt-4 space-y-4">
                                {latestBlogs.length > 0 ? latestBlogs.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/blogs/${item.slug}`}
                                        className="flex min-w-0 gap-3 rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50"
                                    >
                                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                            <Image
                                                src={item.thumbnail_img || item.featured_img || DEFAULT_BLOG_IMAGE}
                                                alt={item.title}
                                                fill
                                                sizes="80px"
                                                unoptimized={isLocalAsset(item.thumbnail_img || item.featured_img || DEFAULT_BLOG_IMAGE)}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="line-clamp-2 break-words text-sm font-bold leading-5 text-slate-900">
                                                {item.title}
                                            </h3>
                                            {item.published_at && (
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {formatDate(item.published_at)}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                )) : (
                                    <p className="text-sm text-slate-500">
                                        No recent blogs found.
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="text-xl font-extrabold text-slate-900">
                                Blog Categories
                            </h2>

                            <div className="mt-4 space-y-2">
                                {categorySummary.length > 0 ? categorySummary.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={buildBlogFilterHref('category', category.slug)}
                                        className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        <span className="min-w-0 flex-1 break-words font-medium">{category.name}</span>
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                            {category.blogs_count || 0}
                                        </span>
                                    </Link>
                                )) : (
                                    <p className="text-sm text-slate-500">
                                        No categories found.
                                    </p>
                                )}
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    )
}
