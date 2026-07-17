import { RefObject } from "react";
import { User } from "../../../../../types/types";
import { useSetPhotoMutation, useUpdateUserMutation } from "../../../authApi";

type HookProps = {
    setError: (s: string) => void,
    setChange: (b: boolean) => void,
    isImageChanged: boolean,
    file: RefObject<null | HTMLInputElement>,
    name: RefObject<null | HTMLSpanElement>,
    num: RefObject<null | HTMLSpanElement>,
    email: RefObject<null | HTMLSpanElement>,
    data: User
}

export const useHandleSaveChange = ({ setError, setChange, isImageChanged, file, data, name, num, email }: HookProps) => {
    const [setPhoto] = useSetPhotoMutation();
    const [setChangeOnUser] = useUpdateUserMutation();

    const isChangedImg = () => {
        const fileInput = file.current?.files?.[0];
        if (isImageChanged && fileInput) {
            const formData = new FormData();
            formData.append('avatar', fileInput);
            
            void setPhoto({ file: formData, id: data._id })
                .unwrap()
                .catch(err => setError(err.message || 'Ошибка загрузки фото'));
        }
    };

    return () => {
        const nameContent = name.current?.textContent || '';
        const emailContent = email.current?.textContent || '';
        const numContent = num.current?.textContent || '';
        
        const nameParts = nameContent.trim().split(' ').filter(Boolean);

        if (isImageChanged && !nameContent && !emailContent && !numContent) {
            isChangedImg();
            return;
        }

        let errorMsg = '';
        if (nameParts.length !== 2) errorMsg += 'invalid name? ';
        if (!emailContent.trim()) errorMsg += 'invalid email? ';
        if (!numContent.trim() || isNaN(Number(numContent))) errorMsg += 'invalid number? ';

        if (errorMsg) {
            setError(errorMsg.trim());
            return;
        }

        setError('');
        setChange(false);

        void setChangeOnUser({ 
            user: { 
                name: nameParts[0], 
                surname: nameParts[1], 
                email: emailContent, 
                phone: Number(numContent) 
            }, 
            id: data._id 
        })
        .unwrap()
        .then(() => {
            isChangedImg();
            localStorage.removeItem('token');
        })
        .catch(err => setError(err.message || 'Ошибка обновления данных'));
    };
};
