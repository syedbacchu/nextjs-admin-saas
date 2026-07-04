import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import AdvanceSalariesContent from './AdvanceSalariesContent'

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'Advance Salaries',
        description: 'Manage salary advance payments, track employee advances, and monitor advance repayments.',
        noIndex: true,
    })
}

export default function AdvanceSalariesPage() {
    return <AdvanceSalariesContent />
}