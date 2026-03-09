import {ApiResponse} from "@/types/api";
import {PlayerService} from "@/services/player/player.service";
import {PlayerProfileFormData} from "@/services/player/player.types";
import {updatePlayerAction} from "@/services/player/player.actions";
import PlayerUpdateForm from "@/components/player/PlayerUpdateForm";
import Image from "next/image";
import {formatEnumLabel} from "@/lib/utils/helpers";

export default async function EditProfilePage() {

    const res = await PlayerService.profile()

    if (!res.success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Profile</h2>
                    <p className="text-slate-600">Unable to load your profile data. Please try again.</p>
                </div>
            </div>
        )
    }

    const rawData = res.data as any
    const cleanData: Partial<PlayerProfileFormData> & { id: number } = {
        id: rawData.id,
        name: rawData.name,
        district: rawData.district,
        phone: rawData.phone,
        jersey_number: rawData.jersey_number,
        jersey_size: rawData.jersey_size,
        address: rawData.address,
        date_of_birth: rawData.date_of_birth,
        cover_image: rawData.cover_image,
        playing_role: rawData.playing_role,
        batting_style: rawData.batting_style,
        bowling_style: rawData.bowling_style,
        batting_position: rawData.batting_position,
        bio: rawData.bio,
        image: rawData.image
    }

    async function handleUpdate(formData: FormData): Promise<ApiResponse<any>> {
        'use server'
        return await updatePlayerAction(formData)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-5 right-10 text-6xl">🏏</div>
                    <div className="absolute bottom-5 left-10 text-6xl">⚡</div>
                </div>

                <div className="relative max-w-6xl mx-auto px-2 py-4 md:py-12">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Player Image */}

                            <div className="flex-shrink-0">
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/30">
                                    <Image
                                        src={cleanData.image || '/images/player.png'}
                                        alt={cleanData.name || "Player"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>


                        {/* Player Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-2">
                                Edit Profile
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                                {cleanData.name}
                            </h1>
                            {cleanData.playing_role && (
                                <p className="text-lg text-blue-100 flex items-center justify-center md:justify-start gap-2">
                                    <span>🏏</span>
                                    <span>{formatEnumLabel(cleanData.playing_role)}</span>
                                    {cleanData.jersey_number && (
                                        <>
                                            <span className="mx-2">•</span>
                                            <span>Jersey #{cleanData.jersey_number}</span>
                                        </>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8 -mt-6 relative z-10">
                {/*{rawData?.dpl_reg && rawData?.dpl_reg?.tournament_id && (*/}
                {/*    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl shadow-2xl p-8 mb-8 border-2 border-green-200 relative overflow-hidden">*/}
                {/*        /!* Success Animation Background *!/*/}
                {/*        <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>*/}
                {/*        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>*/}

                {/*        <div className="relative">*/}
                {/*            /!* Success Header *!/*/}
                {/*            <div className="text-center mb-6">*/}
                {/*                <div className="inline-flex items-center justify-center w-10 md:w-20 h-10 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-xl mb-4 animate-bounce">*/}
                {/*                    <svg className="w-5 md:w-10 h-5 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                {/*                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />*/}
                {/*                    </svg>*/}
                {/*                </div>*/}
                {/*                <h3 className="text-xl md:text-3xl font-bold text-green-700 mb-2">*/}
                {/*                    Registration Successful! 🎉*/}
                {/*                </h3>*/}
                {/*                <p className="text-lg text-green-600 font-medium">*/}
                {/*                    DPL-2026 Session-4*/}
                {/*                </p>*/}
                {/*            </div>*/}

                {/*            /!* Registration Details Grid *!/*/}
                {/*            <div className="grid md:grid-cols-2 gap-4 mb-6">*/}
                {/*                /!* Payment Amount *!/*/}
                {/*                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow">*/}
                {/*                    <div className="flex items-center gap-3">*/}
                {/*                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">*/}
                {/*                            <span className="text-2xl">💰</span>*/}
                {/*                        </div>*/}
                {/*                        <div className="flex-1">*/}
                {/*                            <p className="text-sm text-slate-500 font-medium mb-1">Registration Fee</p>*/}
                {/*                            <p className="text-2xl font-bold text-slate-900">*/}
                {/*                                {rawData?.dpl_reg?.amount} {rawData?.dpl_reg?.currency}*/}
                {/*                            </p>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}

                {/*                /!* Payment Method *!/*/}
                {/*                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow">*/}
                {/*                    <div className="flex items-center gap-3">*/}
                {/*                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">*/}
                {/*                            <span className="text-2xl">💳</span>*/}
                {/*                        </div>*/}
                {/*                        <div className="flex-1">*/}
                {/*                            <p className="text-sm text-slate-500 font-medium mb-1">Payment Method</p>*/}
                {/*                            <p className="text-lg font-bold text-slate-900 capitalize">*/}
                {/*                                {rawData?.dpl_reg?.payment_method}*/}
                {/*                            </p>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}

                {/*                /!* Transaction ID *!/*/}
                {/*                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow">*/}
                {/*                    <div className="flex items-center gap-3">*/}
                {/*                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">*/}
                {/*                            <span className="text-2xl">🔖</span>*/}
                {/*                        </div>*/}
                {/*                        <div className="flex-1">*/}
                {/*                            <p className="text-sm text-slate-500 font-medium mb-1">Transaction ID</p>*/}
                {/*                            <p className="text-base font-bold text-slate-900 break-all">*/}
                {/*                                {rawData?.dpl_reg?.transaction_ref}*/}
                {/*                            </p>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}

                {/*                /!* Registration Status *!/*/}
                {/*                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow">*/}
                {/*                    <div className="flex items-center gap-3">*/}
                {/*                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">*/}
                {/*                            <span className="text-2xl">📋</span>*/}
                {/*                        </div>*/}
                {/*                        <div className="flex-1">*/}
                {/*                            <p className="text-sm text-slate-500 font-medium mb-1">Registration Status</p>*/}
                {/*                            <div className="flex items-center gap-2">*/}
                {/*                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${*/}
                {/*                    rawData?.dpl_reg?.registration_status == 1*/}
                {/*                        ? 'bg-green-100 text-green-700'*/}
                {/*                        : 'bg-yellow-100 text-yellow-700'*/}
                {/*                }`}>*/}
                {/*                    <span className={`w-2 h-2 rounded-full ${*/}
                {/*                        rawData?.dpl_reg?.registration_status == 1*/}
                {/*                            ? 'bg-green-500'*/}
                {/*                            : 'bg-yellow-500'*/}
                {/*                    }`}></span>*/}
                {/*                    {rawData?.dpl_reg?.registration_status == 1 ? 'Active' : 'Pending'}*/}
                {/*                </span>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}

                {/*            /!* Payment Status Banner *!/*/}
                {/*            <div className={`rounded-2xl p-5 ${*/}
                {/*                rawData?.dpl_reg?.payment_status == 1*/}
                {/*                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300'*/}
                {/*                    : 'bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300'*/}
                {/*            }`}>*/}
                {/*                <div className="flex items-center justify-between flex-wrap gap-4">*/}
                {/*                    <div className="flex items-center gap-4">*/}
                {/*                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${*/}
                {/*                            rawData?.dpl_reg?.payment_status == 1*/}
                {/*                                ? 'bg-gradient-to-br from-green-500 to-emerald-600'*/}
                {/*                                : 'bg-gradient-to-br from-amber-500 to-yellow-600'*/}
                {/*                        }`}>*/}
                {/*            <span className="text-3xl">*/}
                {/*                {rawData?.dpl_reg?.payment_status == 1 ? '✅' : '⏳'}*/}
                {/*            </span>*/}
                {/*                        </div>*/}
                {/*                        <div>*/}
                {/*                            <p className="text-sm font-semibold text-slate-600 mb-1">Payment Status</p>*/}
                {/*                            <p className={`text-xl font-bold ${*/}
                {/*                                rawData?.dpl_reg?.payment_status == 1*/}
                {/*                                    ? 'text-green-700'*/}
                {/*                                    : 'text-amber-700'*/}
                {/*                            }`}>*/}
                {/*                                {rawData?.dpl_reg?.payment_status == 1 ? 'Payment Confirmed' : 'Under Review'}*/}
                {/*                            </p>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}

                {/*                    {rawData?.dpl_reg?.payment_status != 1 && (*/}
                {/*                        <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 text-sm text-amber-800">*/}
                {/*                            <p className="font-medium">⚡ Your payment is being verified</p>*/}
                {/*                        </div>*/}
                {/*                    )}*/}
                {/*                </div>*/}
                {/*            </div>*/}

                {/*            /!* Next Steps *!/*/}
                {/*            {rawData?.dpl_reg?.payment_status == 1 && (*/}
                {/*                <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-5 border-2 border-blue-200">*/}
                {/*                    <div className="flex items-start gap-3">*/}
                {/*                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">*/}
                {/*                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                {/*                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />*/}
                {/*                            </svg>*/}
                {/*                        </div>*/}
                {/*                        <div>*/}
                {/*                            <h4 className="font-bold text-slate-900 mb-1">Next Steps</h4>*/}
                {/*                            <p className="text-sm text-slate-600">*/}
                {/*                                Please complete your profile information below to finalize your tournament registration.*/}
                {/*                            </p>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            )}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}

                {/* Info Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Update Your Profile Information</h3>
                            <p className="text-sm text-slate-600">
                                Keep your cricket profile up-to-date with accurate information. This helps tournament organizers and teams connect with you.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            Profile Details
                        </h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
                    </div>

                    <PlayerUpdateForm
                        initialData={cleanData}
                        onSubmit={handleUpdate}
                        submitLabel="Update Profile"
                    />
                </div>

                {/* Additional Info Cards */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {/* Playing Stats Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <span className="text-xl">📊</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Playing Style</h3>
                        </div>
                        <div className="space-y-3">
                            {cleanData.playing_role && (
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-600">Playing Role</span>
                                    <span className="text-sm font-bold text-slate-900">{formatEnumLabel(cleanData.playing_role)}</span>
                                </div>
                            )}
                            {cleanData.batting_style && (
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-600">Batting Style</span>
                                    <span className="text-sm font-bold text-slate-900">{formatEnumLabel(cleanData.batting_style)}</span>
                                </div>
                            )}
                            {cleanData.bowling_style && (
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-600">Bowling Style</span>
                                    <span className="text-sm font-bold text-slate-900">{formatEnumLabel(cleanData.bowling_style)}</span>
                                </div>
                            )}
                            {cleanData.batting_position && (
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-600">Batting Position</span>
                                    <span className="text-sm font-bold text-slate-900">{formatEnumLabel(cleanData.batting_position)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Info Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <span className="text-xl">👤</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Quick Info</h3>
                        </div>
                        <div className="space-y-3">
                            {cleanData.district && (
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-600">District</span>
                                    <span className="text-sm font-bold text-slate-900">{rawData?.district_name}</span>
                                </div>
                            )}
                            {cleanData.jersey_size && (
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-600">Jersey Size</span>
                                    <span className="text-sm font-bold text-slate-900">{cleanData.jersey_size}</span>
                                </div>
                            )}
                            {cleanData.phone && (
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-600">Contact</span>
                                    <span className="text-sm font-bold text-slate-900">{cleanData.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}