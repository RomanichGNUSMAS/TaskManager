import React from "react";
import { Event } from "../../../../types/types";
import { useThemeStyles } from "../../../../hooks/useThemeStyles";

export const UpcomingEvents: React.FC<{ events: Event[] }> = ({ events }) => {
    const { card, text, border, bg } = useThemeStyles();

    const upcomingEvents = events
        .filter(event => event.date && new Date(event.date).getTime() >= Date.now())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    return (
        <div className={`${card} p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3 className={`text-lg font-semibold ${text.primary}`}>Upcoming Events</h3>
                    <p className={`mt-1 text-sm ${text.secondary}`}>Next scheduled items</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${text.secondary} ${bg.tertiary}`}>
                    {upcomingEvents.length}
                </span>
            </div>

            {upcomingEvents.length === 0 ? (
                <div className={`mt-4 rounded-[20px] border border-dashed ${border.primary} ${bg.secondary} px-4 py-5 text-sm ${text.secondary}`}>
                    No upcoming events for now.
                </div>
            ) : (
                <div className="mt-4 space-y-3">
                    {upcomingEvents.map(event => (
                        <div key={event._id} className={`rounded-[20px] border ${border.primary} ${bg.secondary} p-4`}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h4 className={`text-sm font-semibold ${text.primary}`}>{event.title}</h4>
                                    <p className={`mt-1 text-sm ${text.secondary}`}>{event.location}</p>
                                </div>
                                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] ${text.secondary} ${bg.tertiary}`}>
                                    {event.eventType}
                                </span>
                            </div>
                            <p className={`mt-3 text-xs ${text.secondary}`}>
                                {new Date(event.date).toLocaleString(undefined, {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};