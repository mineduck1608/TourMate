import type { FC } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  MapPin,
  Star,
  LogOut,
  User,
  Gift,
  Wallet,
  ChevronsUpDown,
  NewspaperIcon,
  LandPlotIcon,
  ChartAreaIcon,
  History,
  Map,
  MapPlus,
  CircleX,
} from "lucide-react"

interface TourSidebarProps {
  role: "tourGuide" | "customer"
}

const TourSidebar: FC<TourSidebarProps> = ({ role }) => {
  const tourGuideItems = [
    { label: "Lịch hẹn của tôi", icon: Calendar },
    { label: "Tour đã hướng dẫn", icon: MapPin },
    { label: "Đánh giá nhận được", icon: Star },
  ]

  const customerItems = [
    { label: "Chờ xác nhận", icon: MapPlus },
    { label: "Chuyến đi sắp tới", icon: Map },
    { label: "Lịch sử chuyến đi", icon: History},
    { label: "Đã từ chối", icon: CircleX },
  ]

  const actionCards =
    role === "tourGuide"
      ? [
        { label: "Hồ sơ", icon: User, bgColor: "bg-red-500" },
        { label: "Thu nhập", icon: Wallet, bgColor: "bg-emerald-500" },
        { label: "Thưởng", icon: Gift, bgColor: "bg-purple-500" },
      ]
      : [
        { label: "Tin tức", icon: NewspaperIcon, bgColor: "bg-blue-500" },
        { label: "Địa điểm", icon: LandPlotIcon, bgColor: "bg-emerald-500" },
        { label: "TourGuide", icon: User, bgColor: "bg-purple-500" },
      ]

  const navigationItems = role === "tourGuide" ? tourGuideItems : customerItems

  return (
    <div className="w-100 bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-gray-100 p-6">
      {/* User Profile */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded-xl shadow-sm">
        <Avatar className="h-12 w-12 shadow-md">
          <AvatarImage src="/placeholder.svg?height=48&width=48" />
          <AvatarFallback className="bg-blue-600 text-white font-semibold">
            {role === "tourGuide" ? "TG" : "KH"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-lg text-gray-900 truncate">
            {role === "tourGuide" ? "Nguyễn Văn A (Hướng dẫn viên)" : "Trần Thị B (Khách hàng)"}
          </h2>
          <p className="text-sm text-gray-500 truncate">user@example.com</p>
        </div>
        <ChevronsUpDown className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 mb-6"></div>

      {/* Action Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {actionCards.map((card) => (
          <div
            key={card.label}
            className={`${card.bgColor} rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer shadow-md border border-transparent transition transform hover:-translate-y-1 hover:shadow-lg `}
            title={card.label}
          >
            <card.icon className="h-7 w-7 text-white mb-1" />
            <span className="text-xs font-semibold text-white">{card.label}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 mb-6"></div>

      {/* Navigation Menu */}
      <nav className="flex flex-col space-y-2 mb-6">
        {navigationItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-gray-700 border border-transparent hover:border-gray-300 hover:bg-gray-100 transition-colors duration-300 font-medium"
            type="button"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-300 mb-4"></div>

      <div className="space-y-2">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 border border-transparent hover:border-gray-300 hover:bg-gray-100 transition-colors duration-300 font-medium"
          type="button"
        >
          <ChartAreaIcon className="h-5 w-5" />
          <span>Thống kê</span>
        </button>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 border border-transparent hover:border-gray-300 hover:bg-gray-100 hover:text-red-700 transition-colors duration-300 font-medium"
          type="button"
        >
          <LogOut className="h-5 w-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}

export default TourSidebar
