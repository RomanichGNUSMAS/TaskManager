import { useGetMeQuery } from "../../../authApi"
import { useThemeStyles } from "../../../../../hooks/useThemeStyles"

export const MyProfile = () => {
    const { data } = useGetMeQuery()
    const { card, text } = useThemeStyles()
    
    return (
        <div className={card}>
            <h3 className={`text-lg font-semibold ${text.primary}`}>My Profile</h3>
            {data && (
                <div className="mt-4 space-y-2">
                    <p className={`${text.secondary}`}><span className="font-medium">Name:</span> {data.name} {data.surname}</p>
                    <p className={`${text.secondary}`}><span className="font-medium">Email:</span> {data.email}</p>
                    <p className={`${text.secondary}`}><span className="font-medium">Phone:</span> {data.phone}</p>
                </div>
            )}
        </div>
    )
}