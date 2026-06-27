import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Project } from "../../types/types";


export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery : fetchBaseQuery({ baseUrl : 'http://localhost:3001'}),
    endpoints : (build) => ({
        GetProjects : build.query<Project[], void>({
            query : () => ({
                url : '/projects'
            })
        }),
             
    })
})

export const { useGetProjectsQuery } = dashboardApi;