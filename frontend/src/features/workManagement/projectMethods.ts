import { EndpointBuilder } from "@reduxjs/toolkit/query";
import { Project } from "../../types/types";

export interface FetchProjectsResponse {
  projects: Project[];
  totalPages: number;
  totalActive: number;
}

export default function projectMethods(build: EndpointBuilder<any, any, any>) {
    return {
        GetAllProjects: build.query<FetchProjectsResponse, { page: number, limit: number }>({
            query: ({ page, limit }) => ({
                url: `/projects?page=${page}&limit=${limit}`
            }),
            providesTags:['project']
        }),
        GetProjectById: build.query<Project[], { id: string }>({
            query: ({ id }) => ({
                url: `/projects/${id}`
            }),
            providesTags:['project']
        }),
        AddProject: build.mutation<Project, { project: Partial<Project>, token: string }>({
            query: ({ project, token }) => ({
                url: '/projects',
                headers: { Authorization: `Bearer ${token}` },
                method: 'post',
                body: project
            }),
            invalidatesTags:['project']
        }),
        UpdateProject: build.mutation<void, { project: Partial<Project>, id: string, token: string }>({
            query: ({ project, id, token }) => ({
                url: `/projects/${id}`,
                method: 'put',
                headers: { Authorization: `Bearer ${token}` },
                body: project
            }),
            invalidatesTags : ['project']
        }),
        FavoriteProject: build.mutation<void, { userId: string, projectId: string }>({
            query: ({ userId, projectId }) => ({
                url: `/projects/${projectId}/favorite`,
                method: 'patch',
                body: userId
            }),
            invalidatesTags:['project']
        }),
        DeleteProject: build.mutation<Project, { token: string, id: string }>({
            query: ({ id, token }) => ({
                url: `/projects/${id}`,
                method: 'delete',
                headers: { Authorization: `Bearer ${token}` }
            }),
            invalidatesTags:['project']
        })
    }
}