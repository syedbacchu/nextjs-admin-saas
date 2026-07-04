import Link from 'next/link'
import { ArrowLeft, Calendar, FileText, Hash, User } from 'lucide-react'
import { getAttendanceAction } from '@/features/attendances'

interface AttendanceDetailsPageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

export default async function AttendanceDetailsPage({ params }: AttendanceDetailsPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const attendanceId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !attendanceId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid route.
            </div>
        )
    }

    const res = await getAttendanceAction(tenantSlug, attendanceId)

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load attendance record</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
                <Link
                    href={`/${tenantSlug}/attendances`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Attendances
                </Link>
            </div>
        )
    }

    const attendance = res.data

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href={`/${tenantSlug}/attendances`}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Attendance Details</h1>
                        <p className="text-sm text-slate-500">
                            Record ID: {attendance.id}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/${tenantSlug}/attendances/${attendanceId}/edit`}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        Edit Attendance
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
                            <dd className="col-span-2 font-medium text-slate-900">{attendance.date?.split('T')[0] || 'N/A'}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <dt className="text-slate-500">Month</dt>
                            <dd className="col-span-2 font-medium text-slate-900">{attendance.month || 'N/A'}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <dt className="text-slate-500">Working Day(s)</dt>
                            <dd className="col-span-2 font-medium text-slate-900">{attendance.working_day || 'N/A'}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <dt className="text-slate-500">Status</dt>
                            <dd className="col-span-2">
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                    attendance.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                    {attendance.status === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                        <User className="h-5 w-5 text-slate-500" /> Employee Information
                    </h2>
                    {attendance.employee ? (
                        <dl className="space-y-4 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="text-slate-500">Name</dt>
                                <dd className="col-span-2 font-medium text-slate-900">{attendance.employee.name}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="text-slate-500">Designation</dt>
                                <dd className="col-span-2 font-medium text-slate-900">{attendance.employee.employee_type == 'helper' ? "Helper" : attendance.employee.employee_type == 'supervisor' ? "Supervisor" : attendance.employee.designation || 'N/A'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="text-slate-500">Mobile</dt>
                                <dd className="col-span-2 font-medium text-slate-900">{attendance.employee.mobile}</dd>
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
