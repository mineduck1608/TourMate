import FileUpload from '@/components/file-upload'
import React from 'react'

interface Props {
    isOpen: boolean,
    onClose: () => void,
}

function FileUploadModal({ isOpen, onClose }: Props) {

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "block" : "hidden"}`}
        >
            <div
                className={`absolute inset-0 ${isOpen ? "block" : "hidden"}`}
                onClick={onClose}
            ></div>

            <div className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800 z-10 max-h-[900px] overflow-y-auto">
                <div className="relative justify-between items-center">
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={onClose}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <h3 className='text-center font-bold text-2xl mb-5'>Tải ảnh</h3>
                <FileUpload onFileUpload={(url => {
                    console.log("File uploaded:", url);
                })} />
                <div className="flex justify-center mt-5">
                    <button
                        type="submit"
                        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-700 disabled:hover:bg-gray-600"
                    >
                        Tải ảnh
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FileUploadModal
