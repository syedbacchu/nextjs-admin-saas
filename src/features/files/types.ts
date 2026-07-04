import { ApiResponse } from '@/types/api'

export interface FileSystemItem {
    id: number
    filename: string
    original_name: string
    type?: string | null
    extension?: string | null
    size?: number | null
    path?: string | null
    full_url?: string | null
    dimensions?: string | null
    alt_text?: string | null
    title?: string | null
    description?: string | null
    seo_keywords?: string | null
    seo_title?: string | null
    seo_description?: string | null
    uploaded_by?: number | null
    created_at?: string
    updated_at?: string
}

export interface FileSystemListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: FileSystemItem[]
}

export interface FileSystemUpdatePayload {
    alt_text?: string
    title?: string
    description?: string
    seo_keywords?: string
    seo_title?: string
    seo_description?: string
}

export type FileSystemListResponse = ApiResponse<FileSystemListData>
export type FileSystemUploadResponse = ApiResponse<FileSystemItem[]>
export type FileSystemMutationResponse = ApiResponse<FileSystemItem | unknown[]>
