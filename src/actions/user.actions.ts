'use server'

import { TournamentService } from '@/services/tournament/tournament.service'
import { revalidatePath } from 'next/cache'
import {ApiResponse} from "@/types/api";

export async function createTournamentAction(formData: FormData) {
    const res = await TournamentService.create(formData)
    if (res.success) {
        revalidatePath('/admin/tournament')
    }
    return res
}

export async function getTournamentsAction(page: number, search: string) {
    return await TournamentService.list(page, search)
}

export async function updateTournamentAction(formData: FormData) {
    const res: ApiResponse = await TournamentService.update(formData)
    if (res.success) {
        revalidatePath('/admin/tournament')
    }
    return res
}

export async function deleteTournamentAction(id: number) {
    const res = await TournamentService.delete(id)
    if (res.success) {
        revalidatePath('/admin/tournament')
    }
    return res
}

export async function toggleTournamentStatusAction(id: number | string, status: string) {
    const res = await TournamentService.toggleStatus(id, status);
    if (res.success) {
        revalidatePath('/admin/tournament');
    }
    return res;
}