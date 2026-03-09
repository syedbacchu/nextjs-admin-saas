'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BlogListItem } from '@/services/blog/blog.types'

const DEFAULT_BLOG_IMAGE = '/images/tournament.png'

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
    const imageSrc = item.thumbnail_img?.trim() ? item.thumbnail_img : DEFAULT_BLOG_IMAGE
    const published = formatDate(item.published_at)
    const excerpt = trimText(item.excerpt)

    return (
        <Link
            href={`/blogs/${item.slug}`}
            className="group block h-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
            <div className="relative h-52 overflow-hidden bg-slate-100">
                <Image
                    src={imageSrc}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={95}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="p-4 flex flex-col gap-3 h-[calc(100%-13rem)]">
                <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                    {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                    {excerpt}
                </p>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="font-semibold truncate">{item.author?.name || 'SetMyScore'}</span>
                    {published && <span className="whitespace-nowrap">{published}</span>}
                </div>
            </div>
        </Link>
    )
}
