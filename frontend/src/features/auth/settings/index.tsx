import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useGetMeQuery } from "../authApi";
import { User } from "../../../types/types";
import { useThemeStyles } from "../../../hooks/useThemeStyles";

export const Settings:React.FC = () => {
    const { data } = useGetMeQuery();
    const { card, isDark } = useThemeStyles();

    const navItem = (to: string) => ({ isActive }: { isActive: boolean }) => {
      const activeStyle = isActive ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900';
      return `flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${activeStyle}`;
    };

    return data && (
        <div className="flex flex-col gap-6">
            <nav className={`flex flex-wrap gap-2 rounded-[28px] p-4 shadow-xl backdrop-blur-lg ${card}`}>
                <NavLink className={navItem('/settings/profile')} to="/settings/profile">
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    Profile
                </NavLink>
                <NavLink className={navItem('/settings/appearance')} to="/settings/appearance">
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6m0 0v6"/></svg>
                    Appearance
                </NavLink>
                <NavLink className={navItem('/settings/security')} to="/settings/security">
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Security
                </NavLink>
            </nav>

            <div>
                <Outlet context={{user:data as User}}/>
            </div>
        </div>
    )
}