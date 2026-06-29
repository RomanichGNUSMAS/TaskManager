import React from "react";
import { useGetProjectsQuery } from "../dashboardApi";
import { useThemeStyles } from "../../../hooks/useThemeStyles";
import { Link } from "react-router-dom";

function getDaysAgo(pastDate:Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(pastDate);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffInMs = today.getTime() - targetDate.getTime();
  
  const msInDay = 24 * 60 * 60 * 1000;
  
  return Math.round(diffInMs / msInDay);
}



export const Dashboard: React.FC = () => {
    const { data } = useGetProjectsQuery()
    const { card, text, isDark } = useThemeStyles()

    return data && (
        <>
            <div className={card}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className={`text-xs uppercase tracking-[0.3em] ${isDark ? 'text-cyan-300/80' : 'text-cyan-600/80'}`}>Welcome back</p>
                        <h2 className={`mt-3 text-3xl font-semibold ${text.primary}`}>Manage your team with clarity</h2>
                    </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {[
                        { label: 'This week', value: data.projects.filter(t => getDaysAgo(t.createdAt) <= 7).length, accent: 'from-sky-500 to-cyan-400' },
                        { label: 'Completed', value: data.projects.filter(t => t.state == 'completetd').length, accent: 'from-emerald-500 to-lime-400' },
                        { label: 'Active', value: data.totalActive, accent: 'from-rose-500 to-orange-400' }
                    ].map(metric => (
                        <div key={metric.label} className={`rounded-3xl ${isDark ? 'bg-slate-950/80 shadow-sm shadow-slate-950/20' : 'bg-slate-100/80 shadow-sm shadow-slate-200/20'} p-5`}>
                            <div className={`flex items-center justify-between text-sm ${text.secondary}`}>
                                <span>{metric.label}</span>
                                <span className={`rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'} px-3 py-1 text-xs ${text.secondary}`}>view</span>
                            </div>
                            <p className={`mt-4 text-4xl font-semibold ${text.primary}`}>{metric.value}</p>
                            <div className={`mt-5 h-2 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'} bg-gradient-to-r ${metric.accent}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className={card}>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className={`text-xs uppercase tracking-[0.3em] ${text.secondary}`}>Project agenda</p>
                        <h3 className={`text-2xl font-semibold ${text.primary}`}>Active workstreams</h3>
                    </div>
                    <Link to="/projects" className={`rounded-full ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'} px-4 py-2 text-sm font-medium transition`}>View all</Link>
                </div>
                <div className="space-y-4">
                    {data.projects.map(item => item.state == 'active' && (
                        <div key={item.name} className={`rounded-3xl ${isDark ? 'border-slate-800 bg-slate-950/80 hover:border-cyan-500/40' : 'border-slate-200 bg-slate-100/80 hover:border-cyan-500/40'} border p-4 transition`}>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <h4 className={`text-lg font-semibold ${text.primary}`}>{item.name}</h4>
                                <p className={`text-sm ${text.secondary}`}>Project • Active</p>
                              </div>
                            </div>
                            <div className={`mt-4 h-2 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                <div className="h-full w-[72%] rounded-full bg-cyan-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}