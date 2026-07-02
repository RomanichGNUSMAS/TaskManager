import React, { Ref, RefObject, useRef, useState } from "react";
import { User } from "../../../../../../types/types";
import { defaultLink } from "../../../../../../constants/userAvatar";

type Props = {
    user : User,
    setChange : (arg:boolean) => void,
    ref:RefObject<HTMLInputElement>
}
export const Image:React.FC<Props> = ({ user,setChange,ref }) => {

    return (
        <>
            <img className="rounded-3xl mx-auto h-20 w-20" src={(user.avatar && `http://localhost:3001/${user.avatar}`) || defaultLink} onClick={() => ref.current.click()} />
            <input ref={ref} onChange={() => setChange(true)} type="file" className="hidden" />
        </>
    )
}