import React from "react";
import { User } from "../../../../../types/types";
import { useThemeStyles } from "../../../../../hooks/useThemeStyles";

export const SelectDevelopers: React.FC<{ isLoadingDevelopers: boolean, developers: User[], participants: string[], toggleParticipant: (id: string) => void }> = ({ isLoadingDevelopers, developers,participants, toggleParticipant }) => {
    const { input, text, button, bg, border, isDark } = useThemeStyles();

    return (
        <div
            className={`absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border p-2 shadow-xl ${border.primary} ${bg.primary}`}
        >
            {isLoadingDevelopers && (
                <p className={`px-2 py-1.5 text-sm ${text.secondary}`}>Loading developers…</p>
            )}
            {!isLoadingDevelopers && developers?.length === 0 && (
                <p className={`px-2 py-1.5 text-sm ${text.secondary}`}>No developers found</p>
            )}
            {developers?.map((dev) => {
                const isSelected = participants.includes(dev._id);
                return (
                    <label
                        key={dev._id}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm transition-colors duration-150 ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
                            }`}
                    >
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleParticipant(dev._id)}
                            className="h-4 w-4 rounded border-slate-400 accent-indigo-500"
                        />
                        <span className={text.primary}>{dev.name ?? dev.email}</span>
                    </label>
                );
            })}
        </div>
    )
}