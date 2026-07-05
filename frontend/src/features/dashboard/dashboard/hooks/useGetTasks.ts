import { useEffect, useState } from "react";
import { workManagementApi } from "../../../workManagement/workManagementApi";
import { useAppDispatch } from "../../../../app/hooks";
import { Task } from "../../../../types/types";
export const useGetTasks = ({ projectIds }: { projectIds: string[] }) => {
    const dispatch = useAppDispatch();
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [isTasksLoading, setIsTasksLoading] = useState(false);
    useEffect(() => {
        if (!projectIds.length) {
          setAllTasks([]);
          setIsTasksLoading(false);
          return;
        }
    
        let cancelled = false;
        setIsTasksLoading(true);
    
        void Promise.all(
          projectIds.map((projectId) =>
            dispatch(
              workManagementApi.endpoints.GetTasksByProjectId.initiate({ projectId }),
            ).unwrap(),
          ),
        )
          .then((taskGroups) => {
            if (!cancelled) setAllTasks(taskGroups.flat());
          })
          .catch(() => {
            if (!cancelled) setAllTasks([]);
          })
          .finally(() => {
            if (!cancelled) setIsTasksLoading(false);
          });
    
        return () => {
          cancelled = true;
        };
      }, [dispatch, projectIds]);

    return { allTasks, isTasksLoading };
}