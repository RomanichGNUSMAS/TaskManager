import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { User } from "../../../types/types";
import { useThemeStyles } from "../../../hooks/useThemeStyles";

export const Signup: React.FC = () => {
    const { register, formState: { errors }, handleSubmit } = useForm<User>()
    const { card, text, input, button, isDark } = useThemeStyles()
    const handleSend: SubmitHandler<User> = (data) => {
        
    }

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className={`w-full max-w-md ${card}`}>
                <h2 className={`text-2xl font-bold mb-6 ${text.primary}`}>Add New Employee</h2>
                <form onSubmit={handleSubmit(handleSend)} className="space-y-4">
                    {Object.values(errors).map((error, idx) =>
                        <p key={idx} className="text-red-500 text-sm">{error.message}</p>
                    )}
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
                        <input type="text" placeholder="98 123 456" {...register("phone", { required: "please fill your phone number" })} className={input} />
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
                        Send
                    </button>
                </form>
            </div>
        </div>
    )
}