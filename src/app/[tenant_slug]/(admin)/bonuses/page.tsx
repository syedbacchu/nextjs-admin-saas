import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import BonusesContent from './BonusesContent'

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'Bonuses',
        description: 'Manage employee bonuses, track incentive payments, and monitor bonus distributions.',
        noIndex: true,
    })
}

export default function BonusesPage() {
    return <BonusesContent />
}