import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { User } from "../../types/types";

export const Signin: React.FC = () => {
    const { register, formState: { errors }, handleSubmit } = useForm<User>();
    const handleLog: SubmitHandler<Partial<User>> = (data) => {
        //zustand using
    }
    return (
        <div>
            <form onSubmit={handleSubmit(handleLog)}>
                {Object.values(errors).map(error =>
                    <p>{error.message}</p>
                )}
                <label>Email</label>
                <input type="text" {...register("email", { required: "please fill your email" })} />
                <label>Password</label>
                <input
                    type="password"
                    {...register("password", {
                        required: "please fill your password",
                        minLength: {
                            value: 8,
                            message: "password must be at least 8 characters long"
                        }
                    })}
                />
                <button>Log In</button>
            </form>
        </div>
    )
}