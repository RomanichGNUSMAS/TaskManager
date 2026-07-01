import React, { useRef, useState } from "react";
import { Project, Task } from "../../../../types/types";
import { useGetTasksByProjectIdQuery, useUpdateProjectMutation } from "../../workManagementApi";
import { DeletModal } from "./deleteModal";
import { useThemeStyles } from "../../../../hooks/useThemeStyles";
import { useGetMeQuery } from "../../../auth/authApi";

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const { data: taskData, isLoading: isTasksLoading } = useGetTasksByProjectIdQuery({
        projectId: project._id
    });

    const [updateProject] = useUpdateProjectMutation();
    const [isDeleting, setDeleteState] = useState(false);
    const [isUpdating, setUpdateState] = useState(false);
    const { card, text, button } = useThemeStyles();
    const { data: me } = useGetMeQuery()
    const nameRef = useRef<null | HTMLHeadingElement>(null);
    const stateRef = useRef<null | HTMLSpanElement>(null);
    const progress = project.tasksCount > 0
        ? Math.round((project.completedCount * 100) / project.tasksCount)
        : 0;


    const handleSaveChanges = (project: Project, token: string) => {
        if (!nameRef.current?.textContent?.trim()
            || !stateRef.current?.innerText?.trim()) return;
        void updateProject({
            project: {
                name: nameRef.current.textContent,
                state: stateRef.current.innerText as 'on_hold' | 'active' | 'completetd'
            }, id: project._id, token
        })
            .unwrap()
            .catch(err => {
                console.error(err)
            })

    }
    return taskData && me  && (
        <div className={`${card} mb-4 transition`}>
            {isDeleting && <DeletModal
                setDeleteState={setDeleteState}
                id={project._id}
                token={localStorage.getItem('token')!}
            />}
            <div className="flex flex-col gap-0.75 mb-4">
                <h1 ref={nameRef} contentEditable={isUpdating} className={`text-lg font-semibold ${text.primary}`}>{project.name}</h1>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-0.75">
                        <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                            ● {project.completedCount}/{project.tasksCount}
                        </span>
                        <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                            ↗ {progress}%
                        </span>
                        <span ref={stateRef} contentEditable={isUpdating} className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                            {project.state}
                        </span>
                    </div>
                    <div className="flex items-center gap-0.75 shrink-0">
                        {(!isUpdating && (me.role == 'GOD' || me.role == 'TEAMLEAD')) && <button
                            onClick={() => setUpdateState(true)}
                            className={button.secondary}
                        >
                            Update
                        </button>}
                        {(me.role === 'GOD' || me.role === 'TEAMLEAD') && (
                            !isUpdating ? (
                                <button
                                    onClick={() => setDeleteState(true)}
                                    className={button.danger}
                                >
                                    Delete
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="rounded-lg bg-green-950/50 px-3 py-1.5 text-xs font-medium text-green-400 transition hover:bg-green-950 border border-green-900/30"
                                        onClick={() => {
                                            handleSaveChanges(project, localStorage.getItem('token')!);
                                            setUpdateState(false);
                                        }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="rounded-lg bg-yellow-950/50 px-3 py-1.5 text-xs font-medium text-yellow-400 transition hover:bg-yellow-950 border border-yellow-900/30"
                                        onClick={() => setUpdateState(false)}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )
                        )}

                    </div>
                </div>
            </div>

            <div className={`mt-4 pl-4 border-l-2 ${text.primary.includes('white') ? 'border-slate-800/50' : 'border-slate-200/50'}`}>
                <h3 className={`text-xs font-semibold uppercase tracking-[0.28em] ${text.tertiary} mb-3`}>Tasks</h3>

                {isTasksLoading && <p className={`text-xs ${text.secondary}`}>Loading...</p>}

                {taskData.map((task: Task) => (
                    <div key={task._id} className={`text-sm ${text.secondary} py-2 flex items-center gap-2.5`}>
                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0"></span>
                        <span>{task.title}</span>
                    </div>
                ))}

                {!isTasksLoading && taskData.length === 0 && (
                    <p className={`text-xs ${text.tertiary} italic`}>No tasks yet</p>
                )}
            </div>
        </div>
    );
};