import {TournamentService} from "@/services/tournament/tournament.service";
import {Tournament} from "@/services/tournament/tournament.types";
import Image from "next/image";
import RegisteredUser from "@/components/tournament/RegisteredUser";

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
            <div className="relative bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-9xl">🏏</div>
                    <div className="absolute bottom-10 right-10 text-9xl">🏆</div>
                </div>

                <div className="relative max-w-6xl mx-auto px-2 py-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Tournament Images */}
                        {(tournament.thumbnail) && (
                            <div className="flex-shrink-0">
                                <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden shadow-2xl ">
                                    <Image
                                        src={tournament.thumbnail}
                                        alt={tournament.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Tournament Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-3">
                                Cricket Tournament
                            </div>
                            <h1 className="text-xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                                {tournament.title}
                            </h1>
                            {tournament.tagline && (
                                <p className="text-base md:text-lg text-blue-100 mb-4">{tournament.tagline}</p>
                            )}
                            {tournament.venue_details && (
                                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-100">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{tournament.venue_details}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className=" mx-auto px-4 py-8 -mt-6 relative z-10">
                <RegisteredUser tournamentId={tournament.id}/>
            </div>
        </div>
    );
}