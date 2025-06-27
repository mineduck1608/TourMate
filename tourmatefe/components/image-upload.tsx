import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SafeImage from "./safe-image";

interface ImageUploadProps {
  onCompleteImageUpload: (imageUrl: string) => void;
  onImmediateChange?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onCompleteImageUpload, onImmediateChange }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const allowedTypes = ["image/svg+xml", "image/png", "image/jpeg", "image/gif"];

  const handleFile = (file: File) => {
    if (allowedTypes.includes(file.type)) {
      setError(null);
      setIsUploading(true);
      handleUpload(file);
    } else {
      setError("Invalid file type");
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file);
      onCompleteImageUpload(imageUrl);
      setImagePreview(imageUrl);
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Image upload failed");
      setIsUploading(false);
    }
  };

  const uploadImage = async (file: File) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("folder", "/tourmate"); // tùy chọn

      console.log("123")
      console.log("KEY:", process.env.IMAGEKIT_PRIVATE_KEY); // thấy được

       const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
          const auth = `Basic ${btoa(privateKey + ":")}`;

          const response = await axios.post(
            "https://upload.imagekit.io/api/v1/files/upload",
            formData,
            {
              headers: {
                Authorization: auth,
              },
            }
          );

      const imageUrl = response.data.url;
      setIsUploading(false);
      resolve(imageUrl);
    } catch (error) {
      setIsUploading(false);
      toast.error("Image upload failed");
      reject(error);
    }
  });
};


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onImmediateChange) {
      onImmediateChange();
    }
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
        <p style={{ marginBottom: "10px", fontSize: "16px" }}>Tải ảnh lên</p>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Bấm hoặc kéo thả để tải ảnh lên. SVG, PNG, JPG, hoặc GIF
        </p>

        {isUploading ? (
          <div style={{ marginTop: "30px", color: "#888" }}>
            <div role="status" className="flex items-center justify-center w-full h-full">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591..."
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038..."
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Đang tải...</span>
            </div>
          </div>
        ) : imagePreview ? (
          <SafeImage
            src={imagePreview}
            alt="Preview"
            style={{
              width: "100%",
              height: "auto",
              marginTop: "20px",
              borderRadius: "8px",
            }}
          />
        ) : (
          <p style={{ marginTop: "20px", color: "#999" }}>Chưa có ảnh tải lên</p>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="file-upload"
        />
        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ImageUpload;
