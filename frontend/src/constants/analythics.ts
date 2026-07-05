import { Task } from "../types/types";

export const PROJECT_STATE_COLORS: Record<string, string> = {
    active: '#10b981',
    on_hold: '#eab308',
    completed: '#3b82f6',
    completetd: '#3b82f6',
};

export const TASK_STATUS_COLORS: Record<Task['status'], string> = {
    todo: '#64748b',
    in_process: '#3b82f6',
    review: '#8b5cf6',
    done: '#10b981',
};

export const TASK_PRIORITY_COLORS: Record<Task['priority'], string> = {
    low: '#10b981',
    medium: '#eab308',
    high: '#f97316',
    urgent: '#ef4444',
};

export const TASK_STATUS_LABELS: Record<Task['status'], string> = {
    todo: 'Todo',
    in_process: 'In Process',
    review: 'Review',
    done: 'Done',
};

export const TASK_PRIORITY_LABELS: Record<Task['priority'], string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
};
