import React from "react";
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

export const Options: React.FC<{errors : FieldErrors<EventFormValues>, labelClasses:string,fieldInputClasses : string,errorClasses : string,register:UseFormRegister<EventFormValues>}> = ({ errors, labelClasses, fieldInputClasses, errorClasses, register}) => {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
                <label className={labelClasses}>Date</label>
                <input
                    className={fieldInputClasses}
                    type="date"
                    {...register("date", { required: "Please fill the date" })}
                />
                {errors.date && <p className={errorClasses}>{errors.date.message}</p>}
            </div>

            <div>
                <label className={labelClasses}>Event type</label>
                <select
                    className={`${fieldInputClasses} cursor-pointer`}
                    {...register("eventType", { required: "Please select event type" })}
                >
                    <option value="meeting">Meeting</option>
                    <option value="reminder">Reminder</option>
                    <option value="deadline">Deadline</option>
                </select>
                {errors.eventType && <p className={errorClasses}>{errors.eventType.message}</p>}
            </div>
        </div>
    )
}