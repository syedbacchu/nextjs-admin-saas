'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEdit, FaPrint } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal'

interface TableActionsProps {
    id: string | number;
    onDelete?: (id: string | number) => void;
    hasView?: boolean;
    hasPrint?: boolean;
    hasEdit?: boolean;
    hasDelete?: boolean;
    viewLink?: string;
    printLink?: string;
    editLink?: string;
    itemName?: string;
    deleteTitle?: string;
    deleteMessage?: string;
    children?: React.ReactNode;
}

export default function TableActions({
     id,
     onDelete,
     hasView = false,
     hasPrint = false,
     hasEdit = false,
     hasDelete = false,
     viewLink,
     printLink,
     editLink,
     itemName,
     deleteTitle,
     deleteMessage,
     children,
 }: TableActionsProps) {
    const router = useRouter();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { language } = useI18n()

    const confirmDelete = () => {
        if (onDelete) {
            onDelete(id);
        }
        setIsDeleteOpen(false);
    };

    return (
        <>
            <div className="flex justify-end gap-3 items-center">
                {/* --- Custom Actions --- */}
                {children}

                {/* --- Standard Actions --- */}

                {/* View Button */}
                {hasView && (
                    <button
                        // ✅ FIX: Only navigate if viewLink is defined
                        onClick={() => viewLink && router.push(viewLink)}
                        // Optional: Disable button visually if no link provided
                        disabled={!viewLink}
                        className={`flex items-center gap-1 font-medium transition-colors ${
                            viewLink
                                ? "text-blue-600 hover:text-blue-800 cursor-pointer"
                                : "text-gray-400 cursor-not-allowed"
                        }`}
                        title={translateUiText('View Details', language)}
                    >
                        <FaEye />
                    </button>
                )}

                {/* Print Button */}
                {hasPrint && (
                    <button
                        onClick={() => printLink && window.open(printLink, '_blank')}
                        disabled={!printLink}
                        className={`flex items-center gap-1 font-medium transition-colors ${
                            printLink
                                ? "text-slate-700 hover:text-slate-950 cursor-pointer"
                                : "text-gray-400 cursor-not-allowed"
                        }`}
                        title={translateUiText('Print Chalan', language)}
                    >
                        <FaPrint />
                    </button>
                )}

                {/* Edit Button */}
                {hasEdit && (
                    <button
                        // ✅ FIX: Only navigate if editLink is defined
                        onClick={() => editLink && router.push(editLink)}
                        disabled={!editLink}
                        className={`flex items-center gap-1 font-medium transition-colors ${
                            editLink
                                ? "text-emerald-600 hover:text-emerald-800 cursor-pointer"
                                : "text-gray-400 cursor-not-allowed"
                        }`}
                        title={translateUiText('Edit', language)}
                    >
                        <FaEdit />
                    </button>
                )}

                {/* Delete Button */}
                {hasDelete && (
                    <button
                        onClick={() => setIsDeleteOpen(true)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition-colors"
                        title={translateUiText('Delete', language)}
                    >
                        <MdDeleteForever />
                    </button>
                )}
            </div>

            {/* --- Delete Confirmation Modal --- */}
            {hasDelete && (
                <DeleteConfirmationModal
                    isOpen={isDeleteOpen}
                    onClose={() => setIsDeleteOpen(false)}
                    onConfirm={confirmDelete}
                    title={deleteTitle}
                    message={deleteMessage}
                    itemName={itemName}
                />
            )}
        </>
    );
}
