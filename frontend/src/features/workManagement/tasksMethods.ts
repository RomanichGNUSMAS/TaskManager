import { EndpointBuilder } from "@reduxjs/toolkit/query";
import { Task } from "../../types/types";

export default function taskMethods(build: EndpointBuilder<any, any, any>) {
    return {
        GetTasksByProjectId: build.query<Task[], { projectId: string }>({
            query: ({ projectId }) => ({
                url: `/projects/${projectId}/tasks`
            })
        }),
        GetOneTask: build.query<Task, { id: string }>({
            query: ({ id }) => ({
                url: `/tasks/${id}`
            })
        }),
        AddTask: build.mutation<Task, { task: Task, token: string }>({
            query: ({ task, token }) => ({
                url: '/tasks',
                method: 'post',
                headers: { Authorization: `Bearer ${token}` },
                body: task
            })
        }),
        UpdateTask: build.mutation<void, { task: Partial<Task>, id: string, token: string }>({
            query: ({ task, id, token }) => ({
                url: `/tasks/${id}`,
                method: 'put',
                headers: { Authorization: `Bearer ${token}` },
                body: task
            })
        }),
        SetStateTask: build.mutation<void, { state: string, id: string }>({
            query: ({ state, id }) => ({
                url: `/tasks/${id}`,
                method: 'patch',
                body: state
            })
        }),
        DeleteTask: build.mutation<Task, { id: string, token: string }>({
            query: ({ id, token }) => ({
                url: `/tasks/${id}`,
                headers: { Authorization: `Bearer ${token}` }
            })
        })
    }
}

