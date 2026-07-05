import React, { useState } from "react";
import { useThemeStyles } from "../hooks/useThemeStyles";
import { User } from "../types/types";
import { useDeleteNotificationMutation, useMarkNotificationAsReadMutation} from "../features/auth/authApi";

export const Notifications: React.FC<{ user: User }> = ({ user }) => {
    const [notificationsOpen, setNotificationsOpen] = useState(true);
    const [deleteNotification] = useDeleteNotificationMutation();
    const [markAsRead] = useMarkNotificationAsReadMutation();
    const { isDark, text } = useThemeStyles()

    return (
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
                            <div className="min-w-0 space-y-3">
                                <p className={`text-[10px] uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Notification</p>
                                {user.notifications.length > 0 ? (
                                    <div className="space-y-3 scroll-auto">
                                                {user.notifications.map(notification => (
                                            <div onClick={() => markAsRead({ userId: user._id, notificationId: notification._id })} key={notification.createdAt} className={`rounded-3xl border p-3 text-[12px] leading-5 shadow-sm transition-colors ${isDark ? 'border-slate-700 bg-slate-900/90 text-slate-100 shadow-slate-950/10' : 'border-slate-200 bg-slate-50 text-slate-900 shadow-slate-200/80'}`}>
                                                <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${text.secondary}`}>
                                                    {new Date(notification.createdAt).toDateString()}
                                                </p>
                                                <p className={`mt-1 text-sm ${notification.isRead ? text.secondary : text.primary}`}>
                                                    {notification.text}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteNotification({ userId: user._id, notificationId: notification._id })}
                                                    className={`mt-3 inline-flex items-center justify-center rounded-full border p-2 transition-colors hover:bg-red-500 hover:text-white ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}
                                                    title="Delete notification"
                                                >
                                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M3 6h18" />
                                                        <path d="M8 6V4h8v2" />
                                                        <path d="M10 11v6" />
                                                        <path d="M14 11v6" />
                                                        <path d="M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" />
                                                        <path d="M9 6V4h6v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="rounded-3xl border px-3 py-2 text-sm text-slate-500">No notification received</p>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}