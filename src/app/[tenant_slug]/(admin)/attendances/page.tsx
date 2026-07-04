import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import AttendancesContent from './AttendancesContent'

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'Attendances',
        description: 'Manage employee attendance records, track work days, and monitor staff attendance patterns.',
        noIndex: true,
    })
}

export default function AttendancesPage() {
    return <AttendancesContent />
}