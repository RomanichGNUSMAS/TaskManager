import { Task } from "../types/types";

export const priorityStyles: Record<Task['priority'], string> = {
    low: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    high: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    urgent: 'bg-rose-500/10 text-rose-300 border-rose-500/20'
};

export const statusStyles: Record<Task['status'], string> = {
    todo: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    in_process: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    review: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    done: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
};

export const statusLabels: Record<Task['status'], string> = {
    todo: 'Todo',
    in_process: 'In Process',
    review: 'Review',
    done: 'Done',
};