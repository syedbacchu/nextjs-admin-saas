import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import SalaryExpensesContent from './SalaryExpensesContent'

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'Monthly Salary',
        description: 'Manage monthly salary payments, track payroll expenses, and monitor employee compensation.',
        noIndex: true,
    })
}

export default function SalaryExpensesPage() {
    return <SalaryExpensesContent />
}