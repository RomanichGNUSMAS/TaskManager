import React from "react";
import { useThemeStyles } from "../../../hooks/useThemeStyles";

export const Tasks:React.FC = () => {
    const { card, text } = useThemeStyles()
    
    return (
        <div className={card}>
            <h3 className={`text-lg font-semibold ${text.primary}`}>Tasks</h3>
            <p className={`mt-4 ${text.secondary}`}>Tasks management view coming soon...</p>
        </div>
    )
}