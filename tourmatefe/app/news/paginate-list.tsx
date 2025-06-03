import React from 'react'

export type PaginationProps = {
    current: number,
    maxPage: number,
    onClick: (page: number) => void
}

export default function PaginateList({ current, maxPage, onClick }: PaginationProps) {

    return (
        <nav aria-label="Page navigation example">
            <div className="flex justify-center items-center mt-10 space-x-6">
                <button
                    onClick={() => onClick(current - 1)}
                    disabled={current === 1}
                    className="px-3 py-1.5 lg:px-6 lg:py-3 border rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition duration-200"
                >
                    Trang trước
                </button>
                <span className="text-lg text-gray-700 font-semibold">
                    Trang {current} / {maxPage}
                </span>
                <button
                    onClick={() => onClick(current + 1)}
                    disabled={current === maxPage || maxPage === 0}
                    className="px-3 py-1.5 lg:px-6 lg:py-3 border rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition duration-200"
                >
                    Trang sau
                </button>
            </div>
        </nav>
    )
}
