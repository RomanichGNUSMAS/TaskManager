import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { User } from "../../../types/types";

export const Signup: React.FC = () => {
    const { register, formState: { errors }, handleSubmit } = useForm<User>()
    const handleSend: SubmitHandler<User> = (data) => {
        
    }

    return (
        <div>
            <h3>Add New Employee</h3>
            {Object.values(errors).map(error =>
                <p>{error.message}</p>
            )}
            <form onSubmit={handleSubmit(handleSend)}>
                <label>Name</label>
                <input type="text" {...register("name", { required: "please fill your name" })} />
                <label>Surname</label>
                <input type="text" {...register("surname", { required: "please fill your surname" })} />
                <label>Email</label>
                <input type="text" {...register("email", { required: "please fill your email" })} />
                <label>Phone Number</label>
                <input type="text" placeholder="98 123 456" {...register("phone", { required: "please fill your phone number" })} />
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
                <button>Send</button>
            </form>
        </div>
    )
}