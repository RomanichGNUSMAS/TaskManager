import { useGetMeQuery } from "../../../authApi"
import { useThemeStyles } from "../../../../../hooks/useThemeStyles"
import { Image } from "./components/Image"
import { RefObject, useRef, useState } from "react"
import { DetailsCard } from "./components/detailsCard"
import { useHandleSaveChange } from "./handleSave"

export const MyProfile = () => {
    const { data } = useGetMeQuery()
    const { card, text, isDark } = useThemeStyles()
    const [error, setError] = useState('');
    const statusBadgeClass = isDark
    ? 'inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-2 text-sm text-slate-200'
    : 'inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/50 px-4 py-2 text-sm text-blue-900';
    
    const profileCardClass = isDark
    ? 'rounded-3xl border border-slate-800/70 bg-slate-950/80 p-5 shadow-sm'
    : 'rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm shadow-blue-200/20';
    
    const [isSomethingChanges, setChange] = useState(false)
    const [isImageChanged, setImageChange] = useState(false);
    
    const [name, email, num] = Array.from({ length: 3 }, () => useRef<null | HTMLSpanElement>(null))
    const file = useRef<null | HTMLInputElement>(null)
    const saveChanges = useHandleSaveChange({
        setError,
        setChange,
        data : data!,
        file,
        name,
        email,
        num,
        isImageChanged,
    })
    const formatDate = (value?: string | Date) => {
        if (!value) return 'Unknown'
        const date = typeof value === 'string' ? new Date(value) : value
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    }


    return data && (
        <div className={`${card} space-y-6 p-6`}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className={`text-xs uppercase tracking-[0.35em] ${isDark ? 'text-slate-500' : 'text-blue-600'}`}>Profile overview</p>
                    <h3 className={`mt-2 text-2xl font-semibold ${text.primary}`}>My Profile</h3>
                </div>
                <div className={statusBadgeClass}>
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    {data.role.toLowerCase()}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                <div className={profileCardClass}>
                    <Image ref={file as RefObject<HTMLInputElement>} setChange={setImageChange} user={data} />
                    <div className="mt-5 space-y-2 text-center">
                        <p className={`text-lg font-semibold ${text.primary}`}>{data.name} {data.surname}</p>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-blue-600'}`}>Team member since {formatDate(data.createdAt)}</p>
                    </div>
                    {(isSomethingChanges || isImageChanged) && (
                        <button
                            className={`${isDark
                                ? 'bg-green-950/30 border-green-600 text-green-400'
                                : 'bg-green-100 border-green-500 text-green-700'
                                } border-1 p-[5px] mx-10 font-mono rounded-2xl`}
                            onClick={saveChanges}
                        >
                            save changes
                        </button>
                    )}                    {
                        error?.split('?').map(err =>
                            <p key={err}>{err}</p>
                        ) || error
                    }
                </div>

                <DetailsCard
                    data={data}
                    setChange={setChange}
                    formatDate={formatDate}
                    name={name}
                    num={num}
                    email={email}
                />
            </div>
        </div>
    )
}