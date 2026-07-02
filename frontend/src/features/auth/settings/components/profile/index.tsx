import { useGetMeQuery, useSetPhotoMutation, useUpdateUserMutation } from "../../../authApi"
import { useThemeStyles } from "../../../../../hooks/useThemeStyles"
import { Image } from "./components/Image"
import { RefObject, useRef, useState } from "react"

export const MyProfile = () => {
    const { data } = useGetMeQuery()
    const { card, text, isDark } = useThemeStyles()
    const [error, setError] = useState('');
    const [setPhoto] = useSetPhotoMutation()
    const [setChangeOnUser] = useUpdateUserMutation();

    const statusBadgeClass = isDark
        ? 'inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-2 text-sm text-slate-200'
        : 'inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/50 px-4 py-2 text-sm text-blue-900';

    const profileCardClass = isDark
        ? 'rounded-3xl border border-slate-800/70 bg-slate-950/80 p-5 shadow-sm'
        : 'rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm shadow-blue-200/20';

    const detailsCardClass = isDark
        ? 'rounded-3xl border border-slate-800/70 bg-slate-950/80 p-6 shadow-sm'
        : 'rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm shadow-blue-200/20';

    const infoBoxClass = isDark
        ? 'space-y-1 rounded-3xl bg-slate-900/80 p-4'
        : 'space-y-1 rounded-3xl bg-blue-100/50 p-4 border border-blue-200';

    const infoLabelClass = isDark ? 'text-slate-500' : 'text-blue-600';
    const infoBorderBoxClass = isDark
        ? 'mt-6 rounded-3xl border border-slate-800/70 bg-slate-900/80 p-4'
        : 'mt-6 rounded-3xl border border-blue-200 bg-blue-100/50 p-4';

    const infoTitleClass = isDark ? 'text-slate-100' : 'text-blue-900';

    const [isSomethingChanges, setChange] = useState(false)
    const [isImageChanged, setImageChange] = useState(false);

    const [name, email, num] = Array.from({ length: 3 }, () => useRef<null | HTMLSpanElement>(null))
    const file = useRef<null | HTMLInputElement>(null)
    const formatDate = (value?: string | Date) => {
        if (!value) return 'Unknown'
        const date = typeof value === 'string' ? new Date(value) : value
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const handleSaveChange = () => {
        const [nameContent, emailContent, numContent] = [name.current!.textContent, email.current!.textContent, num.current!.textContent]
        let str = '';
        function isChangedImg() {
            if (isImageChanged) {
                const formData = new FormData();
                formData.append('avatar', file!.current!.files![0])
                void setPhoto({ file: formData, id: data!._id })
                    .unwrap()
                    .catch(err => setError(err.message))
            }
        }
        if (isImageChanged) {
            isChangedImg();
            return;
        }
        if (!nameContent?.trim() || nameContent.split(' ').length == 1 || nameContent.split(' ').length > 2) str += 'invalid name?'
        if (!emailContent?.trim()) str += 'invalid email?'
        if (!numContent?.trim() || isNaN(+numContent)) str += 'invalid number?'
        if (str) return setError(str);
        setError('')
        setChange(false);
        void setChangeOnUser({ user: { name: nameContent.split(' ')[0], surname: nameContent.split(' ')[1], email: emailContent, phone: +numContent }, id: data!._id })
            .unwrap()
            .then(() => {
                isChangedImg()
                localStorage.removeItem('token');
            })
            .catch(err => setError(err.message))

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
                    {(isSomethingChanges || isImageChanged) && <button onClick={handleSaveChange}>save changes</button>}
                    {
                        error?.split('?').map(err =>
                            <p key={err}>{err}</p>
                        ) || error
                    }
                </div>

                <div className={detailsCardClass}>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className={infoBoxClass}>
                            <p className={`text-xs uppercase tracking-[0.28em] ${infoLabelClass}`}>Contact</p>
                            <p className={`text-sm ${text.secondary}`}><span className={`font-medium ${isDark ? 'text-slate-200' : 'text-blue-900'}`}>Email:</span> {data.email}</p>
                            <p className={`text-sm ${text.secondary}`}><span className={`font-medium ${isDark ? 'text-slate-200' : 'text-blue-900'}`}>Phone:</span> {data.phone}</p>
                        </div>
                        <div className={infoBoxClass}>
                            <p className={`text-xs uppercase tracking-[0.28em] ${infoLabelClass}`}>Account</p>
                            <p className={`text-sm ${text.secondary}`}><span className={`font-medium ${isDark ? 'text-slate-200' : 'text-blue-900'}`}>Role:</span> {data.role}</p>
                            <p className={`text-sm ${text.secondary}`}><span className={`font-medium ${isDark ? 'text-slate-200' : 'text-blue-900'}`}>Joined:</span> {formatDate(data.createdAt)}</p>
                        </div>
                    </div>

                    <div className={infoBorderBoxClass}>
                        <p className={`text-sm font-semibold ${infoTitleClass}`}>Profile details</p>
                        <div className={`mt-3 space-y-3 text-sm ${isDark ? 'text-slate-300' : 'text-blue-900'}`}>
                            <div className="flex items-center justify-between gap-2">
                                <span className={isDark ? 'text-slate-500' : 'text-blue-600'}>Full name</span>
                                <span ref={name} onInput={() => setChange(true)} contentEditable className={`font-medium ${text.primary}`}>{data.name} {data.surname}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className={isDark ? 'text-slate-500' : 'text-blue-600'}>Email address</span>
                                <span ref={email} onInput={() => setChange(true)} contentEditable className={`font-medium ${text.primary}`}>{data.email}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className={isDark ? 'text-slate-500' : 'text-blue-600'}>Phone number</span>
                                <span ref={num} onInput={() => setChange(true)} contentEditable className={`font-medium ${text.primary}`}>{data.phone}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className={isDark ? 'text-slate-500' : 'text-blue-600'}>Role</span>
                                <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-blue-200 text-blue-900'}`}>{data.role}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}