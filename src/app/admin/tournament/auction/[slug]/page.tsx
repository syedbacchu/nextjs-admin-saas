import {TournamentService} from "@/services/tournament/tournament.service";
import {Tournament} from "@/services/tournament/tournament.types";
import TournamentHeaderSection from "@/components/tournament/TournamentHeaderSection";
import {AuctionService} from "@/services/auction/auction.service";
import AuctionCreateForm from "@/components/auction/AuctionCreateForm";
import {createTournamentAction} from "@/services/tournament/tournament.actions";
import CreateAuction from "@/components/auction/AuctionCreate";
import AssignPlayerToAuction from "@/components/auction/AssignPlayerToAuction";
import AssignPlayerToTeam from "@/components/auction/AssignPlayerToTeam";
import TournamentTeamPlayerList from "@/components/tournament/TournamentTeamPlayerList";

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
    const auction = await AuctionService.list(Number(tournament.id))


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            {/* Hero Section with Tournament Header */}
            <TournamentHeaderSection tournament={tournament}/>
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12 -mt-8 relative z-10">
                <div className="grid md:grid-cols-1 gap-6 mb-8">
                    {
                        auction.success == false ? (
                            <CreateAuction tournamentId={tournament.id} />
                        ) : (
                            <>
                                <AssignPlayerToAuction tournamentId={tournament.id} />
                                <AssignPlayerToTeam tournamentId={tournament.id} auctionId={auction.id} />
                                <TournamentTeamPlayerList tournamentId={tournament.id} />
                            </>

                        )
                    }
                </div>
            </div>
        </div>
    );
}