import React, { useState } from "react";
import { useAddProjectMutation } from "../../workManagementApi";
import { useGetMeQuery } from "../../../auth/authApi";
import { useNavigate } from "react-router-dom";
import { useThemeStyles } from "../../../../hooks/useThemeStyles";

interface CreateFormProps {
    onClose: () => void;
}

export const CreateProjectForm: React.FC<CreateFormProps> = ({ onClose }) => {
    const [name, setName] = useState("");
    const [state, setState] = useState<'on_hold' | 'active' | 'completetd'>("active");
    const token = localStorage.getItem('token');
    const navigate = useNavigate()
    const { data, isLoading: userLoading, isFetching } = useGetMeQuery();
    const { text, input, button } = useThemeStyles();
    
    if (isFetching || userLoading) return <p>Wait please...</p>

    if (!token) {
        void navigate('/auth/signin')
        return;
    }
    const [createProject, { isLoading }] = useAddProjectMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name?.trim()) return;

        try {
            await createProject({ project: { name, state, teamLeadId: data!._id }, token }).unwrap();
            onClose();
        } catch (err:any) {
            console.error(err.message);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className={`text-xl font-bold ${text.primary}`}>Create New Project</h2>

            <div>
                <label className={`text-sm font-medium block mb-1 ${text.secondary}`}>Project Title</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full ${input}`}
                    placeholder="Enter project name..."
                />
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className={button.secondary}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={button.primary}
                >
                    {isLoading ? "Creating..." : "Create"}
                </button>
            </div>
        </form>
    );
};