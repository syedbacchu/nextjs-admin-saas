'use client'

import DynamicTable from '@/components/ui/DynamicTable'
import { TournamentFormData } from '@/services/tournament/tournament.types'
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useState} from "react";
import TableActions from "@/components/ui/TableActions";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import {
    deleteTournamentAction,
    getTournamentsAction,
    toggleTournamentStatusAction
} from "@/services/tournament/tournament.actions"; // Your interface

export default function TournamentListPage() {
    const router = useRouter()
    const [refreshKey, setRefreshKey] = useState(0)

    const handleDelete = async (id: string | number) => {
        try {
            // Ensure strictly number for the API action
            const numericId = Number(id);

            const res = await deleteTournamentAction(numericId);

            if (res.success) {
                toast.success('Deleted successfully');
                setRefreshKey(prev => prev + 1);
            } else {
                toast.error(res.message);
            }
        } catch (_e) {
            toast.error('Failed to delete');
        }
    };

    // Define columns configuration
    const columns = [
        {
            header: '#',
            cell: (_: any, index: number) => <span className="text-gray-500">{index + 1}</span>,
            className: 'w-12 font-medium'
        },
        // { header: 'ID', accessorKey: 'id' as keyof TournamentFormData, className: 'w-16' },
        {
            header: 'Title',
            accessorKey: 'title' as keyof TournamentFormData,
            className: 'font-semibold text-gray-900'
        },
        { header: 'Game', accessorKey: 'game_type' as keyof TournamentFormData },
        {
            header: 'Registration',
            // Custom Cell Render
            cell: (item: any) => (
                <span className={`px-2 py-1 rounded text-xs ${item.is_reg_close ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {item.is_reg_close ? 'Closed' : 'Open'}
                </span>
            )
        },
        {
            header: 'Active Status',
            cell: (item: any) => (
                <ToggleSwitch
                    // ✅ FIX: Convert to string first to handle both 1 and "1"
                    isActive={String(item.status) === '1'}

                    onToggle={async (newState) => {
                        // Prepare data for API (sending string "1" or "0")
                        const apiStatus = newState ? '1' : '0';

                        try {
                            const res = await toggleTournamentStatusAction(item.id, apiStatus);

                            if (res.success) {
                                toast.success("Status updated!");
                                setRefreshKey(prev => prev + 1);
                            } else {
                                toast.error(res.message);
                            }
                        } catch(e) {
                            toast.error("Failed to update status");
                        }
                    }}
                />
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item: any) => (
                <TableActions
                    id={item.id}
                    onDelete={handleDelete}
                    hasEdit={true}
                    editLink={`/admin/tournament/edit/${item.slug}`}
                    hasView={true}
                    viewLink={`/admin/tournament/details/${item.slug}`}
                    hasDelete={true}
                >
                </TableActions>
            )
        }
    ]

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tournaments</h1>
                <button
                    onClick={() => router.push('/admin/tournament/create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Create New
                </button>
            </div>

            <DynamicTable
                key={refreshKey}
                title=""
                fetchData={getTournamentsAction}
                columns={columns}
            />
        </div>
    )
}