'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BlogListItem } from '@/features/blog'
import { isUnoptimizedBlogImage, resolveBlogImageUrl } from '@/features/blog/utils/resolveBlogImage'

function formatDate(value?: string | null) {
    if (!value) return ''
    const date = new Date(value.replace(' ', 'T'))
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

function trimText(text?: string, length: number = 170) {
    if (!text) return ''
    const normalized = text.replace(/\s+/g, ' ').trim()
    if (normalized.length <= length) return normalized
    return `${normalized.slice(0, length).trim()}...`
}

export default function BlogCard({ item }: { item: BlogListItem }) {
    const imageSrc = resolveBlogImageUrl(item.thumbnail_img, item.featured_img)
    const published = formatDate(item.published_at)
    const excerpt = trimText(item.excerpt)

    return (
        <div className="group flex flex-col h-full bg-white rounded-[15px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <Link
                href={`/blogs/${item.slug}`}
                className="relative h-60 w-full overflow-hidden rounded-t-[15px] bg-slate-100 block"
            >
                <Image
                    src={imageSrc}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={100}
                    unoptimized={isUnoptimizedBlogImage(imageSrc)}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            <div className="flex flex-col flex-grow p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-purple-700">
                            {item.author?.name || 'SetMyScore'}
                        </span>

                        {item.categories && item.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {item.categories.map((category) => (
                                    <span
                                        key={category.id}
                                        className="w-fit bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-purple-100"
                                    >
                                        {category.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {published && (
                        <span className="text-xs text-slate-500 font-medium mt-0.5 whitespace-nowrap">
                            {published}
                        </span>
                    )}
                </div>

                <Link href={`/blogs/${item.slug}`} className="mb-2 block">
                    <h3 className="text-xl font-extrabold text-slate-900 leading-snug group-hover:text-purple-700 transition-colors">
                        {item.title}
                    </h3>
                </Link>

                <p className="text-sm text-slate-600 leading-relaxed mb-5 text-justify flex-grow">
                    {excerpt}
                </p>

                <Link
                    href={`/blogs/${item.slug}`}
                    className="inline-flex items-center text-sm font-bold text-purple-700 hover:text-purple-800 transition-colors mt-auto w-fit"
                >
                    Read more
                    <svg className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}
