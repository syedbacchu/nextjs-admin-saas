'use client'

import { useState } from 'react'

interface GenericImageDisplayProps {
    src: string // Mandatory image link
    alt?: string // Alt text for the image
    width?: string // Width of the container (e.g., '100%', '500px', '400px')
    height?: string // Height of the container (e.g., 'auto', '400px', '300px')
    className?: string // Additional CSS classes
}

export default function GenericImageDisplay({
    src,
    alt = 'Image',
    width = '400px',
    height = '300px',
    className = '',
}: GenericImageDisplayProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            {/* Medium size image */}
            <div
                className={`cursor-pointer overflow-hidden rounded-lg border border-slate-200 shadow-sm transition-shadow hover:shadow-md ${className}`}
                style={{ width, height }}
                onClick={() => setIsModalOpen(true)}
            >
                <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Modal for full image */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900 bg-opacity-75 p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="relative max-h-[90vh] max-w-[90vw]">
                        <img
                            src={src}
                            alt={alt}
                            className="max-h-[90vh] max-w-[90vw] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
