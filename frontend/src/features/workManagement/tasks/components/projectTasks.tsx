import React from "react";
import { useGetTasksByProjectIdQuery } from "../../workManagementApi";
import { useThemeStyles } from "../../../../hooks/useThemeStyles";
import { Task, User } from "../../../../types/types";
import { UserAvatar } from "./userAvatar";

interface ProjectTasksProps {
    projectId: string;
    projectName: string;
    user : User;
}

const priorityStyles: Record<Task['priority'], string> = {
    low: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    high: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    urgent: 'bg-rose-500/10 text-rose-300 border-rose-500/20'
};

export const ProjectTasks: React.FC<ProjectTasksProps> = ({ projectId, projectName,user }) => {
    const { text, isDark, border, bg, button } = useThemeStyles();

    const { data: tasks, isLoading } = useGetTasksByProjectIdQuery({ projectId });

    if (!tasks) {
        return null;
    }

    return (
        <div className={`border-b pb-4 last:border-none ${isDark ? 'border-slate-700/50' : 'border-slate-200/70'}`}>
            <h2 className={`text-lg font-semibold mb-4 ${text.primary}`}>{projectName}</h2>

            {isLoading && <p className={`text-xs ${text.tertiary}`}>Loading tasks…</p>}

            <div className="space-y-3">
                {tasks.map((task: Task) => (
                    <div
                        key={task._id}
                        className={`rounded-[28px] border p-4 shadow-lg ${isDark ? 'border-slate-800/80 bg-slate-950/90 shadow-slate-950/20' : 'border-slate-200/70 bg-white shadow-slate-200/40'}`}
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-cyan-500'}`} />
                                    <h3 className={`text-base font-semibold ${text.primary}`}>{task.title}</h3>
                                </div>
                                <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase ${priorityStyles[task.priority]}`}>
                                    {task.priority}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {task.userIds.length > 0 ? (
                                    <div className="flex -space-x-2">
                                        {task.userIds.slice(0, 4).map(userId => (
                                            <div
                                                key={userId}
                                                className={`flex h-9 w-9 items-center justify-center rounded-full border ${isDark ? 'border-slate-800 bg-slate-800 text-slate-100' : 'border-slate-200 bg-slate-100 text-slate-900'} text-xs font-semibold shadow-sm`}
                                            >
                                                <UserAvatar userId={userId} />
                                            </div>
                                        ))}
                                        {task.userIds.length > 4 && (
                                            <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${isDark ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-slate-100 text-slate-700'} text-xs font-semibold shadow-sm`}>
                                                +{task.userIds.length - 4}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>No assignees yet</span>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex gap-2">
                                {   (user.role == 'GOD' || user.role == 'TEAMLEAD' ) ? 
                                    ( <><button type="button" className={`${button.secondary} text-sm`}>Update</button>
                                    <button type="button" className={`${button.danger} text-sm`}>Delete</button> </>) :
                                    <button>Done</button>
                                }
                            </div>
                            <div className={`rounded-3xl border px-4 py-3 text-xs ${isDark ? 'border-slate-800/70 bg-slate-900/80 text-slate-400' : 'border-slate-200/70 bg-slate-100 text-slate-600'}`}>
                                {task.subtasks?.length ?? 0} subtasks
                            </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                            <div className="space-y-2">
                                <p className={`text-sm font-medium ${text.primary}`}>Subtasks</p>
                                {task.subtasks && task.subtasks.length > 0 ? (
                                    <div className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {task.subtasks.slice(0, 3).map((subtask, index) => (
                                            <div
                                                key={`${subtask.title}-${index}`}
                                                className={`flex items-center gap-2 rounded-2xl px-3 py-2 ${isDark ? 'bg-slate-900/80' : 'bg-slate-100'}`}
                                            >
                                                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${subtask.done ? 'bg-emerald-400' : isDark ? 'bg-slate-500' : 'bg-slate-400'}`} />
                                                <span className={subtask.done ? 'line-through' : ''}>{subtask.title}</span>
                                            </div>
                                        ))}
                                        {task.subtasks.length > 3 && (
                                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>+{task.subtasks.length - 3} more subtasks</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>No subtasks yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};