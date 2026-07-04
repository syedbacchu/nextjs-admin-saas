'use server'

import { revalidatePath } from 'next/cache'
import {
    FileSystemListResponse,
    FileSystemMutationResponse,
    FileSystemUploadResponse,
    FileSystemService
} from "@/features/files"

function revalidateFilePaths(tenantSlug: string) {
    revalidatePath(`/${tenantSlug}/files`)
}

export async function getFilesAction(
    tenantSlug: string,
    page: number,
    search: string,
): Promise<FileSystemListResponse> {
    return FileSystemService.list(tenantSlug, page, search)
}

export async function uploadFilesAction(
    tenantSlug: string,
    formData: FormData,
): Promise<FileSystemUploadResponse> {
    const res = await FileSystemService.upload(tenantSlug, formData)
    if (res.success) {
        revalidateFilePaths(tenantSlug)
    }
    return res
}

export async function updateFileAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<FileSystemMutationResponse> {
    const res = await FileSystemService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidateFilePaths(tenantSlug)
    }
    return res
}

export async function deleteFileAction(
    tenantSlug: string,
    id: number | string,
): Promise<FileSystemMutationResponse> {
    const res = await FileSystemService.delete(tenantSlug, id)
    if (res.success) {
        revalidateFilePaths(tenantSlug)
    }
    return res
}
