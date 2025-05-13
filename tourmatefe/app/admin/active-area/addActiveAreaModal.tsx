import dynamic from "next/dynamic";
import React, { useState, useRef, forwardRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebaseConfig"; // Import cấu hình Firebase

// Dynamically import ReactQuill with no SSR (Server-Side Rendering)
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false, // Disable SSR for this component
});

import "react-quill-new/dist/quill.snow.css";
import { ActiveArea } from "@/types/active-area";
import ImageUpload from "@/components/image-upload";

// Create a wrapper to forward the ref to ReactQuill
// eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
const QuillEditor = forwardRef((props: any, ref: React.Ref<any>) => (
  <ReactQuill {...props} ref={ref} />
));

type AddActiveAreaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activeAreaData: ActiveArea) => void;
};

const AddActiveAreaModal: React.FC<AddActiveAreaModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ActiveArea>({
    areaId: 0,
    areaName: "",
    areaTitle: "",
    areaSubtitle: "",
    areaContent: "",
    bannerImg: "",
    areaType: "Miền Bắc",
    createdAt: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null);

  const handleImageUpload = (file: File) => {
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (error) => {
        console.error("Error uploading image:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const range = quillRef.current.getEditor().getSelection();
          quillRef.current.getEditor().insertEmbed(range.index, "image", downloadURL);
        });
      }
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, areaContent: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      areaId: 0,
      areaName: "",
      areaTitle: "",
      areaSubtitle: "",
      areaContent: "",
      bannerImg: "",
      areaType: "Miền Bắc",
      createdAt: "",
    });
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "block" : "hidden"}`}
    >
      <div
        className={`absolute inset-0 bg-black opacity-50 ${isOpen ? "block" : "hidden"}`}
        onClick={onClose}
      ></div>

      <div className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800 z-10 max-h-[600px] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thêm địa điểm mới</h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="areaName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Địa điểm
              </label>
              <input
                type="text"
                name="areaName"
                id="areaName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Nhập địa điểm"
                value={formData.areaName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="areaType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Khu vực
              </label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => setFormData({ ...formData, areaType: e.target.value })}
                value={formData.areaType}
              >
                <option value="Miền Bắc">Miền Bắc</option>
                <option value="Miền Trung">Miền Trung</option>
                <option value="Miền Nam">Miền Nam</option>
                <option value="Miền Tây">Miền Tây</option>
              </select>
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="areaTitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tiêu đề
              </label>
              <input
                type="text"
                name="areaTitle"
                id="areaTitle"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Nhập tiêu đề"
                value={formData.areaTitle}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="areaSubtitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tiêu đề phụ
              </label>
              <input
                type="text"
                name="areaSubtitle"
                id="areaSubtitle"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Nhập tiêu đề phụ"
                value={formData.areaSubtitle}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="bannerImg" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tải ảnh banner
              </label>
              <ImageUpload
                onImageUpload={(url: string) => setFormData((prev) => ({ ...prev, bannerImg: url }))}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="areaContent" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nội dung
              </label>
              <QuillEditor
  ref={quillRef}
  value={formData.areaContent || ""}
  onChange={handleEditorChange}
  theme="snow"
  modules={{
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      [
        {
          tooltip: "Upload Image",
          action: () => {
            // Tạo một input file để người dùng có thể chọn ảnh
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*"; // Chỉ cho phép chọn file ảnh
            input.click(); // Mở hộp thoại chọn file
        
            // Lắng nghe sự kiện khi người dùng chọn file
            input.onchange = (event) => {
              const file = (event.target as HTMLInputElement)?.files?.[0];
              if (file) {
                // Nếu file hợp lệ, bắt đầu tải ảnh lên Firebase
                handleImageUpload(file);
              }
            };
          },
        }        
      ],
    ],
  }}
  placeholder="Nhập nội dung tin tức..."
  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
/>

            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Thêm tin tức
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActiveAreaModal;
