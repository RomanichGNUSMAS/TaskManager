import React, { useState } from "react";
import { useThemeStyles } from "../../../hooks/useThemeStyles";
import { useGetProjectsQuery } from "../../dashboard/dashboardApi";
import { ProjectTasks } from "./components/projectTasks";
import { CreateTask } from "./components/createTask";
import { useGetMeQuery } from "../../auth/authApi";

export const Tasks: React.FC = () => {
    const { card } = useThemeStyles();
    const { data: me } = useGetMeQuery()
    const { data, isLoading } = useGetProjectsQuery();
    const [isCreating,setCreateState] = useState(false);

    if (isLoading) return <div className={card}>Loading...</div>;

    return data && me && (
        <div className={`${card} flex flex-col gap-6`}>
            {(me.role == 'GOD' || me.role == 'TEAMLEAD') && <button onClick={() => setCreateState(true)}>Create new Task</button>} 
            {!isCreating ? data.projects.map((project: any) => (
                <ProjectTasks 
                    key={project._id} 
                    projectId={project._id} 
                    projectName={project.title} 
                />
            )) : <CreateTask projects={data.projects} createState={setCreateState}/>}
        </div>
    );
};