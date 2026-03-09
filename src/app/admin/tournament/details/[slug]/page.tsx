import {TournamentService} from "@/services/tournament/tournament.service";
import {Tournament} from "@/services/tournament/tournament.types";
import Link from "next/link";
import PlayerListRegCard from "@/components/tournament/PlayerListRegCard";
import TeamListRegCard from "@/components/tournament/TeamListRegCard";
import TournamentHeaderSection from "@/components/tournament/TournamentHeaderSection";
import AuctionAdminCard from "@/components/auction/AuctionAdminCard";
import UnSoldPublicCard from "@/components/auction/UnSoldPublicCard";

export default async function page({ params }: { params: { slug: string } }) {

    const { slug } = params
    const res = await TournamentService.show(String(slug))

    if (!res.success) {
        return <div>Error loading tournament</div>
    }
    const rawData = res.data as any

    if (!res.success || !res.data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏏</div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Tournament Not Found</h1>
                    <p className="text-slate-600">The tournament you are looking for does not exist or is inactive.</p>
                </div>
            </div>
        );
    }


    const tournament = res.data as unknown as Tournament;
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            {/* Hero Section with Tournament Header */}
            <TournamentHeaderSection tournament={tournament}/>
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12 -mt-8 relative z-10">

                {/* Registration Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">

                    <Link href={`/admin/tournament/players/${tournament.slug}`}>
                        <PlayerListRegCard/>
                    </Link>

                    <Link href={`/admin/tournament/teams/${tournament.slug}`}>
                        <TeamListRegCard/>
                    </Link>
                    <Link href={`/admin/tournament/auction/${tournament.slug}`}>
                        <AuctionAdminCard/>
                    </Link>

                    <Link href={`/admin/tournament/unsold/${tournament.slug}`}>
                        <UnSoldPublicCard/>
                    </Link>
                </div>

            </div>
        </div>
    );
}