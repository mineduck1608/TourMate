import React, { useState, type FC } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Calendar,
    MapPin,
    Star,
    User,
    StretchHorizontalIcon,
    MessageCircleMore,
    CalendarCheck,
    CalendarX,
    ChevronsUpDown,
} from "lucide-react";
import { getByAccountId } from "@/app/api/tour-guide.api";
import { useToken } from "@/components/getToken";
import { MyJwtPayload } from "@/types/JwtPayload";
import { jwtDecode } from "jwt-decode";
import { TourGuide } from "@/types/tour-guide";

type TourGuideSidebarProps = {
    onNavItemClick?: (label: string) => void;
};

const TourGuideSidebar: FC<TourGuideSidebarProps> = ({ onNavItemClick }) => {
    const [selectedNav, setSelectedNav] = useState("Chờ xác nhận");

    const token = useToken('accessToken')
        const payLoad: MyJwtPayload | undefined = token ? jwtDecode<MyJwtPayload>(token) : undefined
        const accountId = Number(payLoad?.AccountId)

    const [user, setUser] = useState<TourGuide>();

    React.useEffect(() => {
        if (!accountId) return;
        getByAccountId(accountId).then(setUser).catch(console.error);
    }, [accountId]);

    const navigationItems = [
        { label: "Chờ xác nhận", icon: Calendar },
        { label: "Lịch hẹn sắp tới", icon: CalendarCheck },
        { label: "Tour đã hướng dẫn", icon: MapPin },
        { label: "Từ chối", icon: CalendarX },
        { label: "Đánh giá nhận được", icon: Star },
    ];

    const actionCards = [
        { label: "Hồ sơ", icon: User, bgColor: "bg-red-500", href: "/tour-guide/profile" },
        { label: "Đấu giá", icon: StretchHorizontalIcon, bgColor: "bg-emerald-500", href: "/tour-guide/bids" },
        { label: "Tin nhắn", icon: MessageCircleMore, bgColor: "bg-blue-500", href: "/chat" },
    ];

    const labelToValueMap: Record<string, string> = {
        'Chờ xác nhận': 'Chờ xác nhận',
        'Lịch hẹn sắp tới': 'Sắp diễn ra',
        'Tour đã hướng dẫn': 'Đã hướng dẫn',
        'Từ chối': 'Từ chối',
    };


    return (
        <div className="w-full md:w-80 bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-gray-100 p-5 mb-4 md:mb-0 md:mx-0">
            {/* User */}
            <div className="flex items-center gap-4 mb-6 p-4 rounded-xl shadow-sm">
                <Avatar className="h-12 w-12 shadow-md">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="bg-blue-600 text-white font-semibold">TG</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-lg text-gray-900 truncate">{user?.fullName}</h2>
                    <p className="text-sm text-gray-500 truncate">{user?.account.email}</p>
                </div>
                <ChevronsUpDown className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>

            <div className="border-t border-gray-300 mb-6"></div>

            {/* Action Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                {actionCards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        title={card.label}
                        className={`${card.bgColor} rounded-lg flex flex-col items-center justify-center p-3 sm:p-4 cursor-pointer shadow-md border border-transparent transition transform hover:-translate-y-1 hover:shadow-lg`}
                    >
                        <card.icon className="h-7 w-7 text-white mb-1" />
                        <span className="text-xs font-semibold text-white text-center">{card.label}</span>
                    </Link>
                ))}
            </div>

            <div className="border-t border-gray-300 mb-6"></div>

            {/* Navigation Menu */}
            <nav className="flex flex-col space-y-2 mb-6">
                {navigationItems.map((item) => {
                    const isSelected = selectedNav === item.label;
                    return (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                                setSelectedNav(item.label);
                                const mappedValue = labelToValueMap[item.label] || item.label;
                                onNavItemClick?.(mappedValue);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg font-medium transition-colors duration-300
                ${isSelected
                                    ? "bg-blue-100 text-blue-700 border border-blue-400"
                                    : "text-gray-700 border border-transparent hover:border-gray-300 hover:bg-gray-100"}`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="border-t border-gray-300 mb-4"></div>
        </div>
    );
};

export default TourGuideSidebar;
