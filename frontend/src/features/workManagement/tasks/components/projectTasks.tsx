import React, { useState } from "react";
import { useDeleteTaskMutation, useGetTasksByProjectIdQuery, useSetStateTaskMutation, useUpdateTaskMutation } from "../../workManagementApi";
import { useThemeStyles } from "../../../../hooks/useThemeStyles";
import { Task, User } from "../../../../types/types";
import { UserAvatar } from "./userAvatar";
import { UpdateTask } from "./updateTask";

interface ProjectTasksProps {
    projectId: string;
    projectName: string;
    user: User;
}

const priorityStyles: Record<Task['priority'], string> = {
    low: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    high: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    urgent: 'bg-rose-500/10 text-rose-300 border-rose-500/20'
};

const statusStyles: Record<Task['status'], string> = {
    todo: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    in_process: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    review: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    done: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
};

const statusLabels: Record<Task['status'], string> = {
    todo: 'Todo',
    in_process: 'In Process',
    review: 'Review',
    done: 'Done',
};

export const ProjectTasks: React.FC<ProjectTasksProps> = ({ projectId, projectName, user }) => {
    const { text, isDark, button } = useThemeStyles();
    const [isUpdating, setUpdateState] = useState({ idOfChangin: '-1' });
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation()
    const { data: tasks, isLoading, refetch } = useGetTasksByProjectIdQuery({ projectId });
    const [setState] = useSetStateTaskMutation();

    const [updatingFeautures, setFeautures] = useState({
        addedSubtasks: [] as { title: string, done: boolean }[],
        removedSubtasks: [] as string[],
        title: '',
        status: '',
        priority: ''
    })
    if (!tasks) {
        return null;
    }

    const handleDeleteTask = (taskId: string) => {
        void deleteTask({ id: taskId, token: localStorage.getItem('token')! })
            .unwrap()
            .catch(console.error)
    }

    const handleUpdateTask = (taskId: string) => {
        void updateTask({ task: updatingFeautures, id: taskId, token: localStorage.getItem('token')! })
            .unwrap()
            .catch(console.error)
    }

    const statusOptions: Task['status'][] = ['todo', 'in_process', 'review', 'done'];

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
                                    <h3 onInput={e => setFeautures({ ...updatingFeautures, priority: e.currentTarget.innerText })} suppressContentEditableWarning contentEditable={isUpdating.idOfChangin == task._id} className={`text-base font-semibold ${text.primary}`}>{task.title}</h3>
                                </div>
                                <div onInput={e => setFeautures({ ...updatingFeautures, priority: e.currentTarget.innerText })} suppressContentEditableWarning contentEditable={isUpdating.idOfChangin == task._id} className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase ${priorityStyles[task.priority]}`}>
                                    {task.priority}
                                </div>
                                <div onInput={e => setFeautures({...updatingFeautures, status: e.currentTarget.innerText})} suppressContentEditableWarning contentEditable={isUpdating.idOfChangin == task._id} className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase ${statusStyles[task.status]}`}>
                                    {statusLabels[task.status]}
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
                                {(user.role == 'GOD' || user.role == 'TEAMLEAD') ?
                                    (<>
                                        {isUpdating.idOfChangin != task._id! ?
                                            <button onClick={() => setUpdateState({ idOfChangin: task._id! })} type="button" className={`${button.save} text-sm`}>Update</button>
                                            : <button onClick={() => handleUpdateTask(task._id!)} type="button" className={`${button.save} text-sm`}>Save</button>
                                        }
                                        {isUpdating.idOfChangin != task._id! ?
                                            <button onClick={() => handleDeleteTask(task._id!)} type="button" className={`${button.cancel} text-sm`}>Delete</button>
                                            : <button onClick={() => { setUpdateState({ idOfChangin: "-1" }); refetch() }} type="button" className={`${button.cancel} text-sm`}>Cancel</button>
                                        }
                                    </>) :
                                    (
                                        <>
                                            {(task.status !== 'done' && task.userIds.some(t => t == user._id)) && (
                                                <div className="flex flex-wrap gap-2">
                                                    {statusOptions.map(status => (
                                                        <button
                                                            key={status}
                                                            type="button"
                                                            onClick={() => void setState({ id: task._id!, state: status.toLowerCase() })}
                                                            className={`${button.save} text-xs ${task.status === status ? 'ring-2 ring-cyan-400' : ''}`}
                                                        >
                                                            {statusLabels[status]}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )
                                }
                            </div>
                            <div className={`rounded-3xl border px-4 py-3 text-xs ${isDark ? 'border-slate-800/70 bg-slate-900/80 text-slate-400' : 'border-slate-200/70 bg-slate-100 text-slate-600'}`}>
                                {task.subtasks?.length ?? 0} subtasks
                            </div>
                        </div>

                        <UpdateTask 
                            task={task}
                            setFeautures={setFeautures}
                            isUpdating={isUpdating}
                            updatingFeautures={updatingFeautures}
                        />
                        
                    </div>
                ))}
            </div>
        </div>
    );
};