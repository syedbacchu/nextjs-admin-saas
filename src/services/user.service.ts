import { request } from '@/lib/http/request'

export const UserService = {

    create(data: FormData) {
        return request({
            method: 'POST',
            url: '/admin/tournament/create',
            data,
        })
    },

    update(data: FormData) {
        return request({
            method: 'POST',
            url: '/admin/tournament/update',
            data,
        })
    },

    show(slug: string) {
        return request({
            method: 'GET',
            url: `/admin/tournament/get/${slug}`,
        })
    },
    delete(id: number) {
        return request({
            method: 'GET',
            url: `/admin/tournament/delete/${id}`,
        })
    },

    async collaborators( search: string = '') {
        return request({
            method: 'GET',
            url: '/admin/user/collaborators',
            params: { search },
        })
    },
    toggleStatus(id: number | string, status: string) {
        return request({
            method: 'POST', // POST is standard for actions; PATCH is also good.
            url: `/admin/tournament/toggle-status/${id}`,
            data: { status }, // Sending as JSON object
        })
    },
}
