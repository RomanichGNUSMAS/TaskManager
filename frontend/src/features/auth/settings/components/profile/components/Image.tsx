import React, { useRef, useState } from "react";
import { User } from "../../../../../../types/types";
import { defaultLink } from "../../../../../../constants/userAvatar";

type Props = {
    user : User,
    setChange : (arg:boolean) => void
}
export const Image:React.FC<Props> = ({ user,setChange }) => {
    const ref = useRef<null | HTMLInputElement>(null)

    return (
        <>
            <img className="mx-auto h-20 w-20" src={(user.avatar && `http://localhost:3000/${user.avatar}`) || defaultLink} onClick={() => ref.current?.click()} />
            <input ref={ref} onChange={() => setChange(true)} type="file" className="hidden" />
        </>
    )
}