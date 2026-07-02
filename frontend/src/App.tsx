import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useGetMeQuery } from "./features/auth/authApi"
import { useEffect, useState } from "react"
import { useGetProjectsQuery } from "./features/dashboard/dashboardApi"

const navItem = (to: string, isDark: boolean) => ({ isActive }: { isActive: boolean }) => {
  if (isDark) {
    return `flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
  }
  return `flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`
}

export const App = () => {
  const token = localStorage.getItem('token')
  const nav = useNavigate()
  const { isFetching, data, isError, error } = useGetMeQuery();
  const projects = useGetProjectsQuery().data;
  const [notificationsOpen, setNotificationsOpen] = useState(true);
  
  // Determine isDark based on appearance setting
  let isDark = false;
  if (data?.settings.appearance === 'dark') {
    isDark = true;
  } else if (data?.settings.appearance === 'light') {
    isDark = false;
  } else if (data?.settings.appearance === 'system' || !data?.settings.appearance) {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

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
      <div className="fixed right-4 top-4 z-[999]">
        <div className={`overflow-hidden rounded-[28px] border shadow-2xl transition-all duration-300 ${notificationsOpen ? 'w-[320px]' : 'w-16'} ${isDark ? 'border-slate-700 bg-slate-900 text-white shadow-slate-950/30' : 'border-slate-200 bg-white text-slate-900 shadow-slate-200/40'}`}>
          <div className="flex items-center justify-between gap-3 p-3 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <svg onClick={() => setNotificationsOpen(open => !open)} viewBox="0 0 24 24" className={`h-5 w-5 ${isDark ? 'text-cyan-400' : 'text-cyan-500'}`} fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0h6z" />
                </svg>
              </div>
              {notificationsOpen ? (
                <div className="min-w-0">
                  <p className={`text-[10px] uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Notification</p>
                  <p className={`mt-2 text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    New alerts will appear here when backend notifications are available.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* ── LEFT SIDEBAR ── 20% ──────────────────────────────── */}
      <aside className={`sticky top-0 flex h-screen w-[20%] min-w-[220px] flex-col backdrop-blur-sm ${isDark ? 'border-slate-800/70 bg-slate-950/90' : 'border-slate-200/70 bg-white/90'}`} style={{ borderRightWidth: '1px', borderRightStyle: 'solid', borderRightColor: isDark ? 'rgba(71, 85, 105, 0.7)' : 'rgba(203, 213, 225, 0.7)' }}>

        {/* Brand */}
        <div className={`flex items-center gap-3 px-5 py-5 ${isDark ? 'border-slate-800/60' : 'border-slate-200/60'}`} style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: isDark ? 'rgba(71, 85, 105, 0.6)' : 'rgba(203, 213, 225, 0.6)' }}>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-slate-950 shadow-lg shadow-cyan-500/20">
            <span className="text-sm font-bold">T</span>
          </div>
          <div className="min-w-0">
            <p className={`text-[10px] uppercase tracking-[0.3em] truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>TaskFlow</p>
            <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Dashboard</p>
          </div>
        </div>

        {/* User card */}
        <div className={`px-4 py-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200/60'}`} style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: isDark ? 'rgba(71, 85, 105, 0.6)' : 'rgba(203, 213, 225, 0.6)' }}>
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 shrink-0 rounded-2xl p-2 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div className="h-full w-full rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500" />
            </div>
            <div className="min-w-0">
              <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Signed in as</p>
              <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.name || data.email}</p>
            </div>
          </div>
          <div className={`mt-3 rounded-2xl px-3 py-2.5 text-xs space-y-1.5 ${isDark ? 'bg-slate-900/80 text-slate-400' : 'bg-slate-100/80 text-slate-600'}`}>
            <div className="flex justify-between"><span>Role</span><span className={isDark ? 'text-slate-200' : 'text-slate-900'}>{data.role}</span></div>
            <div className="flex justify-between"><span>Team</span><span className={isDark ? 'text-slate-200' : 'text-slate-900'}>Product</span></div>
            <div className="flex justify-between"><span>Status</span><span className="text-emerald-400">● Active</span></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto px-3 py-4 space-y-1`}>
          <p className={`mb-2 px-3 text-[10px] uppercase tracking-[0.28em] ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>Navigation</p>

          {(data.role === 'TEAMLEAD' || data.role === 'GOD') && (
            <NavLink className={navItem('/dashboard', isDark)} to="/dashboard">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              Dashboard
            </NavLink>
          )}

          <NavLink className={navItem('/tasks', isDark)} to="/tasks">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            Tasks
          </NavLink>

          <NavLink className={navItem('/projects', isDark)} to="/projects">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
            Projects
          </NavLink>

          <NavLink className={navItem('/calendar', isDark)} to="/calendar">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Calendar
          </NavLink>

          {(data.role === 'TEAMLEAD' || data.role === 'GOD') && (
            <NavLink className={navItem('/progress', isDark)} to="/progress">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
              Analytics
            </NavLink>
          )}

          <NavLink className={navItem('/settings', isDark)} to="/settings">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            Settings
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
          <div className={`pt-2 mt-2 ${isDark ? 'border-slate-800/60' : 'border-slate-200/60'}`} style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: isDark ? 'rgba(71, 85, 105, 0.6)' : 'rgba(203, 213, 225, 0.6)' }}>
            <p className={`mb-2 px-3 text-[10px] uppercase tracking-[0.28em] ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>Admin</p>
            <NavLink className={navItem('/auth/signup', isDark)} to="/auth/signup">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              Create User
            </NavLink>
          </div>
        </nav>

        {/* Quick metrics pinned to bottom */}
        <div className={`px-4 py-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200/60'}`} style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: isDark ? 'rgba(71, 85, 105, 0.6)' : 'rgba(203, 213, 225, 0.6)' }}>
          <p className={`mb-3 text-[10px] uppercase tracking-[0.28em] ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>Quick Metrics</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Tasks', value: projects.projects.reduce((t,a) => t + a.tasksCount,0) },
              { label: 'Projects', value: projects.projects.length },
              { label: 'Due Soon', value: projects.projects.reduce((t,a) => {
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
        </div>
      </aside>

      {/* ── MAIN OUTLET ── 80% ──────────────────────────────── */}
      <main className="flex-1 w-[80%] overflow-y-auto">
        <div className="mx-auto max-w-full px-6 py-8">
          <div className={`rounded-[32px] p-6 shadow-xl backdrop-blur-lg min-h-[calc(100vh-4rem)] ${isDark ? 'border-slate-800/70 bg-slate-900/80 shadow-slate-950/20' : 'border-slate-200/70 bg-white/80 shadow-slate-100/20'}`}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}