'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Search, Eye, IndianRupee, Loader2, FileText, Calendar, Trash2 } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import {deleteGeneratedSalaryClient} from "@/features/generate-salary";
import PayableAmountModal from "@/features/salary-expenses/components/PayableAmountModal";
import PaymentHistoryModal from "@/features/salary-expenses/components/PaymentHistoryModal";

interface GenerateSalaryListClientProps {
    tenantSlug: string
    initialData: {
        data: GeneratedSalary[]
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
    currentPage: number
    searchQuery: string
}

export default function GenerateSalaryListClient({
    tenantSlug,
    initialData,
    currentPage,
    searchQuery,
}: GenerateSalaryListClientProps) {
    const router = useRouter()
    const [search, setSearch] = useState(searchQuery)
    const [loading, setLoading] = useState(false)
    const [payableModalOpen, setPayableModalOpen] = useState(false)
    const [historyModalOpen, setHistoryModalOpen] = useState(false)
    const [selectedSalarySheetId, setSelectedSalarySheetId] = useState<number | null>(null)

    const debouncedSearch = useDebounce(search, 500)

    const updateUrl = (page?: number, searchValue?: string) => {
        const params = new URLSearchParams()
        if (page) params.set('page', String(page))
        if (searchValue) params.set('search', searchValue)
        router.push(`/${tenantSlug}/generate-salaries?${params.toString()}`)
    }

    const handleSearchChange = (value: string) => {
        setSearch(value)
        updateUrl(undefined, value)
    }

    const handlePageChange = (page: number) => {
        updateUrl(page, debouncedSearch)
    }

    const handleViewPayable = (salarySheetId: number) => {
        setSelectedSalarySheetId(salarySheetId)
        setPayableModalOpen(true)
    }

    const handleViewHistory = (salarySheetId: number) => {
        setSelectedSalarySheetId(salarySheetId)
        setHistoryModalOpen(true)
    }

    const handleProcessPayment = (salarySheetId: number) => {
        router.push(`/${tenantSlug}/generate-salaries/${salarySheetId}/pay`)
    }

    const handleDelete = async (id: number, month: string) => {
        if (!confirm(`Are you sure you want to delete the salary sheet for ${month}? This action cannot be undone.`)) {
            return
        }

        setLoading(true)
        try {
            const res = await deleteGeneratedSalaryClient(tenantSlug, id)
            if (res.success) {
                toast.success(res.message || 'Salary sheet deleted successfully')
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to delete salary sheet')
            }
        } catch (error) {
            console.error('Error deleting salary sheet:', error)
            toast.error('Server error')
        } finally {
            setLoading(false)
        }
    }

    const getPaymentStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        Paid
                    </span>
                )
            case 'partial':
                return (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
                        Partial
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                        Unpaid
                    </span>
                )
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-100"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Generated Salaries</h1>
                        <p className="text-sm text-slate-600">Manage salary sheets and process payments</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => router.push(`/${tenantSlug}/generate-salaries/create`)}
                    className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    <FileText className="h-4 w-4" />
                    Generate Salary
                </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 p-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search by month or employee name..."
                            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-slate-500 focus:outline-none"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                ) : initialData.data.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Month</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Generate Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Employees</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700">
                                        Total Payable
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700">Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {initialData.data.map((generatedSalary) => (
                                    <tr key={generatedSalary.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-slate-400" />
                                                {generatedSalary.month}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(generatedSalary.generate_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            {generatedSalary.summary?.total_employee || 0} employees
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">
                                            BDT {' '}
                                            {(generatedSalary.summary?.grand_total_net_payable || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getPaymentStatusBadge(
                                                generatedSalary.salary_sheet && generatedSalary.salary_sheet.length > 0
                                                    ? generatedSalary.salary_sheet.every((s) => s.payment_status === 'paid')
                                                        ? 'paid'
                                                        : generatedSalary.salary_sheet.some((s) => s.payment_status === 'partial')
                                                          ? 'partial'
                                                          : 'unpaid'
                                                    : 'unpaid'
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => router.push(`/${tenantSlug}/generate-salaries/${generatedSalary.id}`)}
                                                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
                                                >
                                                    View Sheet
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(generatedSalary.id, generatedSalary.month)}
                                                    className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200"
                                                    disabled={loading}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <FileText className="h-12 w-12 text-slate-300" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">No generated salaries found</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            {search ? 'Try adjusting your search' : 'Generate your first salary sheet to get started'}
                        </p>
                    </div>
                )}

                {initialData.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                        <p className="text-sm text-slate-600">
                            Page {initialData.current_page} of {initialData.last_page}
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === initialData.last_page}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {selectedSalarySheetId && (
                <>
                    <PayableAmountModal
                        tenantSlug={tenantSlug}
                        salarySheetId={selectedSalarySheetId}
                        isOpen={payableModalOpen}
                        onClose={() => {
                            setPayableModalOpen(false)
                            setSelectedSalarySheetId(null)
                        }}
                    />
                    <PaymentHistoryModal
                        tenantSlug={tenantSlug}
                        salarySheetId={selectedSalarySheetId}
                        isOpen={historyModalOpen}
                        onClose={() => {
                            setHistoryModalOpen(false)
                            setSelectedSalarySheetId(null)
                        }}
                    />
                </>
            )}
        </div>
    )
}
