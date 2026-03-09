import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PublicLayout({ children,}: { children: React.ReactNode })
{
    return (
        <>
            <Header />
            <main className="min-h-screen container mx-auto px-4 py-6 ">{children}</main>
            <Footer />
        </>
    )
}
