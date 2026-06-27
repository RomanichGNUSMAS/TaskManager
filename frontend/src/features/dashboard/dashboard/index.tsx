import React from "react";
import { useGetProjectsQuery } from "../dashboardApi";

export const Dashboard: React.FC = () => {
    const { data } = useGetProjectsQuery()

    return data && (
        <>
            <div className="rounded-[32px] border border-slate-800/70 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20 backdrop-blur-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Welcome back</p>
                        <h2 className="mt-3 text-3xl font-semibold text-white">Manage your team with clarity</h2>
                    </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {[
                        { label: 'This week', value: '34', accent: 'from-sky-500 to-cyan-400' },
                        { label: 'Completed', value: '18', accent: 'from-emerald-500 to-lime-400' },
                        { label: 'Overdue', value: '3', accent: 'from-rose-500 to-orange-400' }
                    ].map(metric => (
                        <div key={metric.label} className="rounded-3xl bg-slate-950/80 p-5 shadow-sm shadow-slate-950/20">
                            <div className="flex items-center justify-between text-sm text-slate-400">
                                <span>{metric.label}</span>
                                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">view</span>
                            </div>
                            <p className="mt-4 text-4xl font-semibold text-white">{metric.value}</p>
                            <div className={`mt-5 h-2 rounded-full bg-slate-800 bg-gradient-to-r ${metric.accent}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-[32px] border border-slate-800/70 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-lg">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Project agenda</p>
                        <h3 className="text-2xl font-semibold text-white">Active workstreams</h3>
                    </div>
                    <button className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700">View all</button>
                </div>
                <div className="space-y-4">
                    {data.map(item => (
                        <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 transition hover:border-cyan-500/40">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              {/* {  item..map(task =>
                                <>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white">{task.title}</h4>
                                        <p className="text-sm text-slate-400">{task.state} • {task.date}</p>
                                    </div>
                                    <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">{task.progress}</span>
                                </>
                                )
                            } */}
                            </div>
                            <div className="mt-4 h-2 rounded-full bg-slate-800">
                                <div className="h-full w-[72%] rounded-full bg-cyan-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}