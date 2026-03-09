import { Metadata } from "next"
import { constructMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: `Home`,
        description: `Keep track of your games with ease, anytime, anywhere.`,
        image: "/og/default.png",
    })
}

export default async function Page() {
    // Fetch data: Page 1, empty search

    // Safely extract the array, defaulting to empty if null

    return (
        <section className="w-full bg-gray-50 min-h-screen">
            <h2>Public landing page</h2>
        </section>
    )
}