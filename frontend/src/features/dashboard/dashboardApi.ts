import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FetchProjectsResponse } from "../workManagement/projectMethods";


export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery : fetchBaseQuery({ baseUrl : 'http://localhost:3001'}),
    endpoints : (build) => ({
        GetProjects : build.query<FetchProjectsResponse, void>({
            query : () => ({
                url : '/projects'
            })
        }),
             
    })
})

export const { useGetProjectsQuery } = dashboardApi;