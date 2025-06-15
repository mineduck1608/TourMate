import { Plus, ImageIcon, MessageSquare, FileVideo } from 'lucide-react'
import React from 'react'
import FileUploadModal from './file-upload-modal';
function OtherButtons() {
    const [modalOpen, setModalOpen] = React.useState({
        file: false,
        image: false,
        video: false,
    });
    return (
        <div>
            <div className="flex gap-2 mr-2">
                <button
                    className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                    title="Thêm"
                    type="button"
                >
                    <Plus className="w-5 h-5 text-blue-600" />
                </button>
                <button
                    className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                    title="Gửi file"
                    type="button"
                    onClick={() => setModalOpen((prev) => ({ ...prev, file: true }))}
                >
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                </button>
                <button
                    className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                    title="Gửi tin nhắn nhanh"
                    type="button"
                >
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                </button>
                <button
                    className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                    title="Gửi video"
                    type="button"
                >
                    <FileVideo className="w-5 h-5 text-blue-600" />
                </button>
            </div>
            {modalOpen.file && (
                <FileUploadModal isOpen onClose={() => setModalOpen((prev) => ({ ...prev, file: false }))} />
            )}
        </div>
    )
}

export default OtherButtons
