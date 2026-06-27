import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const authApi = createApi({
    reducerPath:'auth',
    endpoints: build => ({}),
    baseQuery:fetchBaseQuery({
        baseUrl : 'http://localhost:3001'
    })
})