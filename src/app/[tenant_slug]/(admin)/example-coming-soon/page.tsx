import { ComingSoon } from '@/components/common'
import { Calendar, Settings, Users, FileText } from 'lucide-react'

interface ExampleComingSoonPageProps {
    params: Promise<{ tenant_slug: string }>
}

export default async function ExampleComingSoonPage({
    params,
}: ExampleComingSoonPageProps) {
    const { tenant_slug } = await params

    // Example 1: Basic usage (default)
    // return <ComingSoon />

    // Example 2: With custom title and description
    // return (
    //     <ComingSoon
    //         title="Custom Title"
    //         description="This is a custom description for your coming soon page."
    //     />
    // )

    // Example 3: With icon and estimated time
    return (
        <ComingSoon
            title="Reports & Analytics"
            description="Advanced reporting and analytics dashboard is under development. Get detailed insights into your transport business."
            icon={FileText}
            estimatedTime="Q2 2026"
            showContact={true}
            contactEmail="support@banglamotor.com"
        />
    )

    // Example 4: For different features
    // return (
    //     <ComingSoon
    //         title="Employee Management"
    //         description="Complete HR solution for managing your workforce efficiently."
    //         icon={Users}
    //         estimatedTime="Coming in next update"
    //     />
    // )
}
