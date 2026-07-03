import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../types/types";
import { PasswordChange } from "./settings/components/security";


export const authApi = createApi({
    reducerPath: 'auth',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3001'
    }),
    endpoints: build => ({
        SignIn: build.mutation<string | { message: string }, User>({
            query: (user) => ({
                url: '/auth/signin',
                body: user,
                method: 'POST'
            }),
            invalidatesTags: ['log'] as any
        }),

        SignUp: build.mutation<User, User>({
            query: (user) => ({
                url: '/auth/signup',
                method: 'POST',
                body: user
            })
        }),

        GetMe: build.query<User, void>({
            query: () => {
                const token = localStorage.getItem('token');
                return {
                    url: '/auth/me',
                    headers: { Authorization: `Bearer ${token}` },
                }
            },
            providesTags: ['theme', 'image', 'log', 'updateUser', 'notification'] as any
        }),
        SetPhoto: build.mutation<void, { file: FormData, id: string }>({
            query: ({ file, id }) => ({
                url: `/users/${id}/avatar`,
                method: `PATCH`,
                body: file
            }),
            invalidatesTags: ['image'] as any
        }),
        UpdateUser: build.mutation<void, { user: Partial<User>, id: string }>({
            query: ({ user, id }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: user
            }),
            invalidatesTags: ['updateUser'] as any
        }),
        UpdateAppearance: build.mutation<void, { theme: string, id: string }>({
            query: ({ theme, id }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: { settings: { appearance: theme } },
            }),
            invalidatesTags: ['theme'] as any
        }),
        DeleteMyself: build.mutation<User, { id: string }>({
            query: ({ id }) => ({
                url: `/users/${id}`,
                method: "DELETE"
            })
        }),
        GetUsersByRole: build.query<User[], { role: string }>({
            query: ({ role }) => ({
                url: `/users/role/${role}`
            })
        }),
        GetUserById: build.query<User, { id: string }>({
            query: ({ id }) => ({
                url: `/users/${id}`
            })
        }),
        ChangePassword: build.mutation<void, PasswordChange & { id: string }>({
            query: (passwords) => ({
                url: `/users/${passwords.id}/password`,
                methods: 'PATCH',
                body: passwords
            })
        }),
        SendNotificaion: build.mutation<void, { id: string, message: string }>({
            query: ({ id, message }) => ({
                url: `/users/${id}/message`,
                method: "POST",
                body: { message }
            })
        }),
        MarkNotificationAsRead: build.mutation<void, { userId: string, notificationId: string }>({
            query: ({ userId, notificationId }) => ({
                url: `/users/${userId}/notifications/${notificationId}`,
                method: "PATCH"
            }),
            invalidatesTags: ['notification'] as any
        }),
        DeleteNotification: build.mutation<void, { userId: string, notificationId: string }>({
            query: ({ userId, notificationId }) => ({
                url: `/users/${userId}/notifications/${notificationId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['notification'] as any
        })
    })
})

export const { useGetMeQuery,
    useGetUsersByRoleQuery,
    useMarkNotificationAsReadMutation,
    useUpdateUserMutation,
    useGetUserByIdQuery,
    useSetPhotoMutation,
    useChangePasswordMutation,
    useSignUpMutation,
    useSignInMutation,
    useUpdateAppearanceMutation,
    useDeleteNotificationMutation,
    useDeleteMyselfMutation } = authApi;