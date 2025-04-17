"use client";

import React, { useState, useEffect } from "react";
import "@/styles/globals.css"; // Đường dẫn đến file CSS toàn cục của bạn
import Image from "next/image";
import Link from "next/link";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { roleJWT } from "@/types/constants";
import Logo from "@/public/Logo.png";
import AuthSwitcher from "@/components/AuthSwitcher";

const Header = () => {
  // Giải mã JWT để kiểm tra thời gian hết hạn
  const isTokenValid = (token: string | null) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Giải mã phần payload của JWT
      return payload.exp * 1000 > Date.now(); // Kiểm tra xem token còn hạn không
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem("token");

      if (!isTokenValid(token)) {
        sessionStorage.removeItem("token"); // Xóa token nếu hết hạn
      }
      if (token) {
        const jwtData = jwtDecode(token);
        const role = (jwtData as JwtPayload & { [key: string]: string })[
          roleJWT
        ]; // Lấy role từ JWT
        if (role === "Admin") {
          window.location.assign("/admin");
        }
        if (role === "Manager") {
          window.location.assign("/manager");
        }
        if (role === "Employee") {
          window.location.assign("/employee");
        }
      }
    };

    checkAuth();

    // Lắng nghe thay đổi của sessionStorage (trong trường hợp token bị xóa từ tab khác)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        checkAuth();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Kiểm tra token mỗi phút (phòng trường hợp token hết hạn nhưng không reload)
    const interval = setInterval(checkAuth, 60000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className={`header ${isAtTop ? "at-top" : ""}`}>
        <div className={`header-container ${isAtTop ? "large" : "small"}`}>
          <nav className="navigation">
          <Image
                src={Logo}
                alt="TourMate Logo"
                className={`logo-image ${
                  isAtTop ? "large-logo" : "small-logo"
                }`}
              />
            <ul className="nav-list">
              <li>
                <Link href="/" className="nav-link text-base">
                  TRANG CHỦ
                </Link>
              </li>
              <li>
                <Link href="/about" className="nav-link text-base">
                  VỀ CHÚNG TÔI
                </Link>
              </li>
              <li>
                <Link href="/about" className="nav-link text-base">
                  TIN TỨC
                </Link>
              </li>
              <li>
                <Link href="/news/blog" className="nav-link text-base">
                  TOUR
                </Link>
              </li>
              <li>
                <Link href="/contact" className="nav-link text-base">
                  BLOG
                </Link>
              </li>
              <li>
                <Link href="/recruitment" className="nav-link text-base">
                  LIÊN HỆ
                </Link>
              </li>
            </ul>
            <div className={`authswitch ${
                  isAtTop ? "large-authswitch" : "small-authswitch"
                }`}>
      <AuthSwitcher />
    </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
