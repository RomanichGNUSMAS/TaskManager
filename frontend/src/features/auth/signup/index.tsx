import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { User } from "../../../types/types";
import { useThemeStyles } from "../../../hooks/useThemeStyles";
import { Link, useNavigate } from "react-router-dom";
import { useGetUsersByRoleQuery, useSignUpMutation } from "../authApi";

export const Signup: React.FC = () => {
    const { register, formState: { errors }, handleSubmit } = useForm<User>()
    const [signUp] = useSignUpMutation();
    const { card, text, input, button, isDark } = useThemeStyles()
    const { data: gods } = useGetUsersByRoleQuery({ role: "GOD" });
    const navigate = useNavigate()
    const handleSend: SubmitHandler<User> = (data) => {
        console.log(data)
        void signUp(data)
            .unwrap()
            .then(() => setTimeout(() => navigate('/'),15))
            .catch(console.log)
    }

    return gods && (
        <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className={`w-full max-w-md ${card}`}>
                <h2 className={`text-2xl font-bold mb-6 ${text.primary}`}>Add New Employee</h2>
                <form onSubmit={handleSubmit(handleSend)} className="space-y-4">
                    {Object.values(errors).map((error, idx) =>
                        <p key={idx} className="text-red-500 text-sm">{error.message}</p>
                    )}
                    {gods.length >= 1 && <Link
                        to="/"
                        className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${isDark ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-cyan-600 text-slate-950 hover:bg-cyan-500'}`}
                    >
                        Back to Home
                    </Link>}
                    <div>
                        <label className={`text-sm font-medium block mb-1 ${text.secondary}`}>Name</label>
                        <input type="text" {...register("name", { required: "please fill your name" })} className={input} />
                    </div>
                    <div>
                        <label className={`text-sm font-medium block mb-1 ${text.secondary}`}>Surname</label>
                        <input type="text" {...register("surname", { required: "please fill your surname" })} className={input} />
                    </div>
                    <div>
                        <label className={`text-sm font-medium block mb-1 ${text.secondary}`}>Email</label>
                        <input type="text" {...register("email", { required: "please fill your email" })} className={input} />
                    </div>
                    <div>
                        <label className={`text-sm font-medium block mb-1 ${text.secondary}`}>Phone Number</label>
                        <input type="text" placeholder="98 123 456" {...register("phone", { required: "please fill your phone number",setValueAs : Number })} className={input} />
                    </div>
                    {gods.length >= 1 && (<>
                        <div>
                            <label className={`text-sm font-medium block mb-1 ${text.secondary}`}>Role</label>
                            <input type="text" placeholder="98 123 456" {...register("role", { required: "please fill your role" })} className={input} />
                        </div>
                    </>)}
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
                        Send
                    </button>
                </form>
            </div>
        </div >
    )
}