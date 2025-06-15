import { storage } from "@/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { toast } from "react-toastify";
const MAX_FILE_SIZE = 512 * 1024; // 512 KB
interface FileUpload {
  onFileUpload: (imageUrl: string) => void;  // Callback to handle the image URL
}

const FileUpload: React.FC<FileUpload> = ({ onFileUpload }) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = (file: File) => {
    setError(null);

    if (file.size > MAX_FILE_SIZE) {
      setError("Kích thước file không được vượt quá 512 KB");
      return;
    }

    setIsUploading(true);
    setFileName(file.name);
    setFileType(file.type);
    handleUpload(file);
  };

  // Handle the actual upload and return the URL
  const handleUpload = async (file: File) => {
    try {
      const fileUrl = await uploadFile(file);
      onFileUpload(fileUrl);
      setFilePreview(fileUrl);
    } catch (err) {
      console.error("File upload failed:", err);
      setError("File upload failed");
      setIsUploading(false);
    }
  };

  // Upload image to Firebase Storage
  const uploadFile = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(storage, `tourmate/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          setIsUploading(false);
          toast.error("Image upload failed");
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
          
          setIsUploading(false);
          resolve(downloadURL);  // Resolve the promise with the download URL
        }
      );
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="upload-area hover:bg-gray-200"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        border: "2px dashed #ccc",
        borderRadius: "8px",
        padding: "40px",
        textAlign: "center",
        position: "relative",
        width: "100%",
        margin: "auto",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      }}
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <div>
        <p style={{ marginBottom: "10px", fontSize: "16px" }}>Tải file</p>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Bấm hoặc kéo thả để tải file lên (tối đa 512 KB)
        </p>
        {isUploading ? (
          // ...existing spinner code...
          <div style={{ marginTop: "30px", color: "#888" }}>
            <div role="status" className="flex items-center justify-center w-full h-full">
              {/* ...spinner SVG... */}
            </div>
          </div>
        ) : filePreview ? (
          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
            {/* File icon */}
            {fileType && fileType.startsWith("image/") ? (
              <img
                src={filePreview}
                alt="Preview"
                style={{
                  width: "48px",
                  height: "48px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #eee",
                }}
              />
            ) : (
              // Generic file icon SVG
              <svg width="40" height="48" viewBox="0 0 24 24" fill="#888">
                <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.83A2 2 0 0 0 19.41 7.41l-4.83-4.83A2 2 0 0 0 13.17 2H6zm7 1.5V8a1 1 0 0 0 1 1h4.5L13 3.5z" />
              </svg>
            )}
            {/* File name and link */}
            <a
              href={filePreview}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bff", fontWeight: 500, textDecoration: "underline" }}
            >
              {fileName}
            </a>
          </div>
        ) : (
          <p style={{ marginTop: "20px", color: "#999" }}>Chưa có file tải lên</p>
        )}

        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload"
        />
        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
