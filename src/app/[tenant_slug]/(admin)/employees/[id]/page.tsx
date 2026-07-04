import Link from 'next/link'
import { getEmployeeAction } from '@/features/employees'

interface EmployeeDetailsPageProps {
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

export default async function EmployeeDetailsPage({ params }: EmployeeDetailsPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const employeeId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !employeeId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid employee route.
            </div>
        )
    }

    const res = await getEmployeeAction(tenantSlug, employeeId)

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load employee</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const employee = res.data

    return (
        <div className="mx-auto space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        {employee.image && (
                            <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={employee.image} alt={employee.name} className="h-full w-full object-cover" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{employee.name}</h1>
                            <p className="mt-1 text-sm text-slate-600">{employee.mobile}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/${tenantSlug}/employees`}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            Back
                        </Link>
                        <Link
                            href={`/${tenantSlug}/employees/${employee.id}/edit`}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Edit Employee
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Employee Info</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Email:</span> <span className="text-slate-600">{employee.email || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Gender:</span> <span className="text-slate-600">{employee.gender || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Blood Group:</span> <span className="text-slate-600">{employee.blood_group || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Birth Date:</span> <span className="text-slate-600">{formatDate(employee.birth_date)}</span></p>
                        <p><span className="font-medium text-slate-700">Join Date:</span> <span className="text-slate-600">{formatDate(employee.join_date)}</span></p>
                        <p><span className="font-medium text-slate-700">NID:</span> <span className="text-slate-600">{employee.nid || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Designation:</span> <span className="text-slate-600">{employee.designation || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Address:</span> <span className="text-slate-600">{employee.address || 'N/A'}</span></p>
                        <p><span className="font-medium text-slate-700">Basic Salary:</span> <span className="text-slate-600">{formatAmount(employee.basic_salary)}</span></p>
                        <p><span className="font-medium text-slate-700">House Rent:</span> <span className="text-slate-600">{formatAmount(employee.house_rent)}</span></p>
                        <p><span className="font-medium text-slate-700">Medical:</span> <span className="text-slate-600">{formatAmount(employee.medical)}</span></p>
                        <p><span className="font-medium text-slate-700">Allowance:</span> <span className="text-slate-600">{formatAmount(employee.allowance)}</span></p>
                        <p><span className="font-medium text-slate-700">Extra Allowance:</span> <span className="text-slate-600">{formatAmount(employee.extra_allowance)}</span></p>
                        <p><span className="font-medium text-slate-700">Conveyance:</span> <span className="text-slate-600">{formatAmount(employee.conveyance)}</span></p>
                        <p><span className="font-medium text-slate-700">Gross Salary:</span> <span className="font-semibold text-slate-900">{formatAmount(employee.gross_salary)}</span></p>
                        <p><span className="font-medium text-slate-700">Status:</span> <span className="text-slate-600">{employee.status === 1 ? 'Active' : 'Inactive'}</span></p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Meta</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p><span className="font-medium text-slate-700">Created At:</span> <span className="text-slate-600">{formatDate(employee.created_at)}</span></p>
                        <p><span className="font-medium text-slate-700">Updated At:</span> <span className="text-slate-600">{formatDate(employee.updated_at)}</span></p>
                    </div>
                </div>
            </section>
        </div>
    )
}
