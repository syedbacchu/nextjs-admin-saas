'use client'

import TournamentForm from '@/components/tournament/TournamentForm'
import { useRouter } from 'next/navigation'
import { createTournamentAction } from '@/services/tournament/tournament.actions'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Trophy } from 'lucide-react'

export default function CreateTournament() {
    const router = useRouter()

    const handleCreate = async (formData: FormData) => {
        const res = await createTournamentAction(formData)
        if (res.success) {
            router.push('/admin/tournament')
        }
        return res
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative px-6 py-7 sm:px-8 sm:py-8">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-500/5 to-emerald-500/10" />

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-3">
                            <Link
                                href="/admin/tournament"
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
                            >
                                <ArrowLeft size={16} />
                                Back to tournaments
                            </Link>

                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                                <Sparkles size={14} />
                                Tournament Management
                            </span>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Create Tournament</h1>
                                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                                    Set up a new tournament with registration settings, contact details, and organizer info.
                                </p>
                            </div>
                        </div>

                        <div className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-white/70 text-blue-700 shadow-sm ring-1 ring-blue-200 sm:flex">
                            <Trophy size={30} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 border-b border-slate-200 pb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Tournament Setup</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Fill in the basic details below. You can update advanced options later from the edit page.
                    </p>
                </div>

                <TournamentForm onSubmit={handleCreate} submitLabel="Create" />
            </section>
        </div>
    )
}
