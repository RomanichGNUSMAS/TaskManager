import React, { useMemo, useState } from "react";
import { useThemeStyles } from "../../../hooks/useThemeStyles";
import { ChevronLeft, ChevronRight, CalendarDays, Plus } from "lucide-react";
import { SelectedDayEvents } from "./components/selectedDayEvent";
import { CreateModal } from "./components/createModal";
import { UpcomingEvents } from "./components/upcomingEvent";
import { useGetAllEventsQuery } from "../dashboardApi";
import { useGetMeQuery } from "../../auth/authApi";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const monthName = (monthIndex: number) =>
    new Date(0, monthIndex).toLocaleString("default", { month: "long" });

const buildCalendar = (year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [] as Array<{ value: number; currentMonth: boolean }>;

    for (let i = firstDayOfMonth - 1; i >= 0; i -= 1) {
        days.push({ value: prevMonthDays - i, currentMonth: false });
    }

    for (let day = 1; day <= totalDays; day += 1) {
        days.push({ value: day, currentMonth: true });
    }

    while (days.length % 7 !== 0) {
        days.push({ value: days.length - totalDays - firstDayOfMonth + 1, currentMonth: false });
    }

    return days;
};

export const Calendar: React.FC = () => {

    const { data } = useGetAllEventsQuery()
    const { data: me, isLoading : IsUserLoading } = useGetMeQuery(); 
    const { card, text, bg, border, isDark } = useThemeStyles();
    const today = new Date();
    const eventDateKeys = useMemo(() => {
        return new Set(
            (data ?? [])
                .map(event => event.date)
                .filter(Boolean)
                .map(date => {
                    const parsedDate = new Date(date);
                    return `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`;
                })
        );
    }, [data]);
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, selectDate] = useState(today);
    const [isAdding, setAddState] = useState(false);

    const days = useMemo(
        () => buildCalendar(viewDate.getFullYear(), viewDate.getMonth()),
        [viewDate],
    );

    if(IsUserLoading) return <p>Loading...</p>

    const currentMonthLabel = `${monthName(viewDate.getMonth())} ${viewDate.getFullYear()}`;

    const isToday = (dayValue: number, currentMonth: boolean) =>
        currentMonth &&
        dayValue === today.getDate() &&
        viewDate.getMonth() === today.getMonth() &&
        viewDate.getFullYear() === today.getFullYear();

    const isSelected = (dayValue: number, currentMonth: boolean) =>
        currentMonth &&
        selectedDate.getDate() === dayValue &&
        selectedDate.getMonth() === viewDate.getMonth() &&
        selectedDate.getFullYear() === viewDate.getFullYear();

    const getDateKey = (dayValue: number, currentMonth: boolean) => {
        if (!currentMonth) return "";
        return `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-${String(dayValue).padStart(2, "0")}`;
    };

    const dayCellHover = isDark ? "hover:bg-slate-800/70" : "hover:bg-slate-50";

    return data && me && (
        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
            <CreateModal isOpen={isAdding} onClose={() => setAddState(false)} onSubmit={() => undefined} />

            <div className={`${card} p-5 sm:p-6`}>
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`rounded-2xl p-2.5 ${isDark ? "bg-cyan-500/15" : "bg-cyan-500/10"} text-cyan-500`}>
                            <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold leading-tight ${text.primary}`}>Calendar</h3>
                            <p className={`text-sm ${text.secondary}`}>Monthly view</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {me.role !== 'DEVELOPER' && <button
                            type="button"
                            onClick={() => setAddState(true)}
                            className={`flex cursor-pointer items-center gap-1.5 rounded-2xl bg-cyan-500 px-3.5 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-cyan-600 active:scale-95`}
                        >
                            <Plus className="h-4 w-4" />
                            Add Event
                        </button>}

                        <div className={`flex items-center gap-1 rounded-2xl border p-1 ${border.primary}`}>
                            <button
                                type="button"
                                onClick={() => setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                                className={`cursor-pointer rounded-xl p-2 transition-all duration-150 ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"} active:scale-95`}
                                aria-label="Previous month"
                            >
                                <ChevronLeft className={`h-4 w-4 ${text.secondary}`} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                                className={`cursor-pointer rounded-xl p-2 transition-all duration-150 ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"} active:scale-95`}
                                aria-label="Next month"
                            >
                                <ChevronRight className={`h-4 w-4 ${text.secondary}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Month grid */}
                <div className={`mt-6 rounded-[20px] border p-4 sm:p-5 ${border.secondary} ${bg.secondary}`}>
                    <div className={`flex items-center justify-between border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                        <span className={`text-base font-semibold ${text.primary}`}>{currentMonthLabel}</span>
                        <span className={`text-sm ${text.secondary}`}>
                            Today: {today.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                    </div>

                    <div className={`mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-[0.18em] ${text.secondary}`}>
                        {weekDays.map(day => (
                            <div key={day} className="py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 grid grid-cols-7 gap-1.5">
                        {days.map((day, index) => {
                            const today_ = isToday(day.value, day.currentMonth);
                            const selected = isSelected(day.value, day.currentMonth);
                            const hasEvent = day.currentMonth && eventDateKeys.has(getDateKey(day.value, day.currentMonth));

                            let cellClasses = `relative flex aspect-square items-center justify-center rounded-2xl border text-sm transition-all duration-150 `;

                            if (!day.currentMonth) {
                                cellClasses += isDark
                                    ? "border-transparent text-slate-600"
                                    : "border-transparent text-slate-300";
                            } else if (selected) {
                                cellClasses += isDark
                                    ? "cursor-pointer border-cyan-500 bg-cyan-500/25 font-semibold text-cyan-300 shadow-sm shadow-cyan-500/20"
                                    : "cursor-pointer border-cyan-500 bg-cyan-500/20 font-semibold text-cyan-700 shadow-sm shadow-cyan-500/15";
                            } else if (today_) {
                                cellClasses += isDark
                                    ? `cursor-pointer border-cyan-500/60 bg-cyan-500/10 font-semibold text-cyan-400 ${dayCellHover}`
                                    : `cursor-pointer border-cyan-500/60 bg-cyan-500/10 font-semibold text-cyan-600 ${dayCellHover}`;
                            } else {
                                cellClasses += isDark
                                    ? `cursor-pointer border-slate-800 bg-slate-900/40 ${text.primary} ${dayCellHover}`
                                    : `cursor-pointer border-slate-200 bg-white ${text.primary} ${dayCellHover}`;
                            }

                            return (
                                <div
                                    onClick={() => {
                                        if (!day.currentMonth) return;
                                        selectDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day.value));
                                    }}
                                    key={`${day.value}-${index}`}
                                    className={cellClasses}
                                >
                                    <span>{day.value}</span>
                                    {hasEvent && <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500" />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className={card}>
                    <SelectedDayEvents date={selectedDate} />
                </div>
                <div className={card}>
                    <UpcomingEvents events={data!}/>
                </div>
            </div>
        </div>
    );
};