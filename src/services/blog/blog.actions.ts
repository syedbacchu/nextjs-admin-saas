'use server'

import { BlogService } from '@/services/blog/blog.service'
import { BlogCommentsResponse, BlogDetailsResponse, BlogListResponse } from '@/services/blog/blog.types'

export async function getBlogPublicListAction(
    page: number,
    search: string,
): Promise<BlogListResponse> {
    const response = await BlogService.publicList(page, search)
    return response as unknown as BlogListResponse
}

export async function getBlogPublicAction(slug: string): Promise<BlogDetailsResponse> {
    const response = await BlogService.details(slug)
    return response as unknown as BlogDetailsResponse
}

export async function getBlogCommentsAction(
    slug: string,
    page: number = 1,
): Promise<BlogCommentsResponse> {
    const response = await BlogService.comments(slug, page)
    return response as unknown as BlogCommentsResponse
}

export async function submitBlogCommentAction(slug: string, data: FormData) {
    return await BlogService.submitComment(slug, data)
}
