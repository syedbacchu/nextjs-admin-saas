import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import OfficesContent from './OfficesContent'

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'Offices',
        description: 'Manage your transport business offices, locations, and branch operations.',
        noIndex: true,
    })
}

export default function OfficesPage() {
    return <OfficesContent />
}