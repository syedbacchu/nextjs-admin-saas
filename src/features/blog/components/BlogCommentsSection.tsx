'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { getBlogCommentsAction, submitBlogCommentAction, BlogComment } from '@/features/blog'

interface Props {
    slug: string
}

interface CommentFormState {
    name: string
    email: string
    comment: string
}

function formatDate(value?: string) {
    if (!value) return ''
    const date = new Date(value.replace(' ', 'T'))
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function CommentCard({ comment, depth = 0 }: { comment: BlogComment; depth?: number }) {
    const dateText = formatDate(comment.created_at)
    const initials = comment.name?.trim()?.charAt(0)?.toUpperCase() || 'U'

    return (
        <div className={depth > 0 ? 'ml-4 md:ml-8 mt-3 border-l-2 border-slate-200 pl-3 md:pl-4' : ''}>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{comment.name}</p>
                        {dateText && <p className="text-xs text-slate-500">{dateText}</p>}
                    </div>
                </div>

                <p className="text-sm text-slate-700 mt-3 whitespace-pre-line leading-relaxed">
                    {comment.comment}
                </p>
            </div>

            {comment.replies?.map((reply) => (
                <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
            ))}
        </div>
    )
}

export default function BlogCommentsSection({ slug }: Props) {
    const [comments, setComments] = useState<BlogComment[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)

    const [form, setForm] = useState<CommentFormState>({
        name: '',
        email: '',
        comment: '',
    })

    const hasMore = useMemo(() => currentPage < totalPage, [currentPage, totalPage])

    const loadComments = useCallback(async (page: number = 1, append: boolean = false) => {
        if (page === 1) {
            setLoading(true)
        } else {
            setLoadingMore(true)
        }

        try {
            const res = await getBlogCommentsAction(slug, page)

            if (!res.success) {
                toast.error(res.message || 'Failed to load comments')
                return
            }

            const rows = res.data?.data || []
            setComments((prev) => (append ? [...prev, ...rows] : rows))
            setCurrentPage(res.data?.current_page || 1)
            setTotalPage(res.data?.total_page || 1)
            setTotalCount(res.data?.total_count || rows.length)
        } catch (error) {
            console.error(error)
            toast.error('Failed to load comments')
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }, [slug])

    useEffect(() => {
        loadComments(1, false)
    }, [loadComments])

    const handleChange = (key: keyof CommentFormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const name = form.name.trim()
        const email = form.email.trim()
        const comment = form.comment.trim()

        if (!name) {
            toast.error('Name is required')
            return
        }
        if (!email || !isValidEmail(email)) {
            toast.error('A valid email is required')
            return
        }
        if (!comment) {
            toast.error('Comment is required')
            return
        }

        setSubmitting(true)
        try {
            const data = new FormData()
            data.append('name', name)
            data.append('email', email)
            data.append('comment', comment)

            const res = await submitBlogCommentAction(slug, data)

            if (res.success) {
                toast.success(res.message || 'Comment submitted successfully')
                setForm({ name: '', email: '', comment: '' })
                await loadComments(1, false)
            } else {
                toast.error(res.message || 'Failed to submit comment')
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to submit comment')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 md:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Comments</h2>
                <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {totalCount} Total
                </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-semibold text-slate-700">Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="Your name"
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-700">Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="your@email.com"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Comment</label>
                    <textarea
                        rows={4}
                        value={form.comment}
                        onChange={(e) => handleChange('comment', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="Write your comment"
                    />
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold disabled:opacity-60"
                    >
                        {submitting ? 'Submitting...' : 'Post Comment'}
                    </button>
                </div>
            </form>

            <div className="mt-8 space-y-4">
                {loading && (
                    <div className="text-sm text-slate-500">Loading comments...</div>
                )}

                {!loading && comments.length === 0 && (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                        No comments yet. Be the first to comment.
                    </div>
                )}

                {!loading && comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                ))}

                {hasMore && (
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => loadComments(currentPage + 1, true)}
                            disabled={loadingMore}
                            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                        >
                            {loadingMore ? 'Loading...' : 'Load More Comments'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}
