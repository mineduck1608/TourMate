import { storage } from "@/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;  // Callback to handle the image URL
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null); 
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); 

  // Allowed file types
  const allowedTypes = [
    "image/svg+xml",
    "image/png",
    "image/jpeg",
    "image/gif",
  ];

  const handleFile = (file: File) => {
    if (allowedTypes.includes(file.type)) {
      setError(null);
      setIsUploading(true);  // Start uploading
      handleUpload(file);  // Upload image after selection
    } else {
      setError("Invalid file type");
    }
  };

  // Handle the actual upload and return the URL
  const handleUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file);  // Get the download URL
      onImageUpload(imageUrl);  // Pass the URL to the parent component
      setImagePreview(imageUrl);  // Preview image
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Image upload failed");
      setIsUploading(false);
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (file: File) => {
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
          setIsUploading(false);
          resolve(downloadURL);  // Resolve the promise with the download URL
        }
      );
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        padding: "40px", // Increased padding to make it larger
        textAlign: "center",
        position: "relative",
        width: "100%", // Adjust width as needed
        margin: "auto",
        cursor: "pointer",
        transition: "background-color 0.3s ease", // Transition for smooth hover effect
      }}
      onClick={() => document.getElementById("file-upload")?.click()} // Click anywhere in the area to open file dialog
    >
      <div>
        <p style={{ marginBottom: "10px", fontSize: "16px" }}>Tải ảnh lên</p>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Bấm hoặc kéo thả để tải ảnh lên. SVG, PNG, JPG, hoặc GIF
        </p>
        {isUploading ? (
  // Hiển thị spinner khi tải lên
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
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Đang tải...</span>
    </div>
  </div>
) : imagePreview ? (
  // Hiển thị ảnh sau khi tải lên
  <Image
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
  // Hiển thị thông báo nếu không có ảnh
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
