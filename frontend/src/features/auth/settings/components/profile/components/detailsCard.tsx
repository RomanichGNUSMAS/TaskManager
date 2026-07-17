import React, { RefObject } from "react";
import { useThemeStyles } from "../../../../../../hooks/useThemeStyles";
import { User } from "../../../../../../types/types";

export const DetailsCard: React.FC<{ setChange : (data:boolean) => void,data : User, name:RefObject<HTMLSpanElement | null>, email:RefObject<HTMLSpanElement | null>,num:RefObject<HTMLSpanElement | null>,formatDate : (d : string) => string }> = ({ setChange, data,name,email,num,formatDate}) => {
    const { isDark, text } = useThemeStyles();
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

    return (
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
                        <span ref={name} onInput={() => setChange(true)} contentEditable suppressContentEditableWarning className={`font-medium ${text.primary}`}>{data.name} {data.surname}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className={isDark ? 'text-slate-500' : 'text-blue-600'}>Email address</span>
                        <span ref={email} onInput={() => setChange(true)} contentEditable suppressContentEditableWarning className={`font-medium ${text.primary}`}>{data.email}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className={isDark ? 'text-slate-500' : 'text-blue-600'}>Phone number</span>
                        <span ref={num} onInput={() => setChange(true)} contentEditable suppressContentEditableWarning className={`font-medium ${text.primary}`}>{data.phone}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className={isDark ? 'text-slate-500' : 'text-blue-600'}>Role</span>
                        <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-blue-200 text-blue-900'}`}>{data.role}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}