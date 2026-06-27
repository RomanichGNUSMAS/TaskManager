import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { User } from "../../../types/types";
import { useSignInMutation } from "../authApi";
import { useNavigate } from "react-router-dom";

export const Signin: React.FC = () => {
    const { register, formState: { errors }, handleSubmit } = useForm<User>();
    const [signIn] = useSignInMutation();
    const nav = useNavigate()
    const handleLog: SubmitHandler<User> = (data) => {
        void signIn(data)
            .unwrap()
            .then((res) => {
              localStorage.setItem('token',res as string);
              void nav('/settings/profile')  
            })
            .catch(console.log)
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