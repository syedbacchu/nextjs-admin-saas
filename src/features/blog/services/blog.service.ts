import { request } from '@/lib/http/request'

export const BlogService = {
    async publicList(
        page: number = 1,
        search: string = '',
        category?: string,
        tag?: string,
        is_featured?: number | string,
        is_match_coverage?: number | string,
        is_top_story?: number | string,
    ) {
        return request({
            method: 'GET',
            url: '/blogs',
            params: {
                page,
                search,
                category,
                category_slug: category,
                tag,
                tag_slug: tag,
                is_featured,
                is_match_coverage,
                is_top_story,
            },
        })
    },

    details(slug: string) {
        return request({
            method: 'GET',
            url: `/blogs/${slug}`,
        })
    },

    summary() {
        return request({
            method: 'GET',
            url: '/blogs/summary',
        })
    },

    comments(slug: string, page: number = 1) {
        return request({
            method: 'GET',
            url: `/blogs/${slug}/comments`,
            params: { page },
        })
    },

    submitComment(slug: string, data: FormData) {
        return request({
            method: 'POST',
            url: `/blogs/${slug}/comments`,
            data,
        })
    },
}
