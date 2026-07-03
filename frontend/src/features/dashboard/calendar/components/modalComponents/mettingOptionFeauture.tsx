import React from "react";
import { useThemeStyles } from "../../../../../hooks/useThemeStyles";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type EventFormValues = {
    title: string;
    date: string;
    eventType: "meeting" | "reminder" | "deadline";
    projectId: string;
    location?: string;
    link?: string;
    participants: string[];
};

export const MeetingOptionFeauture: React.FC<{ selectedType: string, labelClasses: string, errorClasses: string, errors: FieldErrors<EventFormValues>, fieldInputClasses: string, register: UseFormRegister<EventFormValues> }> = ({ selectedType, labelClasses, fieldInputClasses, errorClasses, errors, register }) => {
    const { border, bg } = useThemeStyles()

    return <>{selectedType === "meeting" && (
        <div className={`space-y-5 rounded-2xl border p-4 ${border.secondary} ${bg.secondary}`}>
            <div>
                <label className={labelClasses}>Location</label>
                <input
                    className={fieldInputClasses}
                    type="text"
                    placeholder="e.g. Conference room B"
                    {...register("location", { required: "Please fill location" })}
                />
                {errors.location && <p className={errorClasses}>{errors.location.message}</p>}
            </div>

            <div>
                <label className={labelClasses}>Link</label>
                <input
                    className={fieldInputClasses}
                    type="url"
                    placeholder="https://"
                    {...register("link")}
                />
                {errors.link && <p className={errorClasses}>{errors.link.message}</p>}
            </div>
        </div>
    )

    }
    </>
}