import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import LoansContent from './LoansContent'

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'Loans',
        description: 'Manage employee loans, track loan repayments, and monitor loan balances and interest.',
        noIndex: true,
    })
}

export default function LoansPage() {
    return <LoansContent />
}