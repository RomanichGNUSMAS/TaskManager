import React from "react"
import { User } from "../types/types"
import { useThemeStyles } from "../hooks/useThemeStyles"

export const UserCard:React.FC<{ collapsed : boolean, data : User }> = ({ collapsed, data }) => {
    const { isDark } = useThemeStyles();
    return (
        <div className={`px-4 py-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200/60'}`} style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: isDark ? 'rgba(71, 85, 105, 0.6)' : 'rgba(203, 213, 225, 0.6)' }}>
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className={`h-9 w-9 shrink-0 rounded-2xl p-2 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div className="h-full w-full rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Signed in as</p>
                <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.name || data.email}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className={`mt-3 rounded-2xl px-3 py-2.5 text-xs space-y-1.5 ${isDark ? 'bg-slate-900/80 text-slate-400' : 'bg-slate-100/80 text-slate-600'}`}>
              <div className="flex justify-between"><span>Role</span><span className={isDark ? 'text-slate-200' : 'text-slate-900'}>{data.role}</span></div>
              <div className="flex justify-between"><span>Team</span><span className={isDark ? 'text-slate-200' : 'text-slate-900'}>Product</span></div>
              <div className="flex justify-between"><span>Status</span><span className="text-emerald-400">● Active</span></div>
            </div>
          )}
        </div>
    )
}