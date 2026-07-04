import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import EmployeesContent from './EmployeesContent'

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'Employees',
        description: 'Manage your transport business employees, track their roles, and monitor employee performance.',
        noIndex: true,
    })
}

export default function EmployeesPage() {
    return <EmployeesContent />
}