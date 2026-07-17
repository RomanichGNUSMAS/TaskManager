import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User } from "../types/types";

const navItem = (to: string, isDark: boolean, collapsed?: boolean) => ({ isActive }: { isActive: boolean }) => {

    const activeClass = isActive
        ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
        : isDark
            ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
            : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
    const spacing = collapsed ? 'p-0 m-0' : 'px-4 py-2.5'

    return `flex items-center gap-2 rounded-2xl text-sm font-medium transition ${spacing} ${activeClass} ${collapsed ? 'justify-center' : ''}`
}

export const Navigation: React.FC<{ isDark: boolean, data: User, collapsed: boolean }> = ({ isDark, data, collapsed }) => {
    const nav = useNavigate()

    return (
        <nav className={`flex-1 overflow-y-auto px-3 py-4 space-y-1`}>
            {!collapsed && <p className={`mb-2 px-3 text-[10px] uppercase tracking-[0.28em] ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>Navigation</p> }

            {(data.role === 'TEAMLEAD' || data.role === 'GOD') && (
                <NavLink className={navItem('/dashboard', isDark)} to="/dashboard">
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                    {!collapsed && 'Dashboard'}
                </NavLink>
            )}

            <NavLink className={navItem('/tasks', isDark)} to="/tasks">
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
                {!collapsed && 'Tasks'}
            </NavLink>

            <NavLink className={navItem('/projects', isDark)} to="/projects">
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
                {!collapsed && 'Projects'}
            </NavLink>

            <NavLink className={navItem('/calendar', isDark)} to="/calendar">
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                {!collapsed && 'Calendar'}
            </NavLink>

            {(data.role === 'TEAMLEAD' || data.role === 'GOD') && (
                <NavLink className={navItem('/progress', isDark)} to="/progress">
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                    {!collapsed && 'Analytics'}
                </NavLink>
            )}

            <NavLink className={navItem('/settings', isDark)} to="/settings">
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
                {!collapsed && 'Settings'} 
           </NavLink>

            <button
                onClick={() => {
                    localStorage.removeItem('token');
                    nav('/auth/signin')
                }}
                className={`w-full rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${isDark ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
            >
                Log Out
            </button>
            {(data.role === 'GOD') && <div className={`pt-2 mt-2 ${isDark ? 'border-slate-800/60' : 'border-slate-200/60'}`} style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: isDark ? 'rgba(71, 85, 105, 0.6)' : 'rgba(203, 213, 225, 0.6)' }}>
                <p className={`mb-2 px-3 text-[10px] uppercase tracking-[0.28em] ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>Admin</p>
                <NavLink className={navItem('/auth/signup', isDark)} to="/auth/signup">
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                    {!collapsed && 'Create User'}
                </NavLink>
            </div>}
        </nav>
    )
}