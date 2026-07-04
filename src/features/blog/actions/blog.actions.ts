'use server'

import { BlogService, BlogCommentsResponse, BlogDetailsResponse, BlogListResponse} from '@/features/blog'

export async function getBlogPublicListAction(
    page: number,
    search: string,
    category?: string,
    tag?: string,
    is_featured?: number | string,
    is_match_coverage?: number | string,
    is_top_story?: number | string,
): Promise<BlogListResponse> {
    const response = await BlogService.publicList(
        page,
        search,
        category,
        tag,
        is_featured,
        is_match_coverage,
        is_top_story,
    )
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
