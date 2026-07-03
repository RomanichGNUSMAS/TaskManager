import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FetchProjectsResponse } from "../workManagement/projectMethods";
import { Event } from "../../types/types";


export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
    endpoints: (build) => ({
        GetProjects: build.query<FetchProjectsResponse, void>({
            query: () => ({
                url: '/projects'
            })
        }),
        GetAllEvents: build.query<Event[], void>({
            query: () => ({
                url: '/events'
            }),
            providesTags: ['event'] as any
        }),
        GetEventByDay: build.query<Event[], { date: Date }>({
            query: ({ date }) => ({
                url: `/events/bydate`,
                method: "POST",
                body: { date }
            }),
        }),
        NewEvent : build.mutation<Event, { event : Event, token : string}>({
            query: ({ event, token }) => ({
               url : '/events',
               method : "POST",
               headers : { Authorization : `Bearer ${token}`},
               body : event 
            })
        }),
        UpdateEvent : build.mutation<void, { event : Partial<Event>, id : string, token : string}>({
            query: ({event,token,id}) => ({
                url: `/events/${id}`,
                headers : { Authorization : `Bearer ${token}` },
                method: 'PUT',
                body : event
            })
        }),
        DeleteEvent : build.mutation<void, { id : string, token : string}>({
            query : ({ id, token }) => ({
                url: `/events/${id}`,
                headers : { Authorization :  `Bearer ${token}`},
                method: "DELETE"
            })
        })  
    })
})

export const { useGetProjectsQuery,
    useGetAllEventsQuery,
    useGetEventByDayQuery,
    useNewEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation
} = dashboardApi;