import { useGetMeQuery } from "../../../authApi"
import { useThemeStyles } from "../../../../../hooks/useThemeStyles"
import { Image } from "./components/Image"

export const MyProfile = () => {
    const { data } = useGetMeQuery()
    const { card, text } = useThemeStyles()

    const formatDate = (value?: string | Date) => {
        if (!value) return 'Unknown'
        const date = typeof value === 'string' ? new Date(value) : value
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    }

    return data && (
        <div className={`${card} space-y-6 p-6`}> 
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Profile overview</p>
                    <h3 className={`mt-2 text-2xl font-semibold ${text.primary}`}>My Profile</h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-2 text-sm text-slate-200">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    {data.role.toLowerCase()}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-5 shadow-sm">
                    <Image user={data} />
                    <div className="mt-5 space-y-2 text-center">
                        <p className={`text-lg font-semibold ${text.primary}`}>{data.name} {data.surname}</p>
                        <p className="text-sm text-slate-400">Team member since {formatDate(data.createdAt)}</p>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-6 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1 rounded-3xl bg-slate-900/80 p-4">
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Contact</p>
                            <p className={`text-sm ${text.secondary}`}><span className="font-medium text-slate-200">Email:</span> {data.email}</p>
                            <p className={`text-sm ${text.secondary}`}><span className="font-medium text-slate-200">Phone:</span> {data.phone}</p>
                        </div>
                        <div className="space-y-1 rounded-3xl bg-slate-900/80 p-4">
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Account</p>
                            <p className={`text-sm ${text.secondary}`}><span className="font-medium text-slate-200">Role:</span> {data.role}</p>
                            <p className={`text-sm ${text.secondary}`}><span className="font-medium text-slate-200">Joined:</span> {formatDate(data.createdAt)}</p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-slate-800/70 bg-slate-900/80 p-4">
                        <p className="text-sm font-semibold text-slate-100">Profile details</p>
                        <div className="mt-3 space-y-3 text-sm text-slate-300">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-500">Full name</span>
                                <span className={`font-medium ${text.primary}`}>{data.name} {data.surname}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-500">Email address</span>
                                <span className={`font-medium ${text.primary}`}>{data.email}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-500">Phone number</span>
                                <span className={`font-medium ${text.primary}`}>{data.phone}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-500">Role</span>
                                <span className={`rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.22em] ${text.secondary}`}>{data.role}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}