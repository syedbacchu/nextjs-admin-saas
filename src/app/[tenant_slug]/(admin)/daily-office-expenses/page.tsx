import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import DailyOfficeExpensesContent from './DailyOfficeExpensesContent'

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'Daily Office Expenses',
        description: 'Manage daily office expenses for your transport business, track administrative costs, and monitor office spending.',
        noIndex: true,
    })
}

export default function DailyOfficeExpensesPage() {
    return <DailyOfficeExpensesContent />
}