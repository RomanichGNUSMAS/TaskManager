import React, { Dispatch, useState } from "react";
import { Project, Task, User } from "../../../../types/types";
import { useThemeStyles } from "../../../../hooks/useThemeStyles";

type Props = {
    setForm: Dispatch<Partial<Task>>
    form: Partial<Task>,
    projects: Project[],
    developers: User[]
}

export const CreateTaskPage: React.FC<Props> = ({ setForm, form, developers, projects }) => {
    const { isDark, input, button, text, border, bg } = useThemeStyles();
    const [subtaskTitle, setSubtaskTitle] = useState('')

    const priorityOptions = [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' }
    ]

    const panelClass = `rounded-[28px] border ${isDark ? border.primary : 'border-slate-200'} ${isDark ? bg.secondary : 'bg-white'} p-6 shadow-xl ${isDark ? 'shadow-slate-950/10' : 'shadow-slate-300/30'}`;
    const panelCardClass = `rounded-[28px] border ${isDark ? border.primary : 'border-slate-200'} ${isDark ? bg.secondary : 'bg-slate-50'} p-6 shadow-lg ${isDark ? 'shadow-slate-950/10' : 'shadow-slate-300/20'}`;
    const prioritySelectedClass = isDark ? 'border-blue-500 bg-blue-500/15 text-blue-100' : 'border-blue-900 bg-blue-100 text-slate-950';
    const priorityDefaultClass = isDark ? `${border.secondary} ${text.secondary} bg-transparent ${bg.hoverDark}` : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100';
    const developerDefaultClass = isDark ? `${border.secondary} ${text.secondary} bg-transparent ${bg.hoverDark}` : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100';
    const developerSelectedClass = isDark
        ? 'border-blue-500 bg-blue-500/15 text-blue-100'
        : 'border-blue-900 bg-blue-100 text-slate-950';

    return (
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
                <div className={`space-y-4 ${panelClass}`}>
                    <div>
                        <p className={`text-sm font-medium ${text.secondary}`}>Task details</p>
                        <h2 className={`mt-2 text-xl font-semibold ${text.primary}`}>Create a new task</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${text.secondary}`}>Title</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                className={`${input} w-full ${isDark ? '' : 'bg-white'}`}
                                placeholder="Task title"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className={`block text-sm font-medium ${text.secondary}`}>Project</label>
                                <div className="relative">
                                    <select
                                        value={form.projectId}
                                        onChange={e => setForm({ ...form, projectId: e.target.value })}
                                        className={`${input} w-full appearance-none pr-10 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
                                    >
                                        <option value="" disabled hidden>Select project</option>
                                        {projects.map(project => (
                                            <option
                                                key={project._id}
                                                value={project._id}
                                                className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}
                                            >
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                    <span className={`pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        ▾
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={`block text-sm font-medium ${text.secondary}`}>Priority</label>
                                <div className="flex flex-wrap gap-2">
                                    {priorityOptions.map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setForm({ ...form, priority: option.value as 'low' })}
                                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${form.priority === option.value ? prioritySelectedClass : priorityDefaultClass}`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`space-y-4 ${panelCardClass}`}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className={`text-sm font-medium ${text.secondary}`}>Subtasks</p>
                            <p className={`text-xs ${text.tertiary}`}>Add steps to complete this task</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                if (!subtaskTitle.trim()) return
                                setForm({ ...form, subtasks: [...form.subtasks ?? [], { title: subtaskTitle.trim(), done: false }] })
                                setSubtaskTitle('')
                            }}
                            className={button.primary}
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={subtaskTitle}
                            onChange={e => setSubtaskTitle(e.target.value)}
                            className={`${input} flex-1 ${isDark ? '' : 'bg-white'}`}
                            placeholder="New subtask"
                        />
                    </div>
                    <div className="space-y-3">
                        {form.subtasks?.length ? form.subtasks.map((subtask, index) => (
                            <div key={`${subtask.title}-${index}`} className={`rounded-3xl ${isDark ? bg.secondary : 'bg-slate-50'} border ${isDark ? border.secondary : 'border-slate-200'} p-4 text-sm ${text.secondary}`}>
                                {subtask.title}
                            </div>
                        )) : (
                            <p className={`text-sm ${text.tertiary}`}>No subtasks yet.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className={panelCardClass}>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className={`text-sm font-medium ${text.secondary}`}>Developers</p>
                                <p className={`text-xs ${text.tertiary}`}>Select team members</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${text.tertiary} ${isDark ? bg.secondary : 'bg-slate-100'}`}>
                                {form.userIds?.length ?? 0} selected
                            </span>
                        </div>
                        <div className="mt-4 space-y-3">
                            {developers.map(developer => {
                                const selected = form.userIds?.includes(developer._id);
                                return (
                                    <button
                                        key={developer._id}
                                        type="button"
                                        onClick={() => setForm({
                                            ...form,
                                            userIds: selected ? form.userIds!.filter(id => id !== developer._id) : [...(form.userIds ?? []), developer._id]
                                        })}
                                        className={`flex w-full items-center gap-3 rounded-[24px] border px-4 py-3 text-left transition ${selected ? developerSelectedClass : developerDefaultClass}`}
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-sm font-semibold text-white">
                                            {developer.name?.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{developer.name}</p>
                                            <p className="truncate text-xs text-slate-500">{developer.email}</p>
                                        </div>
                                        <span className={`ml-auto text-xs uppercase tracking-[0.2em] ${text.tertiary}`}>{selected ? 'Added' : 'Add'}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className={panelClass}>
                    <p className={`text-sm font-medium ${text.secondary}`}>Summary</p>
                    <div className={`mt-4 space-y-3 text-sm ${text.secondary}`}>
                        <p><span className={`font-semibold ${text.primary}`}>Project:</span> {projects.find(project => project._id === form.projectId)?.name ?? 'None'}</p>
                        <p><span className={`font-semibold ${text.primary}`}>Priority:</span> {form.priority}</p>
                        <p><span className={`font-semibold ${text.primary}`}>Subtasks:</span> {form.subtasks?.length ?? 0}</p>
                        <p><span className={`font-semibold ${text.primary}`}>Team:</span> {form.userIds?.length ?? 0} selected</p>
                    </div>
                </div>
            </div>
        </div>
    )
}