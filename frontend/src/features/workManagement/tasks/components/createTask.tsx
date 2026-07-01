import React, { useState } from "react";
import { Project, Task } from "../../../../types/types";
import { useGetUsersByRoleQuery } from "../../../auth/authApi";
import { useAddTaskMutation } from "../../workManagementApi";
import { CreateTaskPage } from "./createTaskPage";

type Props = {
    projects: Project[],
    createState: (arg: boolean) => void
}

export const CreateTask: React.FC<Props> = ({ projects, createState }) => {
    const { data: developers } = useGetUsersByRoleQuery({ role: 'DEVELOPER' })
    const [createTask] = useAddTaskMutation()
    const [error, setError] = useState('')

    const [form, setForm] = useState<Partial<Task>>({
        title: '',
        userIds: [] as string[],
        projectId: '',
        subtasks: [] as {title:string,done:boolean}[],
        priority: 'low' as const
    })
    const handleCreateTask = () => {
        let str = '';
        if(!form.title?.trim()) str += 'title required!?';
        if(form.userIds!.length < 1) str += 'users required!?'
        if(!form.projectId?.trim()) str += 'project required!?'
        if(str) return setError(str);
        setError('');
        void createTask({ task:{...form,status:'todo' } as Task, token:localStorage.getItem('token')! })
            .unwrap()
            .catch(console.error)
            .finally(() => createState(false))
    }

    return developers && (
        <div className="w-full max-w-4xl rounded-[32px] border border-slate-800/70 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-lg text-slate-100">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">New task</p>
                    <h2 className="text-2xl font-semibold">Create task</h2>
                </div>
                <button
                    type="button"
                    onClick={() => createState(false)}
                    className="rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
                >
                    Cancel
                </button>
            </div>
            {error && (
                <div className="mb-5 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-200">
                            !
                        </div>
                        <div>
                            <p className="font-semibold text-rose-100">Action required</p>
                            {error.split('?').map(t => 
                                <p className="text-rose-200" key={t}>
                                    {t}
                                </p>
                            
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <CreateTaskPage setForm={setForm} form={form} projects={projects} developers={developers}/>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={() => createState(false)}
                    className="rounded-full border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-800"
                >
                    Cancel
                </button>
                <button
                    onClick={handleCreateTask}
                    type="button"
                    className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                    Create task
                </button>
            </div>
        </div>
    )
}