import { useThemeStyles } from "../../../../../hooks/useThemeStyles"

export const Security = () => {
    const { card, text } = useThemeStyles()
    
    return (
        <div className={card}>
            <h3 className={`text-lg font-semibold ${text.primary}`}>Security Settings</h3>
            <p className={`mt-4 ${text.secondary}`}>Manage your account security options</p>
        </div>
    )
}