import React from "react";
import { useGetUserByIdQuery } from "../../../auth/authApi";
import { defaultLink } from "../../../../constants/userAvatar";

export const UserAvatar:React.FC<{ userId : string}> = ({ userId}) => {
    const { data } = useGetUserByIdQuery({ id:userId});

    return (
        <div>
            <img src={(data?.avatar && `http://localhost:3001/${data.avatar}`) || defaultLink} />
        </div>
    )
}