import { request } from '@/lib/http/request'
import {
    FileSystemItem,
    FileSystemListData,
    FileSystemListResponse,
    FileSystemMutationResponse,
    FileSystemUploadResponse,
} from "@/features/files"

export const FileSystemService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<FileSystemListResponse> {
        return request<FileSystemListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/files`,
            params: { page, search },
        })
    },

    upload(tenantSlug: string, data: FormData): Promise<FileSystemUploadResponse> {
        return request<FileSystemItem[]>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/files/upload`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<FileSystemMutationResponse> {
        return request<FileSystemItem>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/files/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<FileSystemMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/files/${id}`,
        })
    },
}
