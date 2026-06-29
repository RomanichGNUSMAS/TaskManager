import React from "react";
import ReactModal from "react-modal";
import { useDeleteProjectMutation } from "../../workManagementApi";


type Props = {
    setDeleteState: (arg:boolean) => void,
    id:string,
    token: string
}
export const DeletModal:React.FC<Props> = ({ setDeleteState,id,token }) => {
    const [deleteProject] = useDeleteProjectMutation()

    const handleDelete = () => {
        void deleteProject({ token, id })
            .unwrap()
            .then(res => {
                console.log('deleted successfully')
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setDeleteState(false);
            })
    } 
    return (
        <div>
            <ReactModal
                isOpen={true}
                onRequestClose={() => setDeleteState(false)}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(2, 8, 23, 0.75)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 50,
                        padding: '16px',
                    },
                    content: {
                        backgroundColor: 'rgb(15, 23, 42)',
                        border: '1px solid rgba(71, 85, 105, 0.7)',
                        borderRadius: '28px',
                        padding: '32px',
                        maxWidth: '420px',
                        width: '100%',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                        position: 'relative',
                        top: 'auto',
                        left: 'auto',
                        right: 'auto',
                        bottom: 'auto',
                    },
                }}
            >
                <h1 className="text-xl font-semibold text-white mb-2">Delete Project?</h1>
                <p className="text-sm text-slate-400 mb-6">This action cannot be undone. Are you sure?</p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setDeleteState(false)}
                        className="flex-1 rounded-2xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="flex-1 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            </ReactModal>
        </div>
    )
}