'use client'

import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'
import { MdWarning } from 'react-icons/md'

interface DeleteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    message?: string
    itemName?: string
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    itemName,
}: DeleteConfirmationModalProps) {
    const { language } = useI18n()

    if (!isOpen) return null

    const defaultTitle = translateUiText('Delete Item?', language)
    const defaultMessage = translateUiText('Are you sure? This action cannot be undone.', language)
    const cancelText = translateUiText('Cancel', language)
    const confirmText = translateUiText('Yes, Delete', language)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                {/* Header with Warning Icon */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 flex flex-col items-center border-b border-red-200">
                    <div className="bg-red-100 p-4 rounded-full mb-3 shadow-sm">
                        <MdWarning className="text-4xl text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center">
                        {title || defaultTitle}
                    </h3>
                    {itemName && (
                        <p className="text-sm font-semibold text-red-700 mt-1 text-center">
                            &quot;{itemName}&quot;
                        </p>
                    )}
                </div>

                {/* Message Body */}
                <div className="p-6 bg-white">
                    <p className="text-sm text-gray-600 text-center leading-relaxed">
                        {message || defaultMessage}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 p-4 bg-gray-50 justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition shadow-sm hover:shadow-md"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-md hover:shadow-lg transition transform hover:scale-105"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
