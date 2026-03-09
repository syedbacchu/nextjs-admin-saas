import {TournamentService} from "@/services/tournament/tournament.service";
import TournamentForm from "@/components/tournament/TournamentForm";
import {TournamentFormData} from '@/services/tournament/tournament.types';
import {ApiResponse} from "@/types/api";
import {safeParse} from "@/lib/utils/safeParse";
import {updateTournamentAction} from "@/services/tournament/tournament.actions";

export default async function EditTournamentPage({ params }: { params: { slug: string } }) {

    const { slug } = params
    const res = await TournamentService.show(String(slug))

    if (!res.success) {
        return <div>Error loading tournament</div>
    }
    const rawData = res.data as any
    const cleanData: Partial<TournamentFormData> & { id: number } = {
        id: rawData.id, // Keep ID for the update logic
        title: rawData.title,
        district: rawData.district,
        player_select_type: rawData.player_select_type,
        is_required_reg: rawData.is_required_reg,
        is_required_dob: rawData.is_required_dob,
        is_required_password: rawData.is_required_password,
        contact_number: rawData.contact_number,
        host: rawData.host,
        thumbnail: rawData.thumbnail,
        cover_image: rawData.cover_image,
        is_required_team_reg: rawData.is_required_team_reg,
        reg_fees: rawData.reg_fees,
        team_reg_fees: rawData.team_reg_fees,
        is_reg_close: rawData.is_reg_close,
        payment_instruction: rawData.payment_instruction,
        helpline_instructions: rawData.helpline_instructions,
        password_instructions: rawData.password_instructions,
        other_contact_number: rawData.other_contact_number,
        team_reg_last_date: rawData.team_reg_last_date,
        player_reg_last_date: rawData.player_reg_last_date ?? rawData.registration_last_date,
        start_date: rawData.start_date,
        end_date: rawData.end_date,
        rule_list: safeParse(rawData.rule_list),
        prize_list: safeParse(rawData.prize_list),
        payment_list: safeParse(rawData.payment_list),
        collaborators: (rawData.collaborators),
    }

    async function handleUpdate(formData: FormData): Promise<ApiResponse<any>> {
        'use server'
        return await updateTournamentAction(formData)
    }

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-6">Edit Tournament: {cleanData.title}</h1>
            <TournamentForm
                initialData={cleanData}
                onSubmit={handleUpdate}
                submitLabel="Update"
            />
        </div>
    )
}
