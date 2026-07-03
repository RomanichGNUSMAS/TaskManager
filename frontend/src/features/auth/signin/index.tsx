import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { User } from "../../../types/types";
import { useSignInMutation } from "../authApi";
import { useNavigate } from "react-router-dom";
import { useThemeStyles } from "../../../hooks/useThemeStyles";

export const Signin: React.FC = () => {
    const { register, formState: { errors }, handleSubmit } = useForm<User>();
    const [signIn] = useSignInMutation();
    const nav = useNavigate()
    const { card, text, input, button, isDark } = useThemeStyles();
    const handleLog: SubmitHandler<User> = (data) => {
        void signIn(data)
            .unwrap()
            .then(async (res) => {
                await localStorage.setItem('token', res as string);
                setTimeout(() => {
                    nav('/settings/profile', { replace : true })
                }, 15)
            })
            .catch(console.log)
    }
    return (
        <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className={`w-full max-w-md ${card}`}>
                <h2 className={`text-2xl font-bold mb
                    
                    6 ${text.primary}`}>Sign In</h2>
                <form onSubmit={handleSubmit(handleLog)} className="space-y-4">
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
                                minLength: {
                                    value: 8,
                                    message: "password must be at least 8 characters long"
                                }
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
    )
}