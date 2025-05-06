import React, { useState } from "react";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Allowed file types
  const allowedTypes = [
    "image/svg+xml",
    "image/png",
    "image/jpeg",
    "image/gif",
  ];

  const handleFile = (file: File) => {
    if (allowedTypes.includes(file.type)) {
      setImagePreview(URL.createObjectURL(file));
      setError(null);
      handleUpload(file); // Automatically upload image after selection
    } else {
      setError("Invalid file type");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) handleFile(file);
  };

  const handleUpload = async (file: File) => {
    // Simulate an upload (replace this with actual upload logic to Firebase or a server)
    setTimeout(() => {
      const imageUrl = URL.createObjectURL(file); // Here, replace with actual image URL from the server
      onImageUpload(imageUrl);
    }, 2000);
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
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              width: "100%",
              height: "auto",
              marginTop: "20px",
              borderRadius: "8px",
            }}
          />
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
