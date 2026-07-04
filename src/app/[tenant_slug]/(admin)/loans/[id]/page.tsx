import { notFound } from 'next/navigation'
import { getLoanAction } from '@/features/loans'

interface LoanDetailPageProps {
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
    return value.split('T')[0]
}

function formatAmount(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined' || value === '') return 'N/A'
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default async function LoanDetailPage({ params }: LoanDetailPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const id = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !id) return notFound()

    const res = await getLoanAction(tenantSlug, id)
    if (!res.success || !res.data) return notFound()
    const loan = res.data

    const rows = [
        { label: 'Loan Date', value: formatDate(loan.loan_date) },
        { label: 'Employee', value: loan.employee?.name || 'N/A' },
        { label: 'Loan Amount', value: formatAmount(loan.loan_amount) },
        { label: 'Monthly Deduction', value: formatAmount(loan.monthly_deduction) },
        { label: 'After Adjustment Amount', value: formatAmount(loan.after_adjustment_amount) },
        { label: 'Status', value: loan.status },
    ]

    return (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Loan Details</h2>

            <dl className="grid gap-4 md:grid-cols-2">
                {rows.map(({ label, value }) => (
                    <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">{value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}
