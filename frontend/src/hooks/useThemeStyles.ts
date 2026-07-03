import { useGetMeQuery } from "../features/auth/authApi";

export const useThemeStyles = () => {
  const { data } = useGetMeQuery();
  
  let isDark = false;
  if (data?.settings.appearance === 'dark') {
    isDark = true;
  } else if (data?.settings.appearance === 'light') {
    isDark = false;
  } else if (data?.settings.appearance === 'system' || !data?.settings.appearance) {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return {
    isDark,
    // Background colors
    bg: {
      primary: isDark ? "bg-slate-950" : "bg-white",
      secondary: isDark ? "bg-slate-900/80" : "bg-slate-50",
      tertiary: isDark ? "bg-slate-800" : "bg-slate-100",
      hoverLight: isDark ? "hover:bg-slate-800" : "hover:bg-slate-100",
      hoverDark: isDark ? "hover:bg-slate-700" : "hover:bg-slate-200",
    },
    // Text colors
    text: {
      primary: isDark ? "text-white" : "text-slate-900",
      secondary: isDark ? "text-slate-400" : "text-slate-600",
      tertiary: isDark ? "text-slate-500" : "text-slate-500",
    },
    // Border colors
    border: {
      primary: isDark ? "border-slate-800/70" : "border-slate-200/70",
      secondary: isDark ? "border-slate-800/60" : "border-slate-200/60",
    },
    // Card styles
    card: isDark
      ? "rounded-[24px] border border-slate-800/70 bg-slate-900/80 shadow-lg shadow-slate-950/20 p-6"
      : "rounded-[24px] border border-slate-200/70 bg-white/80 shadow-lg shadow-slate-200/20 p-6",
    // Form input
    input: isDark
      ? "rounded-2xl border border-slate-800/70 bg-slate-800/50 px-4 py-2.5 text-white focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
      : "rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
    // Buttons
    button: {
      primary: "rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-400 shadow-lg shadow-cyan-500/20",
      secondary: isDark
        ? "rounded-2xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
        : "rounded-2xl bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-300",
      danger: "rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500",
      save: "rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20",
      cancel: isDark
        ? "rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20"
        : "rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-500/20",
    },
  };
};
