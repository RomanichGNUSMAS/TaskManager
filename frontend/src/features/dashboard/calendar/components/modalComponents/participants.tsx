import React, { useState } from "react";
import { SelectDevelopers } from "./selectDevelopers";
import { User } from "../../../../../types/types";
import { useThemeStyles } from "../../../../../hooks/useThemeStyles";

export const Participants: React.FC<{ toggleParticipant:(id:string) => void,labelClasses:string,selectedDevelopers: User[], removeParticipant:(id:string) => void, participants: string[],isLoadingDevelopers:boolean,developers:User[]}> = ({ toggleParticipant,developers,isLoadingDevelopers,participants,labelClasses,selectedDevelopers,removeParticipant}) => {
    const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
    const { input,text,border } = useThemeStyles()

    return (
        <div className="relative" >
            <label className={labelClasses}>Participants</label>
            <button
                type="button"
                onClick={() => setIsParticipantsOpen((prev) => !prev)}
                className={`${input} flex w-full items-center justify-between gap-2 text-left`}
            >
                <span className={selectedDevelopers.length ? text.primary : text.secondary}>
                    {selectedDevelopers.length
                        ? `${selectedDevelopers.length} developer${selectedDevelopers.length > 1 ? "s" : ""} selected`
                        : "Select developers"}
                </span>
                <span className={`text-xs transition-transform duration-150 ${isParticipantsOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            {
                isParticipantsOpen && (
                    <SelectDevelopers participants={participants} toggleParticipant={toggleParticipant} developers={developers!} isLoadingDevelopers={isLoadingDevelopers} />
                )
            }

            {
                selectedDevelopers.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                        {selectedDevelopers.map((dev) => (
                            <span
                                key={dev._id}
                                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${border.secondary} ${text.secondary}`}
                            >
                                {dev.name ?? dev.email}
                                <button
                                    type="button"
                                    onClick={() => removeParticipant(dev._id)}
                                    className="text-slate-400 transition-colors duration-150 hover:text-red-500"
                                    aria-label={`Remove ${dev.name ?? dev.email}`}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )
            }
        </div >
    )
}