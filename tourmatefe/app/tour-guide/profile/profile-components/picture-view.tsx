import SafeImage from '@/components/safe-image';
import React from 'react'

interface Props {
    img: string,
    isOpen: boolean,
    onClose: () => void,
}

function PictureView({ img, isOpen, onClose }: Props) {

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "block" : "hidden"}`}
        >
            <div
                className={`absolute inset-0 ${isOpen ? "block" : "hidden"}`}
                onClick={onClose}
            ></div>

            <div className="relative p-4 w-full h-full bg-[rgba(0,0,0,0.5)] z-10 overflow-y-hidden">
                <div className="absolute justify-between items-center pb-4 mb-4">
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={onClose}
                    >
                        <svg
                            className="w-10 h-10"
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
                <div className='opacity-100 flex justify-center items-center w-full h-full'>
                    <SafeImage src={img} className='max-w-[80%] max-h-[80%]' />
                </div>
            </div>
        </div>
    );
}

export default PictureView
