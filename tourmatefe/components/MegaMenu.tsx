"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Correct import for App Directory
import Image from "next/image";
import Logo from "@/public/Logo.png";
import "flowbite";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoleSelectionModal } from "@/components/role-selection-modal";

const MegaMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const currentRoute = usePathname();
  const [isOpen, setIsOpen] = useState(false); // State để theo dõi việc mở dropdown

  // Hàm toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Set the mounted state to true after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Render nothing while waiting for the component to mount
  }

  return (
    <nav className="bg-white border-gray-200">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image src={Logo} className="h-30 w-30" alt="Flowbite Logo" />
        </Link>
        <div className="flex items-center md:order-2 space-x-1 md:space-x-2 rtl:space-x-reverse">
          <Link
            href="/login"
            className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none"
          >
            Login
          </Link>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer"
          >
            Sign up
          </Button>
          <button
            data-collapse-toggle="mega-menu-icons"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="mega-menu-icons"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          id="mega-menu-icons"
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        >
          <ul className="flex flex-col mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse">
            <li>
              <Link
                href="/"
                className={`block py-2 px-3 ${
                  currentRoute === "/" ? "text-blue-600" : "text-gray-900"
                } border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0`}
                aria-current={currentRoute === "/" ? "page" : undefined}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                href="/aboutUs"
                className={`block py-2 px-3 ${
                  currentRoute === "/aboutUs"
                    ? "text-blue-600"
                    : "text-gray-900"
                } border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0`}
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                href="/news"
                className={`block py-2 px-3 ${
                  currentRoute === "/news" ? "text-blue-600" : "text-gray-900"
                } border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0`}
              >
                Tin tức
              </Link>
            </li>
            <li>
              <button
                id="mega-menu-icons-dropdown-button"
                onClick={toggleDropdown}
                className={`flex items-center justify-between w-full py-2 px-3 font-medium ${
                  currentRoute.startsWith("/services/")
                    ? "text-blue-600"
                    : "text-gray-900"
                } border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0`}
              >
                Dịch vụ
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                id="mega-menu-icons-dropdown"
                className={`absolute z-10 grid ${
                  isOpen ? "block" : "hidden"
                } w-auto grid-cols-2 text-sm bg-white border border-gray-100 rounded-lg shadow-md md:grid-cols-2`}
              >
                <div className="p-4 pb-0 text-gray-900 md:pb-4">
                  <ul
                    className="space-y-4"
                    aria-labelledby="mega-menu-icons-dropdown-button"
                  >
                    <li>
                      <Link
                        href="/services/active-area"
                        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 group"
                      >
                        <span className="sr-only">Địa điểm hoạt động</span>
                        <svg
                          className="w-3 h-3 me-2 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="m1.56 6.245 8 3.924a1 1 0 0 0 .88 0l8-3.924a1 1 0 0 0 0-1.8l-8-3.925a1 1 0 0 0-.88 0l-8 3.925a1 1 0 0 0 0 1.8Z" />
                          <path d="M18 8.376a1 1 0 0 0-1 1v.163l-7 3.434-7-3.434v-.163a1 1 0 0 0-2 0v.786a1 1 0 0 0 .56.9l8 3.925a1 1 0 0 0 .88 0l8-3.925a1 1 0 0 0 .56-.9v-.786a1 1 0 0 0-1-1Z" />
                          <path d="M17.993 13.191a1 1 0 0 0-1 1v.163l-7 3.435-7-3.435v-.163a1 1 0 1 0-2 0v.787a1 1 0 0 0 .56.9l8 3.925a1 1 0 0 0 .88 0l8-3.925a1 1 0 0 0 .56-.9v-.787a1 1 0 0 0-1-1Z" />
                        </svg>
                        Địa điểm hoạt động
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/services/tour-guide"
                        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 group"
                      >
                        <span className="sr-only">Danh sách các TourGuide</span>
                        <svg
                          className="w-3 h-3 me-2 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                        </svg>
                        Danh sách các TourGuide
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="p-4 pb-0 text-gray-900 md:pb-4">
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="#"
                        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 group"
                      >
                        <span className="sr-only">Diễn đàn trao đổi</span>
                        <svg
                          className="w-3 h-3 me-2 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M19 4h-1a1 1 0 1 0 0 2v11a1 1 0 0 1-2 0V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a1 1 0 0 0-1-1ZM3 4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4Zm9 13H4a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-3H4a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-3H4a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-3h-2a1 1 0 0 1 0-2h2a1 1 0 1 1 0 2Zm0-3h-2a1 1 0 0 1 0-2h2a1 1 0 1 1 0 2Z" />
                          <path d="M6 5H5v1h1V5Z" />
                        </svg>
                        Diễn đàn trao đổi
                      </a>
                    </li>
                    <li>
                      <Link
                        href="/services/bids"
                        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 group"
                      >
                        <span className="sr-only">Đấu giá Tour</span>
                        <svg
                          className="w-3 h-3 me-2 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 14 20"
                        >
                          <path d="M13.383.076a1 1 0 0 0-1.09.217L11 1.586 9.707.293a1 1 0 0 0-1.414 0L7 1.586 5.707.293a1 1 0 0 0-1.414 0L3 1.586 1.707.293A1 1 0 0 0 0 1v18a1 1 0 0 0 1.707.707L3 18.414l1.293 1.293a1 1 0 0 0 1.414 0L7 18.414l1.293 1.293a1 1 0 0 0 1.414 0L11 18.414l1.293 1.293A1 1 0 0 0 14 19V1a1 1 0 0 0-.617-.924ZM10 15H4a1 1 0 1 1 0-2h6a1 1 0 0 1 0 2Zm0-4H4a1 1 0 1 1 0-2h6a1 1 0 1 1 0 2Zm0-4H4a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
                        </svg>
                        Đấu giá Tour
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <a
                href="/contact"
                className={`block py-2 px-3
                    ${
                  currentRoute === "/contact"
                    ? "text-blue-600"
                    : "text-gray-900"
                  } border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0`}
              >
                Liên hệ
              </a>
            </li>
          </ul>
        </div>
        <RoleSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </nav>
  );
};

export default MegaMenu;
