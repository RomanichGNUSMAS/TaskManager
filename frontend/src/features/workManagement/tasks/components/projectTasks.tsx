import React from "react";
import { useGetTasksByProjectIdQuery } from "../../workManagementApi"; 
import { useThemeStyles } from "../../../../hooks/useThemeStyles";
import { Task } from "../../../../types/types";
import { UserAvatar } from "./userAvatar";

interface ProjectTasksProps {
    projectId: string;
    projectName: string;
}

const priorityStyles: Record<Task['priority'], string> = {
    low: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    high: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    urgent: 'bg-rose-500/10 text-rose-300 border-rose-500/20'
};


export const ProjectTasks: React.FC<ProjectTasksProps> = ({ projectId, projectName }) => {
    const { text } = useThemeStyles();
    
    const { data: tasks, isLoading } = useGetTasksByProjectIdQuery({ projectId })
    return tasks && (
        <div className="border-b border-slate-700/50 pb-4 last:border-none">
            <h2 className={`text-lg font-semibold mb-4 ${text.primary}`}>{projectName}</h2>

            {isLoading && <p className={`text-xs ${text.tertiary}`}>Loading tasks…</p>}

            <div className="space-y-3">
                {
                    tasks.map((task: Task) => (
                        <div key={task._id} className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.9)]">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
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
                                                <div key={userId} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-800 text-xs font-semibold text-slate-100 shadow-sm">
                                                    <UserAvatar userId={userId} />
                                                </div>
                                            ))}
                                            {task.userIds.length > 4 && (
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 shadow-sm">
                                                    +{task.userIds.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-500">No assignees yet</span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                <div className="space-y-2">
                                    <p className={`text-sm font-medium ${text.primary}`}>Subtasks</p>
                                    {task.subtasks && task.subtasks.length > 0 ? (
                                        <div className="space-y-2 text-sm text-slate-400">
                                            {task.subtasks.slice(0, 3).map((subtask, index) => (
                                                <div key={`${subtask.title}-${index}`} className="flex items-center gap-2 rounded-2xl bg-slate-900/80 px-3 py-2">
                                                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${subtask.done ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                                                    <span className={subtask.done ? 'text-slate-300 line-through' : 'text-slate-200'}>{subtask.title}</span>
                                                </div>
                                            ))}
                                            {task.subtasks.length > 3 && (
                                                <p className="text-xs text-slate-500">+{task.subtasks.length - 3} more subtasks</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500">No subtasks yet</p>
                                    )}
                                </div>

                                <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-xs text-slate-400">
                                    {task.subtasks?.length ?? 0} subtasks
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};