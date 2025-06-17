import { FileStorage } from "@/types/file"
import { createContext } from "react"

export type FileUploadContextProps = {
    file: FileStorage,
    setFile: (fs: FileStorage) => void,
    isUploading: boolean,
    setIsUploading: (isUploading: boolean) => void,
    currentProgress?: number,
    setCurrentProgress?: (progress: number) => void,
}

export const FileUploadContext = createContext<FileUploadContextProps | undefined>(undefined)