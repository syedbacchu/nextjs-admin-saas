import Link from 'next/link'
import {getPublicTenantSettingsAction} from "@/features/settings";

interface AuthShellProps {
    tenantSlug: string
    children: React.ReactNode
}

export default async function AuthShell({ tenantSlug, children }: AuthShellProps) {
    const settingsRes = tenantSlug ? await getPublicTenantSettingsAction(tenantSlug) : null
    const settings = settingsRes?.success && settingsRes.data ? settingsRes.data : {}

    if (!tenantSlug) {
        console.warn('AuthShell: missing tenantSlug')
    } else if (!settingsRes) {
        console.warn('AuthShell: settings request was skipped', { tenantSlug })
    } else if (!settingsRes.success || !settingsRes.data) {
        console.warn('AuthShell: failed to load tenant settings', {
            tenantSlug,
            status: settingsRes.status,
            message: settingsRes.message,
            errorMessage: settingsRes.error_message,
            response: settingsRes,
        })
    } else {
        console.log('AuthShell: loaded tenant settings', {
            tenantSlug,
            settings,
        })
    }

    const siteTitle = String(settings.site_title || '').trim() || 'DEMO Company'
    const loginHeading = String(settings.login_heading || '').trim() || 'Secure account recovery for modern teams.'
    const tagLine =
        String(settings.tag_title || '').trim() ||
        'Demo company saas platform'
    const logoSrc = String(settings.login_logo || settings.logo || '').trim() || '/logo.png'
    const favSrc = String(settings.favicon || settings.logo || '').trim() || '/favicon.png'
    const leftImageSrc = String(settings.login_left_image || '').trim() || '/assets/images/login.png'
    const helperText =
        String(settings.login_footer_text || '').trim() ||
        'Keep dispatchers, drivers, managers, and support teams connected with a password recovery flow that feels trustworthy, fast, and clearly branded.'

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.14),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.12),_transparent_28%),linear-gradient(135deg,#fff7ed_0%,#f8fafc_40%,#ecfeff_100%)] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur lg:grid-cols-[1.08fr_0.92fr]">
                    <section className="relative hidden min-h-[720px] overflow-hidden bg-slate-950 lg:flex">

                        <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(12,10,9,0.98),rgba(17,24,39,0.94)_36%,rgba(15,118,110,0.84)_74%,rgba(251,146,60,0.84))]" />
                        <div className="absolute -left-20 top-12 h-64 w-64 rounded-full bg-orange-300/15 blur-3xl" />
                        <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-16 translate-y-20 rounded-full bg-cyan-300/20 blur-3xl" />
                        <div className="absolute inset-y-0 right-0 w-px bg-white/10" />

                        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white 2xl:p-14">
                            <div className="space-y-10">
                                <Link href={`/${tenantSlug}/login`} className="inline-flex items-center gap-4">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-3 shadow-lg shadow-black/10 backdrop-blur">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={favSrc} alt={siteTitle} className="max-h-full w-auto object-contain" />
                                    </div>
                                    <div>
                                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{siteTitle}</h1>
                                        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-200">{tagLine}</p>
                                    </div>
                                </Link>

                                <div className="max-w-xl space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-2xl font-semibold leading-tight tracking-tight text-white 2xl:text-5xl">
                                            {loginHeading}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl shadow-black/15 backdrop-blur-sm">
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />


                                    <div className="mt-4 rounded-[1.5rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] p-4">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={leftImageSrc}
                                            alt={siteTitle}
                                            className="mx-auto h-auto w-full max-w-md object-contain drop-shadow-[0_30px_40px_rgba(15,23,42,0.35)]"
                                        />
                                    </div>
                                    <p className="mt-5 max-w-lg text-sm leading-7 text-slate-200/95">
                                        {helperText}
                                    </p>
                                </div>
                            </div>


                        </div>
                    </section>

                    <section className="relative flex min-h-[100dvh] items-center justify-center px-5 py-4 sm:px-8 lg:px-6 xl:min-h-[720px] xl:px-14">
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.98))]" />
                        <div className="relative z-10 w-full max-w-xl">
                            <div className="mb-2 flex items-center justify-center">
                                <Link href={`/${tenantSlug}/login`} className="inline-flex items-center">
                                    <div className="flex w-40 sm:w-52 md:w-64 lg:w-72 items-center justify-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={logoSrc} alt={siteTitle} className="h-auto w-full object-contain" />
                                    </div>
                                </Link>
                            </div>

                            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)] sm:p-8">
                                {children}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
