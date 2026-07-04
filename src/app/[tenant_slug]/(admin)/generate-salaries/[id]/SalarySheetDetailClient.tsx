'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Eye, Wallet, FileText, History, CreditCard, Calendar, Search, Filter, Download, Printer, FileSpreadsheet } from 'lucide-react'
import {GeneratedSalary} from "@/features/salary-expenses/salary-payment.types";
import PayableAmountModal from "@/features/salary-expenses/components/PayableAmountModal";
import PaymentHistoryModal from "@/features/salary-expenses/components/PaymentHistoryModal";
import {
    exportSalarySheetPdfAction,
    exportSalarySheetExcelAction
} from "@/features/salary-expenses/actions/salary-payment.actions";


interface SalarySheetDetailClientProps {
    tenantSlug: string
    data: GeneratedSalary
}

const PAYMENT_STATUS_OPTIONS = [
    { label: 'All Status', value: 'all' },
    { label: 'Paid', value: 'paid' },
    { label: 'Partial', value: 'partial' },
    { label: 'Unpaid', value: 'unpaid' },
]

const DUE_STATUS_OPTIONS = [
    { label: 'All Employees', value: 'all' },
    { label: 'With Due Amount', value: 'has_due' },
    { label: 'Without Due', value: 'no_due' },
]

export default function SalarySheetDetailClient({ tenantSlug, data }: SalarySheetDetailClientProps) {
    const router = useRouter()
    const [payableModalOpen, setPayableModalOpen] = useState(false)
    const [historyModalOpen, setHistoryModalOpen] = useState(false)
    const [selectedSalarySheetId, setSelectedSalarySheetId] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')
    const [dueStatusFilter, setDueStatusFilter] = useState('all')

    // Filter salary sheets based on search query and dropdown filters
    const filteredSalarySheets = data.salary_sheet?.filter(sheet => {
        // Text search filter
        let matchesSearch = true
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            const employeeName = sheet.employee?.name?.toLowerCase() || ''
            const designation = sheet.employee?.designation?.toLowerCase() || ''
            const employeeId = String(sheet.employee_id)

            matchesSearch = employeeName.includes(query) ||
                          designation.includes(query) ||
                          employeeId.includes(query)
        }

        // Payment status filter
        let matchesPaymentStatus = true
        if (paymentStatusFilter !== 'all') {
            matchesPaymentStatus = sheet.payment_status === paymentStatusFilter
        }

        // Due status filter
        let matchesDueStatus = true
        if (dueStatusFilter === 'has_due') {
            matchesDueStatus = Number(sheet.due_amount) > 0
        } else if (dueStatusFilter === 'no_due') {
            matchesDueStatus = Number(sheet.due_amount) <= 0
        }

        return matchesSearch && matchesPaymentStatus && matchesDueStatus
    }) || []

    const hasResults = filteredSalarySheets.length > 0

    const handleViewPayable = (salarySheetId: number) => {
        setSelectedSalarySheetId(salarySheetId)
        setPayableModalOpen(true)
    }

    const handleViewHistory = (salarySheetId: number) => {
        setSelectedSalarySheetId(salarySheetId)
        setHistoryModalOpen(true)
    }

    const handleExportPdf = async () => {
        const toastId = toast.loading('Generating PDF...')
        try {
            const result = await exportSalarySheetPdfAction(tenantSlug, data.id)

            if (result.success && result.fileData && result.filename) {
                const a = document.createElement('a')
                a.href = result.fileData
                a.download = result.filename
                a.style.display = 'none'
                document.body.appendChild(a)
                a.click()

                setTimeout(() => {
                    document.body.removeChild(a)
                }, 1000)

                toast.dismiss(toastId)
                toast.success('PDF downloaded successfully')
            } else {
                toast.dismiss(toastId)
                toast.error(result.message || 'Failed to export PDF')
            }
        } catch (error) {
            console.error('Error downloading PDF:', error)
            toast.dismiss(toastId)
            toast.error('Failed to download PDF. Please try again.')
        }
    }

    const handleExportExcel = async () => {
        const toastId = toast.loading('Generating Excel...')
        try {
            const result = await exportSalarySheetExcelAction(tenantSlug, data.id)

            if (result.success && result.fileData && result.filename) {
                const a = document.createElement('a')
                a.href = result.fileData
                a.download = result.filename
                a.style.display = 'none'
                document.body.appendChild(a)
                a.click()

                setTimeout(() => {
                    document.body.removeChild(a)
                }, 1000)

                toast.dismiss(toastId)
                toast.success('Excel downloaded successfully')
            } else {
                toast.dismiss(toastId)
                toast.error(result.message || 'Failed to export Excel')
            }
        } catch (error) {
            console.error('Error downloading Excel:', error)
            toast.dismiss(toastId)
            toast.error('Failed to download Excel. Please try again.')
        }
    }

    const handlePrint = async () => {
        const toastId = toast.loading('Preparing for print...')
        try {
            const result = await exportSalarySheetPdfAction(tenantSlug, data.id)

            if (result.success && result.fileData) {
                // Open PDF in new window for printing
                const newWindow = window.open('', '_blank')
                if (newWindow) {
                    newWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Salary Sheet - ${data.month}</title>
                            <style>
                                body { margin: 0; }
                                iframe { border: none; width: 100%; height: 100vh; }
                            </style>
                        </head>
                        <body>
                            <iframe src="${result.fileData}" onload="window.print();"></iframe>
                        </body>
                        </html>
                    `)
                    newWindow.document.close()

                    toast.dismiss(toastId)
                    toast.success('Ready to print')
                } else {
                    toast.dismiss(toastId)
                    toast.error('Could not open print window')
                }
            } else {
                toast.dismiss(toastId)
                toast.error(result.message || 'Failed to prepare print')
            }
        } catch (error) {
            console.error('Error preparing print:', error)
            toast.dismiss(toastId)
            toast.error('Failed to prepare print')
        }
    }

    const handleProcessPayment = (salarySheetId: number) => {
        // Navigate to the payment page with generated_salary_id and salary_sheet_id as query param
        router.push(`/${tenantSlug}/generate-salaries/${data.id}/pay?sheet_id=${salarySheetId}`)
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
                        onClick={() => router.push(`/${tenantSlug}/generate-salaries`)}
                        className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-100"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Salary Sheet Details</h1>
                        <p className="text-sm text-slate-600">
                            <Calendar className="inline h-3 w-3" /> {data.month}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleExportPdf}
                        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Download PDF"
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">PDF</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Download Excel"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        <span className="hidden sm:inline">Excel</span>
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Print"
                    >
                        <Printer className="h-4 w-4" />
                        <span className="hidden sm:inline">Print</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                        <FileText className="h-4 w-4" />
                        <p className="text-xs">Total Employees</p>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        {data.summary?.total_employee || data.salary_sheet?.length || 0}
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Wallet className="h-4 w-4" />
                        <p className="text-xs">Total Earnings</p>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-green-600">
                        BDT {' '}
                        {(data.summary?.grand_total_earnings || 0).toFixed(2)}
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                        <CreditCard className="h-4 w-4" />
                        <p className="text-xs">Total Deductions</p>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-red-600">
                        BDT {' '}
                        {(data.summary?.grand_total_deduction || 0).toFixed(2)}
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Wallet className="h-4 w-4" />
                        <p className="text-xs">Net Payable</p>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        BDT {' '}
                        {(data.summary?.grand_total_net_payable || 0).toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Employee Salary Details</h2>
                            <div className="flex items-center gap-3">
                                {/* Payment Status Filter */}


                                {/* Search Input */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search employees..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(searchQuery || paymentStatusFilter !== 'all' || dueStatusFilter !== 'all') && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span>Active filters:</span>
                                {searchQuery && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                        Search: "{searchQuery}"
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="hover:text-blue-900"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {paymentStatusFilter !== 'all' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                        Status: {PAYMENT_STATUS_OPTIONS.find(o => o.value === paymentStatusFilter)?.label}
                                        <button
                                            onClick={() => setPaymentStatusFilter('all')}
                                            className="hover:text-green-900"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {dueStatusFilter !== 'all' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                        {DUE_STATUS_OPTIONS.find(o => o.value === dueStatusFilter)?.label}
                                        <button
                                            onClick={() => setDueStatusFilter('all')}
                                            className="hover:text-orange-900"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                <span className="text-slate-600">
                                    → {filteredSalarySheets.length} result{filteredSalarySheets.length !== 1 ? 's' : ''}
                                </span>
                                <button
                                    onClick={() => {
                                        setSearchQuery('')
                                        setPaymentStatusFilter('all')
                                        setDueStatusFilter('all')
                                    }}
                                    className="text-red-600 hover:text-red-700 font-medium"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {data.salary_sheet && data.salary_sheet.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg">
                        <div className="min-w-[1200px]">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 md:px-6">Employee</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 md:px-6">Salary Breakdown</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 md:px-6">Gross Salary</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 md:px-6">Bonus</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 md:px-6">Total Earnings</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 md:px-6">
                                            Advance Deduction
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 md:px-6">
                                            Loan Deduction
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 md:px-6">Net Payable</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 md:px-6">Paid</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 md:px-6">Due</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 md:px-6">Status</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 md:px-6">Actions</th>
                                    </tr>
                                </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredSalarySheets.map((sheet) => (
                                    <tr key={sheet.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm md:px-6 md:py-4">
                                            <div>
                                                <p className="font-semibold text-slate-900 text-xs md:text-sm">
                                                    {sheet.employee?.name || 'Unknown'}
                                                </p>
                                                <p className="text-xs text-slate-600">{sheet.employee?.designation || '-'}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-slate-900 md:px-6 md:py-4">
                                            <p className="text-xs">Basic :  BDT {' '}
                                                {Number(sheet.basic_salary).toFixed(2)}</p>
                                            <p className="text-xs">
                                                House Rent : BDT {' '}
                                                {Number(sheet.house_rent).toFixed(2)}
                                            </p>
                                            <p className="text-xs">
                                                Medical : BDT {' '}
                                                {Number(sheet.medical).toFixed(2)}
                                            </p>
                                            <p className="text-xs">
                                                Conveyance : BDT {' '}
                                                {Number(sheet.conveyance).toFixed(2)}
                                            </p>
                                            <p className="text-xs">
                                                Allowance : BDT {' '}
                                                {Number(sheet.allowance).toFixed(2)}
                                            </p>
                                            <p className="text-xs">
                                                Extra Allowance : BDT {' '}
                                                {Number(sheet.extra_allowance).toFixed(2)}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-slate-900 md:px-6 md:py-4">
                                            BDT {' '}
                                            {Number(sheet.gross_salary).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-green-600 md:px-6 md:py-4">
                                            +BDT {' '}
                                            {Number(sheet.bonus).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right font-semibold text-slate-900 md:px-6 md:py-4">
                                            BDT {' '}
                                            {Number(sheet.total_earnings).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-red-600 md:px-6 md:py-4">
                                            -BDT {' '}
                                            {Number(sheet.advance_deduction).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-red-600 md:px-6 md:py-4">
                                            -BDT {' '}
                                            {Number(sheet.loan_deduction).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right font-bold text-slate-900 md:px-6 md:py-4">
                                            BDT {' '}
                                            {Number(sheet.net_payable).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-green-600 md:px-6 md:py-4">
                                            BDT {' '}
                                            {Number(sheet.paid_amount).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-red-600 md:px-6 md:py-4">
                                            BDT {' '}
                                            {Number(sheet.due_amount).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-center md:px-6 md:py-4">
                                            {getPaymentStatusBadge(sheet.payment_status)}
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewPayable(sheet.id)}
                                                    className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                                                    title="View Payable"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewHistory(sheet.id)}
                                                    className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                                                    title="Payment History"
                                                >
                                                    <History className="h-3 w-3" />
                                                </button>
                                                {sheet.due_amount > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleProcessPayment(sheet.id)}
                                                        className="rounded-lg bg-green-100 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
                                                        title="Process Payment"
                                                    >
                                                        <Wallet className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        {(searchQuery || paymentStatusFilter !== 'all' || dueStatusFilter !== 'all') ? (
                            <>
                                <Filter className="h-12 w-12 text-slate-300" />
                                <h3 className="mt-4 text-lg font-semibold text-slate-900">No employees found</h3>
                                <p className="mt-2 text-sm text-slate-600">No employees match the current filters</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('')
                                        setPaymentStatusFilter('all')
                                        setDueStatusFilter('all')
                                    }}
                                    className="mt-4 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Clear all filters
                                </button>
                            </>
                        ) : (
                            <>
                                <FileText className="h-12 w-12 text-slate-300" />
                                <h3 className="mt-4 text-lg font-semibold text-slate-900">No salary sheet data found</h3>
                                <p className="mt-2 text-sm text-slate-600">Generate salary sheet to view employee details</p>
                            </>
                        )}
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
