'use client'

interface ListImageProps {
    image?: string | null
    name?: string | null
    alt?: string
    fallbackText?: string
    sizeClassName?: string
    className?: string
}

function getFallbackText(name?: string | null, fallbackText?: string): string {
    const initial = String(name || '').trim().charAt(0).toUpperCase()
    return initial || fallbackText || 'N'
}

export default function ListImage({
    image,
    name,
    alt,
    fallbackText,
    sizeClassName = 'h-10 w-10',
    className = '',
}: ListImageProps) {
    return (
        <div className={`flex items-center ${className}`}>
            <div className={`${sizeClassName} overflow-hidden rounded-full border border-slate-200 bg-slate-100`}>
                {image ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt={alt || name || 'List image'} className="h-full w-full object-cover" />
                    </>
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-600">
                        {getFallbackText(name, fallbackText)}
                    </div>
                )}
            </div>
        </div>
    )
}
