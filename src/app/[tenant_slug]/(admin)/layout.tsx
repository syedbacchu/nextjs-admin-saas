import AdminHeader from "@/components/layout/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 md:flex">
            <AdminHeader />
            <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
    )
}
