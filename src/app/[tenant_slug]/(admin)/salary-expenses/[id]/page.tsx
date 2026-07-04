import Link from 'next/link'
import { getSalaryExpenseAction } from '@/features/salary-expenses'

interface SalaryExpenseDetailsPageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

function formatDate(value?: string | null): string {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
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

export default async function SalaryExpenseDetailsPage({ params }: SalaryExpenseDetailsPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const expenseId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !expenseId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid monthly salary route.
            </div>
        )
    }

    const res = await getSalaryExpenseAction(tenantSlug, expenseId)

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load monthly salary</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const expense = res.data

    return (
        <div className="mx-auto space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{expense.paid_to_user?.name || 'Monthly Salary'}</h1>
                        <p className="mt-1 text-sm text-slate-600">{expense.category}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/${tenantSlug}/salary-expenses`}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            Back
                        </Link>
                        <Link
                            href={`/${tenantSlug}/salary-expenses/${expense.id}/edit`}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Edit Monthly Salary
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Monthly Salary Info</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Date:</span> <span className="text-slate-600">{formatDate(expense.date)}</span></p>
                        <p><span className="font-medium text-slate-700">Paid To:</span> <span className="text-slate-600">{expense.paid_to_user?.name || (expense.paid_to_user_id ? `#${expense.paid_to_user_id}` : 'N/A')}</span></p>
                        <p><span className="font-medium text-slate-700">Category:</span> <span className="text-slate-600">{expense.category}</span></p>
                        <p><span className="font-medium text-slate-700">Office:</span> <span className="text-slate-600">{expense.office?.branch_name || (expense.office_id ? `#${expense.office_id}` : 'N/A')}</span></p>
                        <p><span className="font-medium text-slate-700">Amount:</span> <span className="text-slate-600">{formatAmount(expense.amount)}</span></p>
                        <p><span className="font-medium text-slate-700">Remarks:</span> <span className="text-slate-600">{expense.remarks || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Status:</span> <span className="text-slate-600">{expense.status === 1 ? 'Active' : 'Inactive'}</span></p>
                        <p>
                            <span className="font-medium text-slate-700">Attachment:</span>{' '}
                            {expense.attachment ? (
                                <a href={expense.attachment} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800">
                                    View Attachment
                                </a>
                            ) : (
                                <span className="text-slate-600">N/A</span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Meta</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Created At:</span> <span className="text-slate-600">{formatDate(expense.created_at)}</span></p>
                        <p><span className="font-medium text-slate-700">Updated At:</span> <span className="text-slate-600">{formatDate(expense.updated_at)}</span></p>
                    </div>
                </div>
            </section>
        </div>
    )
}
