import Link from 'next/link'
import { ArrowLeft, Banknote, FileText, User } from 'lucide-react'
import { getAdvanceSalaryAction } from '@/features/advance-salaries'

interface AdvanceSalaryDetailsPageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

function formatAmount(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined' || value === '') return 'N/A'
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export default async function AdvanceSalaryDetailsPage({ params }: AdvanceSalaryDetailsPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const advanceSalaryId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !advanceSalaryId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid route.
            </div>
        )
    }

    const res = await getAdvanceSalaryAction(tenantSlug, advanceSalaryId)

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load advance salary record</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
                <Link
                    href={`/${tenantSlug}/advance-salaries`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Advance Salaries
                </Link>
            </div>
        )
    }

    const item = res.data

    const s = String(item.status).toLowerCase()
    let badgeClass = 'bg-slate-100 text-slate-700'
    let badgeText = item.status

    if (s === 'paid') {
        badgeClass = 'bg-amber-100 text-amber-800'
        badgeText = 'Paid'
    
    } else if (s === 'due') {
        badgeClass = 'bg-rose-100 text-rose-700'
        badgeText = 'Due'
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href={`/${tenantSlug}/advance-salaries`}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Advance Salary Details</h1>
                        <p className="text-sm text-slate-500">
                            Record ID: {item.id}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/${tenantSlug}/advance-salaries/${advanceSalaryId}/edit`}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        Edit Advance Salary
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                        <FileText className="h-5 w-5 text-slate-500" /> Record Information
                    </h2>
                    <dl className="space-y-4 text-sm">
                        <div className="grid grid-cols-3 gap-2">
                            <dt className="text-slate-500">Date</dt>
                            <dd className="col-span-2 font-medium text-slate-900">{item.date?.split('T')[0] || 'N/A'}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <dt className="text-slate-500">Salary Month</dt>
                            <dd className="col-span-2 font-medium text-slate-900">{item.salary_month || 'N/A'}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <dt className="text-slate-500">Advance Amount</dt>
                            <dd className="col-span-2 font-medium text-slate-900 flex items-center gap-1">
                                <Banknote className="h-4 w-4 text-emerald-600" />
                                {formatAmount(item.advance_amount)}
                            </dd>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                            <dt className="text-slate-500">Status</dt>
                            <dd className="col-span-2">
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
                                    {badgeText}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                        <User className="h-5 w-5 text-slate-500" /> Employee Information
                    </h2>
                    {item.employee ? (
                        <dl className="space-y-4 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="text-slate-500">Name</dt>
                                <dd className="col-span-2 font-medium text-slate-900">{item.employee.name}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="text-slate-500">Designation</dt>
                                <dd className="col-span-2 font-medium text-slate-900">{item.employee.employee_type == 'helper' ? "Helper" : item.employee.employee_type == 'supervisor' ? "Supervisor" : item.employee.designation || 'N/A'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="text-slate-500">Mobile</dt>
                                <dd className="col-span-2 font-medium text-slate-900">{item.employee.mobile}</dd>
                            </div>
                        </dl>
                    ) : (
                        <div className="py-4 text-sm text-slate-500">Employee data not available.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
