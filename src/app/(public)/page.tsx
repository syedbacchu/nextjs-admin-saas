import { Metadata } from "next"
import { constructMetadata } from "@/lib/seo"
import HomeMatchList from "@/components/match/HomeMatchList"
import {getMatchPublicListAction} from "@/services/match/match.actions";

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: `Home`,
        description: `Keep track of your games with ease, anytime, anywhere.`,
        image: "/og/default.png",
    })
}

export default async function Page() {
    // Fetch data: Page 1, empty search
    const response = await getMatchPublicListAction(1, '','','','')

    // Safely extract the array, defaulting to empty if null
    const matches = response?.data?.data || []

    return (
        <section className="w-full bg-gray-50 min-h-screen">
            <HomeMatchList matches={matches} />
        </section>
    )
}