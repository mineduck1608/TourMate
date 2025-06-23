"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Logo from "@/public/Logo.png"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RoleSelectionModal } from "@/components/role-selection-modal"
import ActionMenu from "./action-menu"
import { getUserRole } from "./getToken"
import { Menu, X, ChevronDown } from "lucide-react"

const MegaMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const currentRoute = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState<string | null>("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  useEffect(() => {
    setIsMounted(true)

    const storedToken = sessionStorage.getItem("accessToken")
    setToken(storedToken)
    if (storedToken) {
      const userRole = getUserRole(storedToken)
      setRole(userRole)
    }
  }, [])

  const handleUnauthorizedAccess = (e: React.MouseEvent, service: string) => {
    e.preventDefault()
    alert(`Vui lòng đăng nhập để sử dụng dịch vụ ${service}`)
  }

  if (!isMounted) return null

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-20 relative">
          {/* Logo - positioned absolutely to the left */}
          <Link href="/" className="absolute left-0 flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src={Logo || "/placeholder.svg"}
                className="h-16 w-16 transition-transform group-hover:scale-105"
                alt="TourMate Logo"
              />
            </div>
          </Link>

          {/* Desktop Navigation - centered */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentRoute === "/"
                  ? "text-blue-600 bg-blue-50 shadow-sm"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Trang chủ
            </Link>
            <Link
              href="/aboutUs"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentRoute === "/aboutUs"
                  ? "text-blue-600 bg-blue-50 shadow-sm"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Về chúng tôi
            </Link>
            <Link
              href="/news"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentRoute === "/news"
                  ? "text-blue-600 bg-blue-50 shadow-sm"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Tin tức
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentRoute.startsWith("/services/")
                    ? "text-blue-600 bg-blue-50 shadow-sm"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Dịch vụ
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-6 z-50">
                  <div className="px-6 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Dịch vụ cơ bản</h3>
                    <p className="text-sm text-gray-500">Khám phá các dịch vụ du lịch tuyệt vời</p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 px-6">
                    <Link
                      href="/services/active-area"
                      className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600">Địa điểm hoạt động</div>
                        <div className="text-sm text-gray-500">Khám phá các điểm đến hấp dẫn</div>
                      </div>
                    </Link>

                    <Link
                      href="/services/tour-guide"
                      className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600">Hướng dẫn viên</div>
                        <div className="text-sm text-gray-500">Kết nối với guide chuyên nghiệp</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Chat - Main Navigation */}
            {token ? (
              <Link
                href="/chat"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentRoute === "/chat"
                    ? "text-blue-600 bg-blue-50 shadow-sm"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Tin nhắn
              </Link>
            ) : (
              <button
                onClick={(e) => handleUnauthorizedAccess(e, "tin nhắn")}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
              >
                Tin nhắn
              </button>
            )}

            {/* Bidding - Main Navigation */}
            {token ? (
              <Link
                href={`/${role === "TourGuide" ? "tour-guide" : "services"}/bids`}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentRoute.includes("/bids")
                    ? "text-blue-600 bg-blue-50 shadow-sm"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Đấu giá
              </Link>
            ) : (
              <button
                onClick={(e) => handleUnauthorizedAccess(e, "đấu giá tour")}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
              >
                Đấu giá
              </button>
            )}

            <Link
              href="/contact"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentRoute === "/contact"
                  ? "text-blue-600 bg-blue-50 shadow-sm"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Liên hệ
            </Link>
          </div>

          {/* Auth Buttons - positioned absolutely to the right */}
          <div className="absolute right-0 hidden lg:flex items-center space-x-3">
            {token ? (
              <ActionMenu />
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors rounded-xl hover:bg-gray-50"
                >
                  Đăng nhập
                </Link>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Đăng ký
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button - positioned absolutely to the right */}
          <button
            onClick={toggleMobileMenu}
            className="absolute right-0 lg:hidden p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="space-y-2">
              <Link
                href="/"
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  currentRoute === "/"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Trang chủ
              </Link>
              <Link
                href="/aboutUs"
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  currentRoute === "/aboutUs"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Về chúng tôi
              </Link>
              <Link
                href="/news"
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  currentRoute === "/news"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Tin tức
              </Link>

              {/* Mobile Services */}
              <div className="px-4 py-2">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">Dịch vụ</h4>
                <div className="space-y-1 ml-4">
                  <Link
                    href="/services/active-area"
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    Địa điểm hoạt động
                  </Link>
                  <Link
                    href="/services/tour-guide"
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    Hướng dẫn viên
                  </Link>
                </div>
              </div>

              {/* Mobile Chat */}
              {token ? (
                <Link
                  href="/chat"
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    currentRoute === "/chat"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Tin nhắn
                </Link>
              ) : (
                <button
                  onClick={(e) => handleUnauthorizedAccess(e, "tin nhắn")}
                  className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 w-full text-left"
                >
                  Tin nhắn
                </button>
              )}

              {/* Mobile Bidding */}
              {token ? (
                <Link
                  href={`/${role === "TourGuide" ? "tour-guide" : "services"}/bids`}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    currentRoute.includes("/bids")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Đấu giá Tour
                </Link>
              ) : (
                <button
                  onClick={(e) => handleUnauthorizedAccess(e, "đấu giá tour")}
                  className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 w-full text-left"
                >
                  Đấu giá Tour
                </button>
              )}

              <Link
                href="/contact"
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  currentRoute === "/contact"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Liên hệ
              </Link>

              {!token && (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    href="/login"
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
                  >
                    Đăng nhập
                  </Link>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3"
                  >
                    Đăng ký
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <RoleSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  )
}

export default MegaMenu
