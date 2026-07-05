import { useMemo } from "react";
import { ChartSlice, Project, Task } from "../../../../types/types";
import { PROJECT_STATE_COLORS, TASK_PRIORITY_COLORS, TASK_PRIORITY_LABELS, TASK_STATUS_COLORS, TASK_STATUS_LABELS } from "../../../../constants/analythics";


const countByKey = <T extends string>(items: { key: T }[], keys: T[]) =>
    keys.map((key) => ({
        key,
        value: items.filter((item) => item.key === key).length,
    }));


export const useTasksByProject = (projects: Project[]) => useMemo(
    () =>
        (projects ?? []).map((project) => ({
            name: project.name.length > 14 ? `${project.name.slice(0, 14)}…` : project.name,
            completed: project.completedCount,
            total: project.tasksCount,
        })),
    [projects],
);

export const useProjectStatusData = (projects: Project[]) => useMemo<ChartSlice[]>(() => {
    const states = ['active', 'on_hold', 'completed'] as const;
    const counts = countByKey(
        (projects ?? []).map((project) => ({
            key: (project.state === 'completetd' ? 'completed' : project.state) as typeof states[number],
        })),
        [...states],
    );

    return counts
        .filter(({ value }) => value > 0)
        .map(({ key, value }) => ({
            name: key === 'on_hold' ? 'On Hold' : key.charAt(0).toUpperCase() + key.slice(1),
            value,
            color: PROJECT_STATE_COLORS[key],
        }));
}, [projects]);

export const useTaskStatusData = (allTasks: Task[]) => useMemo<ChartSlice[]>(() => {
    const statuses: Task['status'][] = ['todo', 'in_process', 'review', 'done'];
    const counts = countByKey(
        allTasks.map((task) => ({ key: task.status })),
        statuses,
    );

    return counts.map(({ key, value }) => ({
        name: TASK_STATUS_LABELS[key],
        value,
        color: TASK_STATUS_COLORS[key],
    }));
}, [allTasks]);

export const useTaskPriorityData = (allTasks: Task[]) => useMemo<ChartSlice[]>(() => {
    const priorities: Task['priority'][] = ['low', 'medium', 'high', 'urgent'];
    const counts = countByKey(
        allTasks.map((task) => ({ key: task.priority })),
        priorities,
    );

    return counts.map(({ key, value }) => ({
        name: TASK_PRIORITY_LABELS[key],
        value,
        color: TASK_PRIORITY_COLORS[key],
    }));
}, [allTasks]);