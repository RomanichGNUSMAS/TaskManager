import { Outlet, useNavigate } from "react-router-dom"
import { useGetMeQuery } from "./features/auth/authApi"
import { useEffect, useState } from "react"
import { useGetProjectsQuery } from "./features/dashboard/dashboardApi"
import { Notifications } from "./components/notifications"
import { useThemeStyles } from "./hooks/useThemeStyles"
import { Navigation } from "./components/navigations"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { QuickMetrics } from "./components/quickMetrics"
import { UserCard } from "./components/userCard"

export const App = () => {
  const token = localStorage.getItem('token')
  const nav = useNavigate()
  const { isFetching, data, isError, error } = useGetMeQuery();
  const projects = useGetProjectsQuery().data;

  const { isDark } = useThemeStyles();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isFetching) return;

    const is403Error = isError && (error as any)?.status === 403;
    const isCustom403 = data?.statusCode === 403;

    if (!token || is403Error || isCustom403) {
      nav('/auth/signin')
    }
  }, [isFetching, isError, error, data, token, nav])

  if (isFetching) {
    return (
      <div className={`min-h-screen px-4 py-20 text-center ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
        <div className={`inline-flex items-center justify-center gap-4 rounded-[34px] px-8 py-8 shadow-2xl backdrop-blur-sm ${isDark ? 'bg-slate-900/90 shadow-slate-950/30' : 'bg-slate-100/90 shadow-slate-200/30'}`}>
          <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600" />
          <div>
            <p className={`text-sm uppercase tracking-[0.32em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>initializing workspace</p>
            <p className={`mt-3 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Loading your SaaS dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return data && projects && (
    <div className={`flex min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Notifications user={data}/>

      {/* ── LEFT SIDEBAR ── collapsible ──────────────────────────────── */}
      <aside
        className={`sticky top-0 flex h-screen flex-col backdrop-blur-sm transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[72px] min-w-[72px]' : 'w-[20%] min-w-[220px]'
        } ${isDark ? 'border-slate-800/70 bg-slate-950/90' : 'border-slate-200/70 bg-white/90'}`}
        style={{ borderRightWidth: '1px', borderRightStyle: 'solid', borderRightColor: isDark ? 'rgba(71, 85, 105, 0.7)' : 'rgba(203, 213, 225, 0.7)' }}
      >

        {/* Brand + collapse toggle */}
        <div className={`flex items-center gap-3 px-5 py-5 ${collapsed ? 'justify-center px-3' : ''} ${isDark ? 'border-slate-800/60' : 'border-slate-200/60'}`} style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: isDark ? 'rgba(71, 85, 105, 0.6)' : 'rgba(203, 213, 225, 0.6)' }}>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-slate-950 shadow-lg shadow-cyan-500/20">
            <span className="text-sm font-bold">T</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className={`text-[10px] uppercase tracking-[0.3em] truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>TaskFlow</p>
              <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Dashboard</p>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(prev => !prev)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`mx-auto -mb-1 mt-2 grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors ${
            isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* User card */}
        <UserCard data={data} collapsed={collapsed} />

        {/* Navigation */}
        <Navigation data={data} isDark={isDark} collapsed={collapsed} />

        {/* Quick metrics pinned to bottom */}
        <QuickMetrics projects={projects.projects} collapsed={collapsed}/>
      </aside>

      {/* ── MAIN OUTLET ── remaining space ──────────────────────────────── */}
      <main className="flex-1 w-0 overflow-y-auto">
        <div className="mx-auto max-w-full px-6 py-8">
          <div className={`rounded-[32px] p-6 shadow-xl backdrop-blur-lg min-h-[calc(100vh-4rem)] ${isDark ? 'border-slate-800/70 bg-slate-900/80 shadow-slate-950/20' : 'border-slate-200/70 bg-white/80 shadow-slate-100/20'}`}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}