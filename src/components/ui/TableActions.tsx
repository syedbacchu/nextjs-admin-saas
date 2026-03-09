import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDeleteForever, MdWarning } from "react-icons/md";

interface TableActionsProps {
    id: string | number;
    onDelete?: (id: string | number) => void;
    hasView?: boolean;
    hasEdit?: boolean;
    hasDelete?: boolean;
    viewLink?: string;
    editLink?: string;
    children?: React.ReactNode;
}

export default function TableActions({
     id,
     onDelete,
     hasView = false,
     hasEdit = false,
     hasDelete = false,
     viewLink,
     editLink,
     children,
 }: TableActionsProps) {
    const router = useRouter();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
                        title="View Details"
                    >
                        <FaEye />
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
                        title="Edit"
                    >
                        <FaEdit />
                    </button>
                )}

                {/* Delete Button */}
                {hasDelete && (
                    <button
                        onClick={() => setIsDeleteOpen(true)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition-colors"
                        title="Delete"
                    >
                        <MdDeleteForever />
                    </button>
                )}
            </div>

            {/* --- Delete Modal --- */}
            {hasDelete && isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="bg-red-50 p-4 flex flex-col items-center border-b border-red-100">
                            <div className="bg-red-100 p-3 rounded-full mb-2">
                                <MdWarning className="text-3xl text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Delete Item?</h3>
                            <p className="text-sm text-gray-500 text-center mt-1">
                                Are you sure? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 p-4 bg-gray-50 justify-center">
                            <button
                                onClick={() => setIsDeleteOpen(false)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-md transition"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}