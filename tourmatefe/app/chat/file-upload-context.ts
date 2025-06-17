import { FileStorage } from "@/types/file"
import { createContext } from "react"

export type FileUploadContextProps = {
    file: FileStorage,
    setFile: (fs: FileStorage) => void
}

export const FileUploadContext = createContext<FileUploadContextProps | undefined>(undefined)