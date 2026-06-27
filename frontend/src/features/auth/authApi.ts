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
            queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
                const token = localStorage.getItem('token')
                if (!token) {
                    return {
                        error: {
                            status: 401,
                            data : { message : "token is not defined"},
                        },
                    };
                } const result = await baseQuery({
                    url: '/auth/me',
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (result.error) {
                    return { error: result.error };
                }

                return { data: result.data as User };
            }
        })
    })
})

export const { useGetMeQuery,useSignUpMutation,useSignInMutation } = authApi;