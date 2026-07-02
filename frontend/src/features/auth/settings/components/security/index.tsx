import { SubmitHandler, useForm } from "react-hook-form"
import { useThemeStyles } from "../../../../../hooks/useThemeStyles"
import React, { useState } from "react"
import { useChangePasswordMutation, useDeleteMyselfMutation } from "../../../authApi"
import { useNavigate, useOutletContext } from "react-router-dom"
import { User } from "../../../../../types/types"

export type PasswordChange = {
    current: string,
    new: string,
    completeNew: string
}

export const Security:React.FC = () => {
    const { card, text, input, button, border, isDark } = useThemeStyles()
    
    const { id } = useOutletContext<{ user : User,id:string}>()
    const { handleSubmit, formState: { errors }, register } = useForm<PasswordChange>();
    const [changePassword] = useChangePasswordMutation()

    const [error,setError] = useState('');
    const [info,setInfo] = useState('');

    const nav = useNavigate()
    const handleChangePassword:SubmitHandler<PasswordChange> = (data) => {
        if(data.completeNew !== data.new) return setError('different passwords in new and complete new fields')
        void changePassword({...data, id})
            .unwrap()
            .then(() => {
                setInfo('you will be logged in again :)')
                setTimeout(() => {
                    localStorage.removeItem('token')
                    nav('/auth/signin')
                },1500)
            })
            .catch(err => setError(err.message))
    }

    return (
        <div className={`${card} space-y-8`}> 

            <div className="space-y-2">
                <h3 className={`text-xl font-semibold ${text.primary}`}>Security Settings</h3>
                <p className={`text-sm ${text.secondary}`}>Manage your password and account deletion settings in one place.</p>
            </div>

            <div className={`rounded-[24px] border ${border.primary} ${isDark ? 'bg-slate-900/80' : 'bg-slate-50'} p-6 space-y-5`}>
                <div className="space-y-4">
                    <p className={`text-sm font-semibold ${text.primary}`}>Change your password</p>
                    <p className={`text-sm ${text.secondary}`}>Update your credentials to keep your account secure.</p>
                </div>

                <div className="space-y-4">
                    {error && <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">{error}</p>}
                    {info && <p className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-700">{info}</p>}
                    {Object.values(errors).map((error, index) => (
                        <p key={index} className="text-sm text-rose-500">{error?.message}</p>
                    ))}
                </div>

                <form className="space-y-4" onSubmit={handleSubmit(handleChangePassword)}>
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${text.secondary}`}>Current password</label>
                        <input
                            type="password"
                            placeholder="Enter current password"
                            className={`${input} w-full ${isDark ? 'bg-slate-950' : 'bg-white'}`}
                            {...register("current", { minLength: { value: 8, message: 'password cant have less length than 8' }, required: "fill your password" })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${text.secondary}`}>New password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className={`${input} w-full ${isDark ? 'bg-slate-950' : 'bg-white'}`}
                            {...register("new", { minLength: { value: 8, message: 'password cant have less length than 8' }, required: "fill your password" })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${text.secondary}`}>Confirm new password</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            className={`${input} w-full ${isDark ? 'bg-slate-950' : 'bg-white'}`}
                            {...register("completeNew", { minLength: { value: 8, message: 'password cant have less length than 8' }, required: "fill your password" })}
                        />
                    </div>

                    <button type="submit" className={button.primary}>Change Password</button>
                </form>
            </div>

        </div>
    )
}