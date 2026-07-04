'use client'

import {
    FileSystemMutationResponse,
    FileSystemUploadResponse,
    deleteFileAction,
    updateFileAction,
    uploadFilesAction,
} from "@/features/files"

export async function uploadFilesClient(
    tenantSlug: string,
    formData: FormData,
): Promise<FileSystemUploadResponse> {
    return uploadFilesAction(tenantSlug, formData)
}

export async function updateFileClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<FileSystemMutationResponse> {
    return updateFileAction(tenantSlug, id, formData)
}

export async function deleteFileClient(
    tenantSlug: string,
    id: number | string,
): Promise<FileSystemMutationResponse> {
    return deleteFileAction(tenantSlug, id)
}
