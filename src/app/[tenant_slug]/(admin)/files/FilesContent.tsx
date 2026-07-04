'use client'

import { FormEvent, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { FaEdit } from 'react-icons/fa'
import DynamicTable from '@/components/ui/DynamicTable'
import TableActions from '@/components/ui/TableActions'
import TextInput from '@/components/form/TextInput'
import { ColumnDef } from '@/types/api'
import {
    FileSystemItem,
    FileSystemListResponse,
    getFilesAction,
    deleteFileClient,
    updateFileClient,
    uploadFilesClient,
} from '@/features/files'

const EMPTY_FILE_LIST: FileSystemListResponse = {
    success: false,
    message: 'Invalid tenant',
    status: 400,
    error_message: '',
    data: {
        total_count: 0,
        total_page: 1,
        per_page: 20,
        current_page: 1,
        data: [],
    },
}

function formatDate(value?: string | null): string {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

function formatSize(value?: number | null): string {
    if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A'
    if (value < 1024) return `${value} B`
    const kb = value / 1024
    if (kb < 1024) return `${kb.toFixed(2)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(2)} MB`
}

export default function FilesContent() {
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()

    const [refreshKey, setRefreshKey] = useState(0)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)

    const [editItem, setEditItem] = useState<FileSystemItem | null>(null)
    const [savingMeta, setSavingMeta] = useState(false)
    const [altText, setAltText] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [seoKeywords, setSeoKeywords] = useState('')
    const [seoTitle, setSeoTitle] = useState('')
    const [seoDescription, setSeoDescription] = useState('')

    const columns: ColumnDef<FileSystemItem>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        {
            header: 'Preview',
            cell: (item) => (
                <div className="relative h-12 w-12 overflow-hidden rounded border border-slate-200 bg-slate-50">
                    {item.full_url ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.full_url} alt={item.alt_text || item.filename} className="h-full w-full object-cover" />
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">N/A</div>
                    )}
                </div>
            ),
        },
        { header: 'Original Name', accessorKey: 'original_name' },
        { header: 'Type', cell: (item) => <span>{item.type || item.extension || 'N/A'}</span> },
        { header: 'Size', cell: (item) => <span>{formatSize(item.size)}</span> },
        { header: 'Dimensions', cell: (item) => <span>{item.dimensions || 'N/A'}</span> },
        { header: 'Created', cell: (item) => <span>{formatDate(item.created_at)}</span> },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <TableActions
                    id={item.id}
                    hasDelete
                    onDelete={handleDelete}
                    itemName={item.original_name}
                    deleteTitle="Delete File?"
                    deleteMessage="Are you sure you want to delete this file? This action cannot be undone."
                >
                    <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="text-emerald-600 hover:text-emerald-800"
                        title="Edit Metadata"
                    >
                        <FaEdit />
                    </button>
                </TableActions>
            ),
        },
    ]

    function openEditModal(item: FileSystemItem) {
        setEditItem(item)
        setAltText(item.alt_text || '')
        setTitle(item.title || '')
        setDescription(item.description || '')
        setSeoKeywords(item.seo_keywords || '')
        setSeoTitle(item.seo_title || '')
        setSeoDescription(item.seo_description || '')
    }

    function closeEditModal() {
        setEditItem(null)
        setAltText('')
        setTitle('')
        setDescription('')
        setSeoKeywords('')
        setSeoTitle('')
        setSeoDescription('')
    }

    async function fetchFiles(page: number, search: string) {
        if (!tenantSlug) return EMPTY_FILE_LIST
        return getFilesAction(tenantSlug, page, search)
    }

    async function handleDelete(id: number | string) {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteFileClient(tenantSlug, id)

        if (res.success) {
            toast.success(res.message || 'File deleted successfully')
            setRefreshKey((prev) => prev + 1)
        } else {
            toast.error(res.message || 'Failed to delete file')
        }
    }

    async function handleUpload(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        if (!selectedFiles.length) {
            toast.error('Please select at least one file')
            return
        }

        setUploading(true)
        try {
            const formData = new FormData()
            selectedFiles.forEach((file) => {
                formData.append('photo[]', file)
            })

            const res = await uploadFilesClient(tenantSlug, formData)
            if (res.success) {
                toast.success(res.message || 'File uploaded successfully')
                setSelectedFiles([])
                setRefreshKey((prev) => prev + 1)
            } else {
                toast.error(res.message || 'Failed to upload files')
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setUploading(false)
        }
    }

    async function handleMetadataUpdate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!tenantSlug || !editItem) {
            toast.error('Invalid request')
            return
        }

        setSavingMeta(true)
        try {
            const formData = new FormData()
            formData.append('alt_text', altText.trim())
            formData.append('title', title.trim())
            formData.append('description', description.trim())
            formData.append('seo_keywords', seoKeywords.trim())
            formData.append('seo_title', seoTitle.trim())
            formData.append('seo_description', seoDescription.trim())

            const res = await updateFileClient(tenantSlug, editItem.id, formData)
            if (res.success) {
                toast.success(res.message || 'File metadata updated successfully')
                closeEditModal()
                setRefreshKey((prev) => prev + 1)
            } else {
                toast.error(res.message || 'Failed to update metadata')
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setSavingMeta(false)
        }
    }

    return (
        <div className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">File Manager</h1>
                <p className="mt-1 text-sm text-slate-600">Upload files and maintain file metadata.</p>

                <form onSubmit={handleUpload} className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                    <input
                        type="file"
                        multiple
                        onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm md:max-w-md"
                    />
                    <button
                        type="submit"
                        disabled={uploading}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                    <span className="text-sm text-slate-500">
                        {selectedFiles.length ? `${selectedFiles.length} file(s) selected` : 'No file selected'}
                    </span>
                </form>
            </section>

            <DynamicTable
                key={refreshKey}
                title="Files"
                fetchData={fetchFiles}
                columns={columns}
            />

            {editItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Edit File Metadata</h2>
                            <p className="text-sm text-slate-600">{editItem.original_name}</p>
                        </div>

                        <form onSubmit={handleMetadataUpdate} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <TextInput
                                    label="Alt Text"
                                    name="alt_text"
                                    value={altText}
                                    onChange={setAltText}
                                    placeholder="Alt text"
                                />
                                <TextInput
                                    label="Title"
                                    name="title"
                                    value={title}
                                    onChange={setTitle}
                                    placeholder="Title"
                                />
                                <TextInput
                                    label="SEO Keywords"
                                    name="seo_keywords"
                                    value={seoKeywords}
                                    onChange={setSeoKeywords}
                                    placeholder="keywords, one"
                                />
                                <TextInput
                                    label="SEO Title"
                                    name="seo_title"
                                    value={seoTitle}
                                    onChange={setSeoTitle}
                                    placeholder="SEO title"
                                />
                            </div>

                            <TextInput
                                label="Description"
                                name="description"
                                value={description}
                                onChange={setDescription}
                                placeholder="Description"
                                textarea
                                rows={3}
                            />

                            <TextInput
                                label="SEO Description"
                                name="seo_description"
                                value={seoDescription}
                                onChange={setSeoDescription}
                                placeholder="SEO description"
                                textarea
                                rows={3}
                            />

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingMeta}
                                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                                >
                                    {savingMeta ? 'Saving...' : 'Update Metadata'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
