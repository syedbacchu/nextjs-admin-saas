'use client'

import { useState, useEffect, ChangeEvent, useRef } from 'react'

interface FileUploadProps {
    label: string
    name: string
    value?: File | string | null
    onChange: (file: File | null) => void
    error?: string
    accept?: string
}

export default function FileUploadInput({
                                            label,
                                            name,
                                            value,
                                            onChange,
                                            error,
                                            accept = 'image/png, image/jpeg, image/jpg, image/gif',
                                        }: FileUploadProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const [localError, setLocalError] = useState<string | null>(null)

    // 1. Create a ref to control the input element directly
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!value) {
            setPreview(null)
            return
        }

        if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value)
            setPreview(objectUrl)
            return () => URL.revokeObjectURL(objectUrl)
        }

        if (typeof value === 'string') {
            setPreview(value)
        }
    }, [value])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setLocalError(null)

        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
            if (!validTypes.includes(file.type)) {
                setLocalError('Only JPG, PNG, and GIF formats are allowed.')
                return
            }

            const maxSizeInBytes = 1024 * 1024 // 1MB
            if (file.size > maxSizeInBytes) {
                setLocalError('File size must be less than 1MB.')
                return
            }
        }

        onChange(file)
    }

    // 2. Helper function to trigger the hidden input
    const handleContainerClick = () => {
        inputRef.current?.click()
    }

    const displayError = localError || error

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium text-gray-700">{label}</label>

            {/* 3. Added onClick to the main container */}
            <div
                onClick={handleContainerClick}
                className={`border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition-colors text-center cursor-pointer relative group ${displayError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            >
                {/* 4. Input is now hidden and controlled via ref */}
                <input
                    ref={inputRef}
                    type="file"
                    name={name}
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                />

                {preview ? (
                    <div className="relative w-full h-48">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain rounded"
                        />
                        {/* Added group-hover to ensure this shows up when hovering the parent div */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium rounded">
                            Click to Change
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span className="text-xs">Click to upload image</span>
                        <span className="text-[10px] text-gray-400 mt-1">(Max 1MB)</span>
                    </div>
                )}
            </div>

            {displayError && <span className="text-red-500 text-xs">{displayError}</span>}
        </div>
    )
}
