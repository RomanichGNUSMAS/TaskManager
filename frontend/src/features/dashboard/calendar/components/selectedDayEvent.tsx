import React from "react";
import { useGetEventByDayQuery } from "../../dashboardApi";
import { useThemeStyles } from "../../../../hooks/useThemeStyles";

export const SelectedDayEvents: React.FC<{ date: Date }> = ({ date }) => {
    const { data, isLoading } = useGetEventByDayQuery({ date:date.toISOString() });
    const { card, text, border, bg } = useThemeStyles();

    if (isLoading) {
        return <p className={`text-sm ${text.secondary}`}>Loading...</p>;
    }

    if (!data || data.length === 0) {
        return (
            <div className={`${card} border-dashed ${border.primary}`}>
                <h3 className={`text-lg font-semibold ${text.primary}`}>Events for</h3>
                <p className={`mt-2 text-sm ${text.secondary}`}>{date.toDateString().split('.')[0]}</p>
                <p className={`mt-4 rounded-3xl ${bg.secondary} px-4 py-3 text-sm ${text.secondary}`}>
                    No events scheduled for this day.
                </p>
            </div>
        );
    }

    return (
        <div className={card}>
            <div className="flex flex-col gap-2">
                <div>
                    <h3 className={`text-lg font-semibold ${text.primary}`}>Events for</h3>
                    <p className={`text-sm ${text.secondary}`}>{date.toDateString()}</p>
                </div>
                <div className="space-y-4">
                    {data.map(event => (
                        <article key={event._id ?? event.title} className={`rounded-[20px] border ${border.primary} ${bg.secondary} p-4 transition hover:shadow-lg hover:shadow-cyan-500/10`}>
                            <div className="flex items-center justify-between gap-3">
                                <h4 className={`text-base font-semibold ${text.primary}`}>{event.title}</h4>
                                <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${text.secondary} ${bg.tertiary}`}>
                                    {event.eventType}
                                </span>
                            </div>
                            <p className={`mt-2 text-sm ${text.secondary}`}>{event.location}</p>
                            {event.link && (
                                <a href={event.link} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-cyan-500 hover:text-cyan-400">
                                    {event.link}
                                </a>
                            )}
                            {event.date && <p>{event.date.split('T')[1]}</p>}
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};