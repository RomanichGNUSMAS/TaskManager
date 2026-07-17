import React from "react";
import { useThemeStyles } from "../hooks/useThemeStyles";
import { Project } from "../types/types";

export const QuickMetrics:React.FC<{projects: Project[], collapsed: boolean }> = ({ projects, collapsed }) => {
    const { isDark } = useThemeStyles();

    return (
        <div className={`px-4 py-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200/60'}`} style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: isDark ? 'rgba(71, 85, 105, 0.6)' : 'rgba(203, 213, 225, 0.6)' }}>
          {!collapsed && (
            <>
              <p className={`mb-3 text-[10px] uppercase tracking-[0.28em] ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>Quick Metrics</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Tasks', value: projects.reduce((t,a) => t + a.tasksCount,0) },
                  { label: 'Projects', value: projects.length },
                  { label: 'Due Soon', value: projects.reduce((t,a) => {
                    if(a.state == 'on_hold') return t + 1
                    return t;
                  },0) },
                ].map(item => (
                  <div key={item.label} className={`rounded-2xl px-2 py-2.5 text-center ${isDark ? 'bg-slate-900/80' : 'bg-slate-100/80'}`}>
                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</p>
                    <p className={`text-[9px] uppercase tracking-wide mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {collapsed && (
            <div className={`rounded-2xl py-2.5 text-center ${isDark ? 'bg-slate-900/80' : 'bg-slate-100/80'}`}>
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {projects.reduce((t,a) => t + a.tasksCount,0)}
              </p>
            </div>
          )}
        </div>
    )
}