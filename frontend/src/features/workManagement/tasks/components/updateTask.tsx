import React, { useState } from "react";
import { useThemeStyles } from "../../../../hooks/useThemeStyles";
import { Task } from "../../../../types/types";


type Feauture = 
    { title: string, priority: string, addedSubtasks: { title: string, done: boolean }[], removedSubtasks: string[], status: string }

type Props = {
    task: Task,
    isUpdating: { idOfChangin: string },
    updatingFeautures: Feauture,
    setFeautures : ( arg : Feauture) => void
}

export const UpdateTask: React.FC<Props> = ({ task,isUpdating,updatingFeautures,setFeautures}) => {
    const { input, isDark, button,text } = useThemeStyles()
    const [addTaskText, setText] = useState('');

    return (
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="space-y-2">
                <p className={`text-sm font-medium ${text.primary}`}>Subtasks</p>
                {isUpdating.idOfChangin == task._id && (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                            type="text"
                            placeholder="new subtask"
                            value={addTaskText}
                            onChange={e => setText(e.target.value)}
                            className={`${input} w-full sm:w-64`}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (addTaskText?.trim()?.length == 0) return;
                                if (updatingFeautures.addedSubtasks.find(t => t.title == addTaskText.trim()) ||
                                    task.subtasks!.find(t => t.title == addTaskText.trim())) return setText('')
                                setFeautures({ ...updatingFeautures, addedSubtasks: [...updatingFeautures.addedSubtasks, { title: addTaskText, done: false }] })
                                setText('')
                            }}
                            className={`${button.primary} px-3 py-2 text-xs`}
                        >
                            Add
                        </button>
                    </div>
                )}
                {task.subtasks && task.subtasks.length > 0 ? (
                    <div className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {task.subtasks.slice(0, 3).map((subtask, index) => !updatingFeautures.removedSubtasks.includes(subtask._id) && (
                            <div
                                key={`${subtask.title}-${index}`}
                                className={`flex items-center gap-2 rounded-2xl px-3 py-2 ${isDark ? 'bg-slate-900/80' : 'bg-slate-100'}`}
                            >
                                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${subtask.done ? 'bg-emerald-400' : isDark ? 'bg-slate-500' : 'bg-slate-400'}`} />
                                <span className={subtask.done ? 'line-through' : ''}>{subtask.title}</span>
                                {isUpdating.idOfChangin == task._id && <button type="button" onClick={() => setFeautures({ ...updatingFeautures, removedSubtasks: [...updatingFeautures.removedSubtasks, subtask._id] })} className={`${button.cancel} px-2.5 py-1 text-xs`}>Delete</button>}
                            </div>
                        ))}
                        {updatingFeautures.addedSubtasks.map((subtask, index) =>
                            <div key={`${subtask.title}-${index}`}
                                className={`flex items-center gap-2 rounded-2xl px-3 py-2 ${isDark ? 'bg-green-900' : 'bg-green-300'}`}
                            >
                                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${subtask.done ? 'bg-emerald-400' : isDark ? 'bg-slate-500' : 'bg-slate-400'}`} />
                                <span className={subtask.done ? 'line-through' : ''}>{subtask.title}</span>
                                {isUpdating.idOfChangin == task._id && <button type="button" onClick={() => setFeautures({ ...updatingFeautures, addedSubtasks: updatingFeautures.addedSubtasks.filter(v => v.title != subtask.title) })} className={`${button.cancel} px-2.5 py-1 text-xs`}>Delete</button>}
                            </div>
                        )}
                        {task.subtasks.length > 3 && (
                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>+{task.subtasks.length - 3} more subtasks</p>
                        )}
                    </div>
                ) : (
                    <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>No subtasks yet</p>
                )}
            </div>
        </div>
    )
}