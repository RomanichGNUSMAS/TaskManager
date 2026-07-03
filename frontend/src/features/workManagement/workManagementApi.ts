import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import projectMethods from "./projectMethods";
import taskMethods from "./tasksMethods";

export const workManagementApi = createApi({
    reducerPath: 'workManagementApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
    endpoints: build => ({
        ...(projectMethods(build)),
        ...(taskMethods(build))
    })
})

//projects
export const {
    useGetAllProjectsQuery,
    useGetProjectByIdQuery,
    useAddProjectMutation,
    useFavoriteProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation
} = workManagementApi;
//tasks
export const {
    useGetTasksByProjectIdQuery,
    useGetOneTaskQuery,
    useAddTaskMutation,
    useSetStateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useDeleteSubtaskMutation
} = workManagementApi;