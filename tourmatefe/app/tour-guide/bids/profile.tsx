import SafeImage from "@/components/safe-image"
import type { TourGuide } from "@/types/tour-guide"
import Link from "next/link"
import type { JSX } from "react"
import { FaRegComment, FaRegMap, FaRegNewspaper, FaRegUser } from "react-icons/fa"

export default function Profile({ tourGuide }: { tourGuide?: TourGuide }) {
    const tags: { icon: JSX.Element; title: string; link: string }[] = [
        {
            icon: <FaRegUser />,
            title: "Tìm Tour guide",
            link: "/services/tour-guide",
        },
        {
            icon: <FaRegComment />,
            title: "Tin nhắn",
            link: "/chat",
        },
        {
            icon: <FaRegMap />,
            title: "Địa điểm",
            link: "/services/active-area",
        },
        {
            icon: <FaRegNewspaper />,
            title: "Tin tức",
            link: "/news",
        },
    ]

    return (
        <div className="rounded-md border shadow-lg bg-white">
            <UserRender tourGuide={tourGuide} />
            <div className="mx-3 mb-5">
                {tags.map((tag) => (
                    <Link
                        key={tag.title}
                        href={tag.link}
                        className="flex items-center px-3 py-3 hover:bg-gray-100 hover:font-semibold cursor-pointer transition-colors duration-200 rounded-md mx-1 my-1"
                    >
                        <span className="mr-3 text-gray-600">{tag.icon}</span>
                        <span className={`text-sm md:text-base ${tag.link.length === 0 ? "text-red-500" : "text-gray-700"}`}>
                            {tag.title}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

function UserRender({ tourGuide }: { tourGuide?: TourGuide }) {
    return (
        <div className="px-4 md:px-6 pt-5 pb-3">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-5">
                <div className="flex-shrink-0 self-center sm:self-start">
                    <SafeImage
                        src={tourGuide?.image}
                        className="w-16 h-16 md:w-[75px] md:h-[75px] rounded-full object-cover aspect-square"
                        alt={"profile"}
                    />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="text-xl md:text-2xl font-medium leading-tight">Cá nhân</h4>
                    <div className="text-sm md:text-base text-gray-700 break-words">{tourGuide?.fullName}</div>
                    <div className="text-sm md:text-base text-gray-600 break-words">{tourGuide?.account?.email}</div>
                </div>
            </div>
        </div>
    )
}
