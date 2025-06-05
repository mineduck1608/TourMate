import React, { useState, type FC } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Calendar,
    MapPin,
    Star,
    LogOut,
    User,
    StretchHorizontalIcon,
    MessageCircleMore,
    CalendarCheck,
    CalendarX,
    ChartAreaIcon,
    ChevronsUpDown,
} from "lucide-react";
import { useToken } from "@/components/getToken";
import { MyJwtPayload } from "@/types/JwtPayload";
import { jwtDecode } from "jwt-decode";
import { getCustomerWithAcc } from "../api/customer.api";
import { Customer } from "@/types/customer";

type CustomerSidebarProps = {
    onNavItemClick?: (label: string) => void;
};

const  CustomerSidebar: FC<CustomerSidebarProps> = ({ onNavItemClick }) => {
    const router = useRouter();
    const [selectedNav, setSelectedNav] = useState("Chờ xác nhận");

    const token = useToken('accessToken')
        const payLoad: MyJwtPayload | undefined = token ? jwtDecode<MyJwtPayload>(token) : undefined
        const accountId = Number(payLoad?.AccountId)

    const [user, setUser] = useState<Customer>();
    console.log(user)

    React.useEffect(() => {
        if (!accountId) return;
        getCustomerWithAcc(accountId).then(setUser).catch(console.error);
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
        { label: "Đấu giá", icon: StretchHorizontalIcon, bgColor: "bg-emerald-500", href: "/tour-guide/bid" },
        { label: "Tin nhắn", icon: MessageCircleMore, bgColor: "bg-blue-500", href: "/chat" },
    ];

    return (
        <div className="w-100 bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-gray-100 p-6">
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
            <div className="grid grid-cols-3 gap-4 mb-6">
                {actionCards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        title={card.label}
                        className={`${card.bgColor} rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer shadow-md border border-transparent transition transform hover:-translate-y-1 hover:shadow-lg`}
                    >
                        <card.icon className="h-7 w-7 text-white mb-1" />
                        <span className="text-xs font-semibold text-white">{card.label}</span>
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
                                onNavItemClick?.(item.label);
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

            {/* Extra */}
            <div className="space-y-2">
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 border border-transparent hover:border-gray-300 hover:bg-gray-100 transition-colors duration-300 font-medium"
                    type="button"
                    onClick={() => router.push("/tour-guide/statistics")}
                >
                    <ChartAreaIcon className="h-5 w-5" />
                    <span>Thống kê</span>
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 border border-transparent hover:border-gray-300 hover:bg-gray-100 hover:text-red-700 transition-colors duration-300 font-medium"
                    type="button"
                    onClick={() => {
                        console.log("Logout");
                    }}
                >
                    <LogOut className="h-5 w-5" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default CustomerSidebar;
