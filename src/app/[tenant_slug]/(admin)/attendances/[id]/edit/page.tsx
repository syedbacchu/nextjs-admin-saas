import { getAttendanceAction } from '@/features/attendances'
import { getAllEmployeesAction } from '@/features/employees'
import AttendanceForm from "@/features/attendances/components/AttendanceForm";

interface EditAttendancePageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

export default async function EditAttendancePage({ params }: EditAttendancePageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const attendanceId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !attendanceId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid attendance route.
            </div>
        )
    }

    const [res, employeesRes] = await Promise.all([
        getAttendanceAction(tenantSlug, attendanceId),
        getAllEmployeesAction(tenantSlug),
    ])

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load attendance</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const employees = (employeesRes.success && Array.isArray(employeesRes.data)) ? employeesRes.data : []

    return (
        <AttendanceForm
            tenantSlug={tenantSlug}
            employees={employees}
            attendanceId={attendanceId}
            initialData={res.data}
            submitLabel="Update Attendance"
        />
    )
}
