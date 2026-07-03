import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ReactModal from "react-modal";
import { Event } from "../../../../types/types";
import { useThemeStyles } from "../../../../hooks/useThemeStyles";
import { useGetMeQuery, useGetUsersByRoleQuery } from "../../../auth/authApi";
import { Participants } from "./modalComponents/participants";
import { Options } from "./modalComponents/options";
import { MeetingOptionFeauture } from "./modalComponents/mettingOptionFeauture";
import { useGetProjectsQuery, useNewEventMutation } from "../../dashboardApi";
type EventFormValues = {
    title: string;
    date: string;
    time: string;
    eventType: "meeting" | "reminder" | "deadline";
    projectId: string;
    location?: string;
    link?: string;
    participants: string[];
};

export const CreateModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: EventFormValues) => void; }> = ({ isOpen, onClose, onSubmit }) => {
    const { input, text, button, bg, border, isDark } = useThemeStyles();
    const { data: me } = useGetMeQuery();
    const {
        handleSubmit,
        formState: { errors },
        register,
        watch,
    } = useForm<EventFormValues>({
        defaultValues: {
            title: "",
            date: "",
            time: "09:00",
            eventType: "meeting",
            projectId: "",
            location: "",
            link: "",
            participants: [],
        },
    });

    const selectedType = watch("eventType");

    const [participants, setParticipants] = useState<string[]>([]);

    const { data: developers, isLoading: isLoadingDevelopers } = useGetUsersByRoleQuery({ role: "DEVELOPER" });
    const { data : projects } = useGetProjectsQuery();
    const [createEvent] = useNewEventMutation();

    const toggleParticipant = (userId: string) => {
        setParticipants((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const removeParticipant = (userId: string) => {
        setParticipants((prev) => prev.filter((id) => id !== userId));
    };

    const selectedDevelopers = (developers ?? []).filter((dev) => participants.includes(dev._id));

    const labelClasses = `mb-1.5 block text-sm font-medium ${text.secondary}`;
    const errorClasses = "mt-1.5 text-sm text-red-500";
    const cancelButtonClasses = `rounded-2xl border px-4 py-2 text-sm font-medium transition-all duration-150 ${border.primary} ${text.primary} ${
        isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
    }`;
    const fieldInputClasses = `${input} w-full transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/40`;

    const handleSave: SubmitHandler<EventFormValues> = async (data) => {
        const selectedProject = projects?.projects.find((project) => project._id === data.projectId);
        if (!selectedProject) return;

        const eventDate = new Date(`${data.date}T${data.time}`);

        const eventBody: Event = {
            _id: "",
            title: data.title,
            date: eventDate.toISOString(),
            eventType: data.eventType,
            project: { name: selectedProject.name, projectId: selectedProject._id },
            location: data.location ?? "",
            link: data.link,
            teamLeadId: me!._id,
            participants: participants,
        };

        onSubmit({ ...data, participants });

        await createEvent({ event: eventBody, token: localStorage.getItem("token")! })
            .unwrap()
            .catch(console.error);

        onClose();
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            overlayClassName="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4"
            className={`mx-auto my-10 w-[min(95vw,580px)] rounded-[28px] border p-6 shadow-2xl outline-none sm:p-7 ${border.primary} ${bg.primary}`}
        >
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <h2 className={`text-xl font-semibold tracking-tight ${text.primary}`}>Create event</h2>
                    <p className={`text-sm ${text.secondary}`}>Add new calendar event details</p>
                </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(handleSave)}>
                <div>
                    <label className={labelClasses}>Title</label>
                    <input
                        className={fieldInputClasses}
                        type="text"
                        placeholder="e.g. Product sync"
                        {...register("title", { required: "Please fill title" })}
                    />
                    {errors.title && <p className={errorClasses}>{errors.title.message}</p>}
                </div>

                <Options 
                    labelClasses={labelClasses}
                    fieldInputClasses={fieldInputClasses}
                    register={register}
                    errorClasses={errorClasses}
                    errors={errors}
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label className={labelClasses}>Project</label>
                        <select
                            className={`${fieldInputClasses} cursor-pointer ${!projects?.projects?.length ? "opacity-70" : ""}`}
                            {...register("projectId", { required: "Please select a project" })}
                            disabled={!projects?.projects?.length}
                        >
                            <option value="">Select project</option>
                            {projects?.projects?.map(project => (
                                <option key={project._id} value={project._id}>{project.name}</option>
                            ))}
                        </select>
                        {errors.projectId && <p className={errorClasses}>{errors.projectId.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Time</label>
                        <input
                            className={fieldInputClasses}
                            type="time"
                            {...register("time", { required: "Please select a time" })}
                        />
                        {errors.time && <p className={errorClasses}>{errors.time.message}</p>}
                    </div>
                </div>

                <MeetingOptionFeauture 
                    labelClasses={labelClasses}
                    fieldInputClasses={fieldInputClasses}
                    register={register}
                    errorClasses={errorClasses}
                    errors={errors}
                    selectedType={selectedType}
                />

                <Participants 
                    developers={developers!}
                    selectedDevelopers={selectedDevelopers}
                    toggleParticipant={toggleParticipant}
                    removeParticipant={removeParticipant}
                    isLoadingDevelopers={isLoadingDevelopers}
                    labelClasses={labelClasses}
                    participants={participants}
                />

                <div className={`flex flex-col gap-3 border-t pt-5 sm:flex-row sm:justify-end ${border.secondary}`}>
                    <button type="button" onClick={onClose} className={cancelButtonClasses}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit(handleSave)} type="submit" className={`${button.primary} w-full sm:w-auto`}>
                        Save Event
                    </button>
                </div>
            </form>
        </ReactModal>
    );
};