import React, { useContext } from 'react'
import { FileUploadContext, FileUploadContextProps } from './file-upload-context';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/firebaseConfig';
import { baseFileTemplate } from '@/types/file';
const MAX_FILE_SIZE = 128 * 1024 * 1024; // 128MB
function OtherButtons() {
    const { setFile, setIsUploading, setCurrentProgress, isUploading } = useContext(FileUploadContext) as FileUploadContextProps;
    async function handleFileUpload(file: File) {
        // Empty function for now
        const fileUrl = await uploadFile(file);
        setFile({
            downloadUrl: fileUrl,
            fileName: file.name,
            id: "",
            uploadTime: new Date().toISOString(),
        })
        setIsUploading(false); // Reset uploading state after upload
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                toast.error("Kích thước file không được vượt quá 128 MB");
                return;
            }
            setFile({ ...baseFileTemplate, fileName: file?.name ?? '' }); // Reset file state before upload
            handleFileUpload(file);
        }
    };
    const uploadFile = async (file: File) => {
        setIsUploading(true); // Set uploading state to true
        return new Promise<string>((resolve, reject) => {
            const storageRef = ref(storage, `tourmate/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setCurrentProgress?.(progress); // Update progress if function exists
                },
                (error) => {
                    toast.error("Tải file thất bại");
                    reject(error);
                    setIsUploading(false); // Reset uploading state on error
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);  // Resolve the promise with the download URL
                }
            );
        });
    };
    return (
        <label className='cursor-pointer disabled:cursor-default' style={{ display: "inline-flex", alignItems: "center" }}>
            {/* Messenger file upload icon */}
            <svg className={`${!isUploading ? 'fill-blue-600' : 'fill-gray-600'}`} height="28px" viewBox="0 0 36 36" width="28px">
                <path d="M13.5 16.5a2 2 0 100-4 2 2 0 000 4z" fill="var(--chat-composer-button-color)"></path>
                <path clip-rule="evenodd" d="M7 12v12a4 4 0 004 4h14a4 4 0 004-4V12a4 4 0 00-4-4H11a4 4 0 00-4 4zm18-1.5H11A1.5 1.5 0 009.5 12v9.546a.25.25 0 00.375.217L15 18.803a6 6 0 016 0l5.125 2.96a.25.25 0 00.375-.217V12a1.5 1.5 0 00-1.5-1.5z" fill="var(--chat-composer-button-color)" fill-rule="evenodd"></path>
            </svg>
            <input
                type="file"
                disabled={isUploading}
                onChange={onChange}
                style={{ display: "none" }}
            />
        </label>
    );
}

export default OtherButtons
