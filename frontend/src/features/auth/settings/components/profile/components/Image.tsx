import React, { useRef } from "react";
import { User } from "../../../../../../types/types";
import { defaultLink } from "../../../../../../constants/userAvatar";

type Props = {
    user : User
}
export const Image:React.FC<Props> = ({ user }) => {
    const ref = useRef<null | HTMLInputElement>(null)
    return (
        <>
            <img className="h-20 w-20" src={(user.avatar && `http://localhost:3000/${user.avatar}`) || defaultLink} onClick={() => ref.current?.click()} />
            <input ref={ref} type="file" className="hidden" />
        </>
    )
}