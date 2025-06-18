import React, { useContext } from 'react'
import { FileUploadContext, FileUploadContextProps } from './file-upload-context';
import { baseFileTemplate } from '@/types/file';
import SafeImage from '@/components/safe-image';
import { FileIcon } from 'lucide-react';

function FileUploadRender() {
    const { file, setFile, isUploading, currentProgress } = useContext(FileUploadContext) as FileUploadContextProps;
    return (
        <div>
            <div className={file.downloadUrl ? "flex items-center gap-2 p-2 border rounded bg-gray-50" : "hidden"}>
                {/* File icon */}
                {file.fileName && file.fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                    <SafeImage
                        src={file.downloadUrl}
                        alt={file.fileName}
                        style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4, border: "1px solid #eee" }}
                    />
                ) : (
                    // <svg width="28" height="32" viewBox="0 0 24 24" fill="#888">
                    //     <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.83A2 2 0 0 0 19.41 7.41l-4.83-4.83A2 2 0 0 0 13.17 2H6zm7 1.5V8a1 1 0 0 0 1 1h4.5L13 3.5z" />
                    // </svg>
                    <FileIcon/>
                )}
                {/* File name */}
                <a
                    href={file.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline font-medium"
                    style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    title={file.fileName}
                >
                    {file.fileName}
                </a>
                {/* Remove button */}
                <button
                    type="button"
                    aria-label="Remove file"
                    className="ml-2 text-gray-400 hover:text-red-500"
                    onClick={() => setFile({ ...baseFileTemplate })}
                    style={{ fontSize: 18, fontWeight: "bold", background: "none", border: "none", cursor: "pointer" }}
                >
                    ×
                </button>
            </div>
            <div className={isUploading ? "flex items-center gap-2 p-2 border rounded bg-gray-50" : "hidden"}>
                <p>Đang tải: {file.fileName} ({Number(currentProgress).toFixed(1)}%)</p>
            </div>
        </div>
    )
}

export default FileUploadRender
