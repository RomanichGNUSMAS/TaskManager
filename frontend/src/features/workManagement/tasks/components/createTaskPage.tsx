import React, { Dispatch, useState } from "react";
import { Project, Task, User } from "../../../../types/types";

type Props = {
    setForm:Dispatch<Partial<Task>>
    form:Partial<Task>,
    projects:Project[],
    developers:User[]
}

export const CreateTaskPage:React.FC<Props> = ({ setForm,form,developers,projects }) => {
    const [subtaskTitle, setSubtaskTitle] = useState('')
    
        const priorityOptions = [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
            { label: 'Urgent', value: 'urgent' }
        ]
    return (
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20"
                            placeholder="Task title"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Project</label>
                            <select
                                value={form.projectId}
                                onChange={e => setForm({ ...form, projectId: e.target.value })}
                                className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20"
                            >
                                <option value="" disabled>Select project</option>
                                {projects.map(project => (
                                    <option key={project._id} value={project._id}>{project.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Priority</label>
                            <div className="flex flex-wrap gap-2">
                                {priorityOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, priority: option.value as 'low'})}
                                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${form.priority === option.value ? 'border-cyan-500 bg-cyan-500/15 text-cyan-200' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:bg-slate-800'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/80 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-200">Subtasks</p>
                                <p className="text-xs text-slate-500">Add steps to complete this task</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!subtaskTitle.trim()) return
                                    setForm({ ...form, subtasks: [...form.subtasks!, {title:subtaskTitle.trim(),done: false}] })
                                    setSubtaskTitle('')
                                }}
                                className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={subtaskTitle}
                                onChange={e => setSubtaskTitle(e.target.value)}
                                className="flex-1 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20"
                                placeholder="New subtask"
                            />
                        </div>
                        <div className="space-y-2">
                            {form.subtasks!.length ? form.subtasks!.map((subtask, index) => (
                                <div key={`${subtask.title}-${index}`} className="rounded-2xl bg-slate-950/80 px-4 py-3 text-sm text-slate-200">
                                    {subtask.title}
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500">No subtasks yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-200">Developers</p>
                                <p className="text-xs text-slate-500">Select team members</p>
                            </div>
                            <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">{form.userIds!.length} selected</span>
                        </div>
                        <div className="mt-4 space-y-3">
                            {developers.map(developer => {
                                const selected = form.userIds!.includes(developer._id)
                                return (
                                    <button
                                        key={developer._id}
                                        type="button"
                                        onClick={() => setForm({
                                            ...form,
                                            userIds: selected ? form.userIds!.filter(id => id !== developer._id) : [...form.userIds!, developer._id]
                                        })}
                                        className={`flex w-full items-center gap-3 rounded-3xl border px-4 py-3 text-left transition ${selected ? 'border-cyan-500 bg-cyan-500/15 text-cyan-200' : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'}`}
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 text-sm font-semibold text-slate-950">
                                            {developer.name?.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">{developer.name}</p>
                                            <p className="truncate text-xs text-slate-500">{developer.email}</p>
                                        </div>
                                        <span className="ml-auto text-xs uppercase tracking-[0.2em] text-slate-400">{selected ? 'Added' : 'Add'}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-4">
                        <p className="text-sm font-medium text-slate-200">Summary</p>
                        <div className="mt-3 space-y-2 text-sm text-slate-400">
                            <p><span className="font-semibold text-slate-100">Project:</span> {projects.find(project => project._id === form.projectId)?.name ?? 'None'}</p>
                            <p><span className="font-semibold text-slate-100">Priority:</span> {form.priority}</p>
                            <p><span className="font-semibold text-slate-100">Subtasks:</span> {form.subtasks!.length}</p>
                            <p><span className="font-semibold text-slate-100">Team:</span> {form.userIds!.length} selected</p>
                        </div>
                    </div>
                </div>
            </div>
    )
}