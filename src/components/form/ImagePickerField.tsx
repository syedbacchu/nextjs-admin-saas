'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { uploadFilesClient, FileSystemItem, getFilesAction } from '@/features/files'

interface ImagePickerFieldProps {
    tenantSlug: string
    label?: string
    value: string
    onChange: (value: string) => void
    initialFiles: FileSystemItem[]
    placeholder?: string
    previewAlt?: string
    uploadFieldName?: string
    triggerLabel?: string
    modalTitle?: string
    modalDescription?: string
    searchPlaceholder?: string
    uploadPrompt?: string
    uploadButtonLabel?: string
    closeButtonLabel?: string
    loadingText?: string
    emptyStateText?: string
}

export default function ImagePickerField({
    tenantSlug,
    label = 'Image',
    value,
    onChange,
    initialFiles,
    placeholder = 'Select from file manager',
    previewAlt = 'Image preview',
    uploadFieldName = 'photo[]',
    triggerLabel = 'Choose Image',
    modalTitle = 'File Manager',
    modalDescription = 'Select an image or upload new files.',
    searchPlaceholder = 'Search files...',
    uploadPrompt = 'No file selected',
    uploadButtonLabel = 'Upload',
    closeButtonLabel = 'Close',
    loadingText = 'Loading files...',
    emptyStateText = 'No files found.',
}: ImagePickerFieldProps) {
    const [pickerOpen, setPickerOpen] = useState(false)
    const [pickerLoading, setPickerLoading] = useState(false)
    const [pickerSearch, setPickerSearch] = useState('')
    const [pickerFiles, setPickerFiles] = useState<FileSystemItem[]>(initialFiles)
    const [pickerUploadFiles, setPickerUploadFiles] = useState<File[]>([])
    const [pickerUploading, setPickerUploading] = useState(false)

    useEffect(() => {
        setPickerFiles(initialFiles)
    }, [initialFiles])

    async function loadPickerFiles(search: string = '') {
        if (!tenantSlug) return

        setPickerLoading(true)
        try {
            const res = await getFilesAction(tenantSlug, 1, search)
            if (res.success) {
                setPickerFiles(res.data?.data || [])
            } else {
                toast.error(res.message || 'Failed to load files')
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setPickerLoading(false)
        }
    }

    async function handlePickerUpload() {
        if (!tenantSlug) return

        if (!pickerUploadFiles.length) {
            toast.error('Please select files to upload')
            return
        }

        setPickerUploading(true)
        try {
            const formData = new FormData()
            pickerUploadFiles.forEach((file) => {
                formData.append(uploadFieldName, file)
            })
            const res = await uploadFilesClient(tenantSlug, formData)
            if (res.success) {
                toast.success(res.message || 'File uploaded successfully')
                setPickerUploadFiles([])
                await loadPickerFiles(pickerSearch)
            } else {
                toast.error(res.message || 'Failed to upload files')
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setPickerUploading(false)
        }
    }

    function openImagePicker() {
        setPickerOpen(true)
        void loadPickerFiles('')
    }

    return (
        <>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <div className="flex flex-col gap-2 md:flex-row">
                    <input
                        type="text"
                        value={value}
                        readOnly
                        placeholder={placeholder}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                    />
                    <button
                        type="button"
                        onClick={openImagePicker}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        {triggerLabel}
                    </button>
                </div>
                {value && (
                    <div className="h-24 w-24 overflow-hidden rounded border border-slate-200 bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt={previewAlt} className="h-full w-full object-cover" />
                    </div>
                )}
            </div>

            {pickerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{modalTitle}</h3>
                                <p className="text-sm text-slate-600">{modalDescription}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPickerOpen(false)}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                            >
                                {closeButtonLabel}
                            </button>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                            <input
                                type="text"
                                value={pickerSearch}
                                onChange={(e) => setPickerSearch(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => loadPickerFiles(pickerSearch.trim())}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                            >
                                Search
                            </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <input
                                type="file"
                                multiple
                                onChange={(e) => setPickerUploadFiles(Array.from(e.target.files || []))}
                                className="rounded border border-gray-300 px-3 py-2 text-sm"
                            />
                            <button
                                type="button"
                                onClick={handlePickerUpload}
                                disabled={pickerUploading}
                                className="rounded-lg bg-purple-800 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60"
                            >
                                {pickerUploading ? 'Uploading...' : uploadButtonLabel}
                            </button>
                            <span className="text-sm text-slate-500">
                                {pickerUploadFiles.length ? `${pickerUploadFiles.length} file(s) selected` : uploadPrompt}
                            </span>
                        </div>

                        {pickerLoading ? (
                            <div className="py-10 text-center text-sm text-slate-500">{loadingText}</div>
                        ) : (
                            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                                {pickerFiles.length > 0 ? pickerFiles.map((file) => (
                                    <button
                                        key={file.id}
                                        type="button"
                                        onClick={() => {
                                            onChange(file.full_url || '')
                                            setPickerOpen(false)
                                        }}
                                        className={`overflow-hidden rounded-xl border text-left transition ${
                                            value === (file.full_url || '')
                                                ? 'border-slate-900 ring-2 ring-slate-200'
                                                : 'border-slate-200 hover:border-slate-400'
                                        }`}
                                    >
                                        <div className="h-28 w-full bg-slate-50">
                                            {file.full_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={file.full_url} alt={file.alt_text || file.original_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">N/A</div>
                                            )}
                                        </div>
                                        <div className="p-2">
                                            <p className="line-clamp-1 text-xs font-medium text-slate-700">{file.original_name}</p>
                                        </div>
                                    </button>
                                )) : (
                                    <div className="col-span-full py-10 text-center text-sm text-slate-500">
                                        {emptyStateText}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
