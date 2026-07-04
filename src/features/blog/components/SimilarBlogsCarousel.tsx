'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BlogListItem } from '@/features/blog'
import { isUnoptimizedBlogImage, resolveBlogImageUrl } from '@/features/blog/utils/resolveBlogImage'

interface SimilarBlogsCarouselProps {
    items: BlogListItem[]
}

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

function trimText(text?: string | null, length: number = 120) {
    if (!text) return ''
    const normalized = text.replace(/\s+/g, ' ').trim()
    if (normalized.length <= length) return normalized
    return `${normalized.slice(0, length).trim()}...`
}

export default function SimilarBlogsCarousel({ items }: SimilarBlogsCarouselProps) {
    const trackRef = useRef<HTMLDivElement>(null)

    const scrollByAmount = (direction: 'prev' | 'next') => {
        const track = trackRef.current
        if (!track) return

        const amount = Math.max(track.clientWidth * 0.85, 280)
        track.scrollBy({
            left: direction === 'next' ? amount : -amount,
            behavior: 'smooth',
        })
    }

    if (!items.length) return null

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Similar Blogs</h2>
                    <p className="mt-1 text-sm text-slate-500">Related posts you may want to read next.</p>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <button
                        type="button"
                        onClick={() => scrollByAmount('prev')}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50"
                        aria-label="Scroll similar blogs left"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollByAmount('next')}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50"
                        aria-label="Scroll similar blogs right"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div
                ref={trackRef}
                className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {items.map((item) => {
                    const imageSrc = resolveBlogImageUrl(item.thumbnail_img, item.featured_img)
                    const published = formatDate(item.published_at)

                    return (
                        <article
                            key={item.id}
                            className="group w-[85%] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:w-[20rem] lg:w-[22rem]"
                        >
                            <Link href={`/blogs/${item.slug}`} className="block">
                                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                                    <Image
                                        src={imageSrc}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 640px) 85vw, 352px"
                                        unoptimized={isUnoptimizedBlogImage(imageSrc)}
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            </Link>

                            <div className="p-4">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                    <span className="font-semibold text-slate-700">{item.author?.name || 'SetMyScore'}</span>
                                    {published && <span>{published}</span>}
                                </div>

                                <Link href={`/blogs/${item.slug}`} className="mt-3 block">
                                    <h3 className="line-clamp-2 text-lg font-bold leading-7 text-slate-900 transition-colors group-hover:text-blue-700">
                                        {item.title}
                                    </h3>
                                </Link>

                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                                    {trimText(item.excerpt)}
                                </p>

                                <Link
                                    href={`/blogs/${item.slug}`}
                                    className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
                                >
                                    Read article
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}
