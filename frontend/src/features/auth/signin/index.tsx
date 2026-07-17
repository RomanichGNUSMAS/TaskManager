import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { User } from "../../../types/types";
import { useSignInMutation } from "../authApi";
import { useNavigate } from "react-router-dom";
import { useThemeStyles } from "../../../hooks/useThemeStyles";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const Signin: React.FC = () => {
    const { register, formState: { errors }, handleSubmit } = useForm<User>();
    const [signIn] = useSignInMutation();
    const [error, setError] = useState('');
    const nav = useNavigate();
    const { card, text, input, button, isDark } = useThemeStyles();

    const handleLog: SubmitHandler<User> = async (data) => {
        try {
            const res = await signIn(data).unwrap();
            setError('');
            localStorage.setItem('token', res as unknown as string);
            nav('/settings/profile')
        } catch (err) {
            const fetchError = err as FetchBaseQueryError;
            const message =
                fetchError && 'data' in fetchError
                    ? (fetchError.data as { message: string })?.message
                    : 'Something went wrong';
            setError(message ?? 'Something went wrong');
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className={`w-full max-w-md ${card}`}>
                <h2 className={`text-2xl font-bold mb-6 ${text.primary}`}>Sign In</h2>
                <form onSubmit={handleSubmit(handleLog)} className="space-y-4">
                    {error && <p className="text-2xl text-red-500">{error}</p>}
                    {Object.values(errors).map((error, idx) =>
                        <p key={idx} className="text-red-500 text-sm">{error.message}</p>
                    )}
                    <div>
                        <label className={`text-sm font-medium block mb-1 ${text.secondary}`}>Email</label>
                        <input type="text" {...register("email", { required: "please fill your email" })} className={input} />
                    </div>
                    <div>
                        <label className={`text-sm font-medium block mb-1 ${text.secondary}`}>Password</label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "please fill your password",
                                minLength: { value: 8, message: "password must be at least 8 characters long" }
                            })}
                            className={input}
                        />
                    </div>
                    <button type="submit" className={button.primary}>
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};