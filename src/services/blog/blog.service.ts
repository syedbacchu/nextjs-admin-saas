import { request } from '@/lib/http/request'

export const BlogService = {
    async publicList(page: number = 1, search: string = '') {
        return request({
            method: 'GET',
            url: '/blogs',
            params: { page, search },
        })
    },

    details(slug: string) {
        return request({
            method: 'GET',
            url: `/blogs/${slug}`,
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
