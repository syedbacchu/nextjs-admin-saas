'use client'

import { useState, useEffect } from 'react'
import { useFieldValidation } from '@/hooks/useFieldValidation'

interface GalleryUploadProps {
    label: string
    files: File[]
    onChange: (files: File[]) => void
    validators?: ((files: File[]) => string | null)[]
    accept?: string
    maxFiles?: number
}

export default function GalleryUpload({
                                          label,
                                          files,
                                          onChange,
                                          validators = [],
                                          accept,
                                          maxFiles = 10,
                                      }: GalleryUploadProps) {
    const { error, validate } = useFieldValidation(files, validators)
    const [previews, setPreviews] = useState<string[]>([])

    // Generate previews
    useEffect(() => {
        const newPreviews: string[] = []

        files.forEach((file) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                newPreviews.push(reader.result as string)
                if (newPreviews.length === files.length) {
                    setPreviews(newPreviews)
                }
            }
            reader.readAsDataURL(file)
        })

        if (files.length === 0) setPreviews([])
    }, [files])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        let newFiles = [...files, ...selectedFiles]

        if (newFiles.length > maxFiles) {
            newFiles = newFiles.slice(0, maxFiles)
        }

        onChange(newFiles)
    }

    const removeImage = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index)
        onChange(updatedFiles)
    }

    return (
        <div className="flex flex-col gap-2">
            <label className="font-medium">{label}</label>
            <input
                type="file"
                accept={accept}
                multiple
                onChange={handleFileChange}
                onBlur={validate}
                className="border rounded px-3 py-2 focus:outline-none focus:ring"
            />

            {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                    {previews.map((src, index) => (
                        <div key={index} className="relative">
                            <img
                                src={src}
                                alt={`Preview ${index + 1}`}
                                className="h-24 w-24 object-cover rounded border"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    )
}
