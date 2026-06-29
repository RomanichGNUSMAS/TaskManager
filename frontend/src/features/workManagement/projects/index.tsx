import React, { useState } from "react";
import { useGetAllProjectsQuery } from "../workManagementApi";
import { Project } from "../../../types/types";
import { ProjectCard } from "./compontents/projectCard";
import { CreateProjectForm } from "./compontents/createProject";
import { useThemeStyles } from "../../../hooks/useThemeStyles";

export const Projects: React.FC = () => {
    const [page, setPage] = useState(0);
    const [isClicked, setClick] = useState(false)
    const limit = 3;
    const { card, text, button } = useThemeStyles();

    const { data, isFetching, isLoading } = useGetAllProjectsQuery({ page, limit });

    if (isFetching || isLoading) {
        return (
            <div className={`flex min-h-[240px] items-center justify-center rounded-[28px] px-6 py-10 shadow-xl backdrop-blur-lg ${card}`}>
                <p className={`text-sm uppercase tracking-[0.28em] ${text.tertiary}`}>Loading...</p>
            </div>
        );
    }

    return data && (
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
            <button 
                onClick={() => setClick(true)}
                className={button.primary}
            >
                Create Project
            </button>
            {isClicked ? <CreateProjectForm onClose={() => setClick(false)} /> : ( <>
            <div className={card}>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className={`text-[10px] uppercase tracking-[0.28em] ${text.tertiary}`}>Workspace</p>
                        <h2 className={`text-xl font-semibold ${text.primary}`}>Projects</h2>
                    </div>
                    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-300">
                        {data.totalActive} active
                    </div>
                </div>

                <div className="space-y-4">
                    {data.projects.map((project: Project) => (
                        <ProjectCard key={project._id} project={project} />
                    ))}
                </div>
            </div>

            <div className={`flex flex-wrap items-center justify-center gap-3 rounded-[24px] px-4 py-4 shadow-lg backdrop-blur-lg ${card}`}>
                <button
                    className={button.secondary}
                    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                >
                    Back
                </button>
                <span className={`text-sm ${text.secondary}`}>page {page + 1} of {data.totalPages}</span>
                <button
                    className={button.primary}
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={page >= data.totalPages - 1}
                >
                    Next
                </button>
            </div> </>)
            }
        </div>
    );
};