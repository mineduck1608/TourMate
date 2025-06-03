import React, { useContext } from 'react'
import { BidTaskContext, BidTaskContextProp } from './bid-task-context'
import { cn } from '@/lib/utils'

interface Props {
    isOpen: boolean,
    onClose: () => void,
}

function ChangeStatusModal(props: Props) {
    const { isOpen, onClose } = props
    const { target, setTarget, setSignal, signal } = useContext(BidTaskContext) as BidTaskContextProp
    const isOngoing = target.status === 'Hoạt động'
    const title = (isOngoing ? 'Chấm dứt' : 'Kích hoạt lại') + ' cuộc đấu giá này?'
    const content = 'Bạn có muốn ' + (isOngoing ? 'chấm dứt' : 'kích hoạt lại') + ' cuộc đấu giá này không?'
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "block" : "hidden"
                }`}
        >
            <div
                className={`absolute inset-0 bg-black opacity-50 ${isOpen ? "block" : "hidden"
                    }`}
                onClick={onClose}
            ></div>

            <div className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800 z-10 max-h-[600px] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
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
                <p className='text-center'>{content}</p>
                <div className='mt-4 flex justify-evenly'>
                    <button
                        onClick={() => {
                            const u = { ...target }
                            u.status = isOngoing ? 'Chấm dứt' : 'Hoạt động'
                            setTarget(u)
                            setSignal({ ...signal, edit: true})
                            onClose()
                        }}
                        className={cn('text-white  focus:ring-4  font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer',
                            isOngoing ? 'bg-red-700 hover:bg-red-800 focus:ring-red-300' : 'bg-green-700 hover:bg-green-800 focus:ring-green-300'
                        )}>
                        {isOngoing ? 'Chấm dứt' : 'Kích hoạt lại'}
                    </button>
                    <button
                        onClick={onClose}
                        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer'>
                        Trở lại
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChangeStatusModal
