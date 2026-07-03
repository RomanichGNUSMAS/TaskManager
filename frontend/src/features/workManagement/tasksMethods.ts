import { EndpointBuilder } from "@reduxjs/toolkit/query";
import { Task } from "../../types/types";

export default function taskMethods(build: EndpointBuilder<any, any, any>) {
    return {
        GetTasksByProjectId: build.query<Task[], { projectId: string }>({
            query: ({ projectId }) => ({
                url: `/projects/${projectId}/tasks`
            }),
            providesTags:['subtask'] as any
        }),
        GetOneTask: build.query<Task, { id: string }>({
            query: ({ id }) => ({
                url: `/tasks/${id}`
            })
        }),
        AddTask: build.mutation<Task, { task: Task, token: string }>({
            query: ({ task, token }) => ({
                url: '/tasks',
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: task
            })
        }),
        UpdateTask: build.mutation<void, { task: { title : string, priority: string, addedSubtasks: { title : string, done : boolean}[], removedSubtasks: string[]}, id: string, token: string }>({
            query: ({ task, id, token }) => ({
                url: `/tasks/${id}/update`,
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: task
            })
        }),
        SetStateTask: build.mutation<void, { state: string, id: string }>({
            query: ({ state, id }) => ({
                url: `/tasks/${id}/state`,
                method: 'PATCH',
                headers : { 'Content-Type': 'application/json'},
                body:  { state }
            })
        }),
        DeleteTask: build.mutation<Task, { id: string, token: string }>({
            query: ({ id, token }) => ({
                url: `/tasks/${id}`,
                headers: { Authorization: `Bearer ${token}` },
                method:"DELETE"
            })
        }),
        DeleteSubtask: build.mutation<void, { token : string , taskId: string, subtaskId : string}>({
            query : ({token,taskId,subtaskId}) => ({
                url : `/tasks/${taskId}/subtasks/${subtaskId}`,
                headers : { Authorization : `Bearer ${token}`},
                method:"DELETE"
            }),
            invalidatesTags:['subtask']
        })
    }
}

