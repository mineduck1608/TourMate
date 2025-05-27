// components/PdfUploader.tsx
import React, { useState, useRef } from "react";
import { storage } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface PdfUploaderProps {
  onUpload: (url: string) => void;
  className?: string;
  pdfUrl?: string; // Thêm prop này
}

const PdfUploader: React.FC<PdfUploaderProps> = ({
  onUpload,
  className,
  pdfUrl,
}) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Vui lòng chọn tệp PDF hợp lệ");
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(storage, `pdfs/${file.name}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUpload(url);
    } catch (err) {
      console.error("Lỗi khi upload PDF:", err);
      alert("Upload thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onClick={handleClick}
        className={`cursor-pointer border-2 border-dashed border-gray-400 rounded-lg p-6 text-center hover:border-blue-500 transition-colors ${
          uploading ? "opacity-50 pointer-events-none" : ""
        }`}
        style={{ position: "relative" }}
      >
        {uploading ? (
          <p className="text-gray-500">Đang tải lên...</p>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            width="100%"
            height="400px"
            style={{ border: "1px solid #ccc", borderRadius: 8 }}
          />
        ) : (
          <p className="text-gray-700">📄 Click để tải lên PDF</p>
        )}
      </div>
    </div>
  );
};

export default PdfUploader;
