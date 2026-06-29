import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../types/types";


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
                method: 'post'
            })
        }),

        SignUp: build.mutation<User, User>({
            query: (user) => ({
                url: '/auth/signup',
                method: 'post',
                body: user
            })
        }),

        GetMe: build.query<User, void>({
            query: () => {
                const token = localStorage.getItem('token');
                return {
                    url: '/auth/me',
                    headers : { Authorization : `Bearer ${token}`},
                    providesTags: ['theme']
                }
            }
        }),
        SetPhoto: build.mutation<void, { file: FormData, id: string }>({
            query: ({ file, id }) => ({
                url: `/users/${id}`,
                method: `patch`,
                body: file
            })
        }),
        UpdateAppearance: build.mutation<void, { theme: string, id: string }>({
            query: ({ theme, id }) => ({
                url: `/users/${id}`,
                method: "put",
                headers: { ContentType: 'application/json' },
                body: { settings: { appearance: theme } },
                invalidatesTags: ['theme']
            })
        }),
        DeleteMyself: build.mutation<User, { id: string }>({
            query: ({ id }) => ({
                url: `/users/${id}`,
                method: "delete"
            })
        })
    })
})

export const { useGetMeQuery,
    useSignUpMutation,
    useSignInMutation,
    useUpdateAppearanceMutation,
    useDeleteMyselfMutation } = authApi;