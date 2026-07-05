import {  useMemo } from 'react';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { useGetAllProjectsQuery} from '../../workManagement/workManagementApi';
import { useGetTasks } from '../dashboard/hooks/useGetTasks';
import { useProjectStatusData, useTaskPriorityData, useTasksByProject, useTaskStatusData } from '../dashboard/hooks/getPriorities';
import renderProgressParts from '../dashboard/utils/renderProgressParts';

export const Progress = () => {
  const { card, text, bg} = useThemeStyles();

  const { data: projectsResponse, isLoading: isProjectsLoading } = useGetAllProjectsQuery({
    page: 0,
    limit: 100,
  });
  const projects = projectsResponse?.projects;
  const projectIds = useMemo(
    () => projects?.map((project) => project._id) ?? [],
    [projects],
  );
  
  const { allTasks, isTasksLoading } = useGetTasks({ projectIds });
  
  const tasksByProject = useTasksByProject(projects ?? []);
  const projectStatusData = useProjectStatusData(projects ?? [])
  const taskStatusData = useTaskStatusData(allTasks)
  const taskPriorityData = useTaskPriorityData(allTasks)
  
  const { chart, ChartPlaceholder, renderBarChart,renderPieChart, renderPieLabel} = renderProgressParts()
  return (
    <div className={`grid grid-cols-1 gap-6 p-6 md:grid-cols-2 min-h-screen ${bg.secondary}`}>

      <div className={card}>
        <h3 className={`mb-6 text-lg font-semibold ${text.primary}`}>Tasks by Project</h3>
        <div className="h-[300px] w-full">
          {isProjectsLoading ? (
            <ChartPlaceholder message="Loading projects…" textClass={text.secondary} />
          ) : !tasksByProject.length ? (
            <ChartPlaceholder message="No projects yet" textClass={text.secondary} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksByProject} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chart.grid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chart.tick, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: chart.tick, fontSize: 12 }} />
                <Tooltip cursor={{ fill: chart.cursor }} contentStyle={chart.tooltip} />
                <Legend iconType="square" wrapperStyle={chart.legend} />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="total" name="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className={card}>
        <h3 className={`mb-6 text-lg font-semibold ${text.primary}`}>Project Status Distribution</h3>
        <div className="h-[300px] w-full">
          {renderPieChart(projectStatusData, isProjectsLoading, 'No projects yet')}
        </div>
      </div>

      <div className={card}>
        <h3 className={`mb-6 text-lg font-semibold ${text.primary}`}>Task Status Distribution</h3>
        <div className="h-[300px] w-full">
          {isProjectsLoading || isTasksLoading ? (
            <ChartPlaceholder message="Loading tasks…" textClass={text.secondary} />
          ) : !projects?.length ? (
            <ChartPlaceholder message="No projects yet" textClass={text.secondary} />
          ) : (
            renderBarChart(taskStatusData)
          )}
        </div>
      </div>

      {/* Task Priority — useGetTasksByProjectIdQuery → Task[].priority (low, medium, high, urgent) */}
      <div className={card}>
        <h3 className={`mb-6 text-lg font-semibold ${text.primary}`}>Task Priority Distribution</h3>
        <div className="h-[300px] w-full">
          {isProjectsLoading || isTasksLoading ? (
            <ChartPlaceholder message="Loading tasks…" textClass={text.secondary} />
          ) : !projects?.length ? (
            <ChartPlaceholder message="No projects yet" textClass={text.secondary} />
          ) : (
            renderBarChart(taskPriorityData)
          )}
        </div>
      </div>

    </div>
  );
};
