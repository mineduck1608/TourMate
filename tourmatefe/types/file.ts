export type FileStorage = {
    id: string;
    fileName: string,
    downloadUrl: string,
    uploadTime: string,
}

export const baseFileTemplate: FileStorage = {
    id: "",
    fileName: "",
    downloadUrl: "",
    uploadTime: "",
}