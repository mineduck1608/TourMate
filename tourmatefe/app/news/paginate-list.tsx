import React from 'react'

export type PaginationProps = {
    current: number,
    maxPage: number
}

export default function PaginateList({ current, maxPage }: PaginationProps) {

    return (
        <nav aria-label="Page navigation example">
            <ul className="inline-flex -space-x-px text-base h-10">
                <li>
                    <a href="#" className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                </li>
                {
                    Array.from({ length: maxPage }).map((_, i) => {
                        const adjusted = i + 1
                        const isCurrent = current === adjusted
                        return (
                        <li key={adjusted}>
                            <a href="#"
                                className={"flex items-center justify-center px-4 h-10 leading-tight text-gray-500  border border-gray-300  hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    + ` ${isCurrent ? 'bg-blue-100 ' : 'bg-white hover:bg-gray-100'}`
                                }>
                                {adjusted}
                            </a>
                        </li>
                    )})
                }
                <li>
                    <a href="#" className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                </li>
            </ul>
        </nav>
    )
}
