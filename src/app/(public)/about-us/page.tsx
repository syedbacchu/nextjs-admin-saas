import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import { getRequestDictionary } from '@/i18n/server'
import AboutPage from "@/features/about/components/AboutPage";

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'About Us - Trusted Business Solutions for Modern Growth',
        description: 'Demo Company is a leading provider of innovative business solutions designed to help individuals and organizations achieve sustainable growth. We specialize in delivering high-quality services with a strong focus on reliability, customer satisfaction, and long-term value.',
        image: "/og/default.png",
    })
}

export default async function page() {
    const dictionary = await getRequestDictionary()

    return (
        <AboutPage />
    )
}
