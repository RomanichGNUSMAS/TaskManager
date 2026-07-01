import React, { useState } from "react";
import { useThemeStyles } from "../../../hooks/useThemeStyles";
import { useGetProjectsQuery } from "../../dashboard/dashboardApi";
import { ProjectTasks } from "./components/projectTasks";
import { CreateTask } from "./components/createTask";
import { useGetMeQuery } from "../../auth/authApi";

export const Tasks: React.FC = () => {
    const { card, isDark, text, border, bg } = useThemeStyles();
    const { data: me } = useGetMeQuery()
    const { data, isLoading } = useGetProjectsQuery();
    const [isCreating, setCreateState] = useState(false);

    if (isLoading || !me) return <div className={card}>Loading...</div>;
    const compare = data!.projects.reduce((t, a) => t + a.tasksCount, 0) == 0;

    const mainCardClass = isDark
        ? 'rounded-[32px] border border-slate-800/70 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/10'
        : 'rounded-[32px] border border-blue-200 bg-blue-50 p-8 shadow-2xl shadow-blue-200/30';
    
    const createFormClass = isDark
        ? 'rounded-[28px] border border-slate-800/70 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20'
        : 'rounded-[28px] border border-blue-200 bg-white p-6 shadow-xl shadow-blue-200/20';

    if (compare) return <div className={mainCardClass}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className={`text-sm uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-blue-600'}`}>Task manager</p>
                <h1 className={`mt-2 text-3xl font-semibold ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>No tasks found</h1>
                <p className={`mt-3 max-w-2xl text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>There are no tasks assigned to your projects yet. Create a new task to get started and keep your team moving.</p>
            </div>
            {(me.role == 'GOD' || me.role == 'TEAMLEAD') && !isCreating && (
                <button
                    onClick={() => setCreateState(true)}
                    className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                    Create new task
                </button>
            )}
        </div>

        {isCreating && (
            <div className={`mt-8 ${createFormClass}`}>
                <CreateTask projects={data!.projects} createState={setCreateState} />
            </div>
        )}
    </div>;

    return data && me && (
        <div className={mainCardClass}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className={`text-sm uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-blue-600'}`}>Tasks overview</p>
                    <h1 className={`mt-2 text-3xl font-semibold ${isDark ? 'text-slate-100' : 'text-blue-900'}`}>Projects & tasks</h1>
                </div>
                {(me.role == 'GOD' || me.role == 'TEAMLEAD') && (
                    <button
                        onClick={() => setCreateState(true)}
                        className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                        Create new task
                    </button>
                )}
            </div>

            {isCreating ? (
                <div className={`mt-8 ${createFormClass}`}>
                    <CreateTask projects={data.projects} createState={setCreateState} />
                </div>
            ) : (
                <div className="mt-8 grid gap-6">
                    {data.projects.map((project: any) => (
                        <ProjectTasks
                            key={project._id}
                            projectId={project._id}
                            projectName={project.title}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};