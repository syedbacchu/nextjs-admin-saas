import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import CustomersContent from './CustomersContent'

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'Customers',
        description: 'Manage your transport business customers, track their details, and monitor customer relationships.',
        noIndex: true,
    })
}

export default function CustomersPage() {
    return <CustomersContent />
}