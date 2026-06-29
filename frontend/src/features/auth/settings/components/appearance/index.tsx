import { useOutletContext } from "react-router-dom";
import { useUpdateAppearanceMutation } from "../../../authApi"
import { useState } from "react";
import { User } from "../../../../../types/types";
import { useThemeStyles } from "../../../../../hooks/useThemeStyles";

export const Appearance = () => {
    const { user } = useOutletContext<{ user: User }>()
    const [changeAppearance] = useUpdateAppearanceMutation();
    const [option,setOption] = useState(user.settings.appearance)
    const { card, text, input, button } = useThemeStyles();
    
    const handleSave = (option:string) => {
        void changeAppearance({ id:user._id,theme: option })
            .unwrap()
            .catch(err => console.error(err))
    }

    return (
        <div className={card}>
            <div className="mb-6">
                <p className={`text-[10px] uppercase tracking-[0.28em] ${text.tertiary} mb-2`}>Preferences</p>
                <h2 className={`text-xl font-semibold ${text.primary}`}>Theme Appearance</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="theme-select" className={`block text-sm font-medium ${text.secondary} mb-2`}>
                        Color Scheme
                    </label>
                    <select 
                        id="theme-select"
                        value={option} 
                        onChange={(e) => setOption(e.target.value as 'system' | 'light' | 'dark')}
                        className={`w-full ${input} transition accent-cyan-500`}
                    >
                        <option value="dark" className="bg-slate-900 text-white">Dark</option>
                        <option value="light" className="bg-white text-slate-900">Light</option>
                        <option value="system" className="bg-slate-900 text-white">System</option>
                    </select>
                </div>

                <button 
                    onClick={() => handleSave(option)}
                    className={button.primary}
                >
                    Save Changes
                </button>
            </div>
        </div>
    )
}