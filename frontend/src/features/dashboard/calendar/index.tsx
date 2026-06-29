import React from "react";
import { useThemeStyles } from "../../../hooks/useThemeStyles";

export const Calendar:React.FC = () => {
    const { card, text } = useThemeStyles()
    
    return (
        <div className={card}>
            <h3 className={`text-lg font-semibold ${text.primary}`}>Calendar</h3>
            <p className={`mt-4 ${text.secondary}`}>Calendar view coming soon...</p>
        </div>
    )
}