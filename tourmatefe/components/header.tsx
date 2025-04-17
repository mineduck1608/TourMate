import React, { useState, useEffect } from "react";
import "../../styles/main.scss";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import logoColor from "../../images/logos/logoColor.png";
import Link from "next/link";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { roleJWT } from "@/types/constants";

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
            <ul className="nav-list">
              <li>
                <Link href="/" className="nav-link text-base">
                  <FontAwesomeIcon icon={faHouse} className="mb-0.5 mr-3" />
                  HOME
                </Link>
              </li>
              <li>
                <a href="/about" className="nav-link text-base">
                  ABOUT US
                </a>
              </li>
              <Image
                src={logoColor}
                alt="Sen Spa Logo"
                className={`logo-image ${
                  isAtTop ? "large-logo brightness-0 invert" : "small-logo"
                }`}
              />
              <li className="dropdown">
                <a href="/media/pictures" className="nav-link text-base">
                  MEDIA
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="mb-0.5 ml-2 text-xs"
                  />
                </a>
                <ul
                  className={`dropdown-menu min-w-[220px] rounded-br-lg rounded-tl-lg ${
                    isAtTop ? "bg-white/20" : "small"
                  }  backdrop-blur-sm`}
                >
                  <li>
                    <a
                      href="/media/pictures"
                      className={`dropdown-link ${
                        isAtTop ? "text-white" : "text-black"
                      } group flex items-center text-base transition-transform duration-1000 hover:translate-x-2 hover:bg-transparent`}
                    >
                      <span className="opacity-0 transition-opacity group-hover:opacity-100">
                        -&nbsp;
                      </span>
                      Pictures
                    </a>
                  </li>
                  <li>
                    <a
                      href="/media/videos"
                      className={`dropdown-link ${
                        isAtTop ? "text-white" : "text-black"
                      } group flex items-center text-base transition-transform duration-1000 hover:translate-x-2 hover:bg-transparent`}
                    >
                      <span className="opacity-0 transition-opacity group-hover:opacity-100">
                        -&nbsp;
                      </span>
                      Videos
                    </a>
                  </li>
                  <li>
                    <a
                      href="/media/e-brochure"
                      className={`dropdown-link ${
                        isAtTop ? "text-white" : "text-black"
                      } group flex items-center text-base transition-transform duration-1000 hover:translate-x-2 hover:bg-transparent`}
                    >
                      <span className="opacity-0 transition-opacity group-hover:opacity-100">
                        -&nbsp;
                      </span>
                      E-Brochure
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="/news/blog" className="nav-link text-base">
                  NEWS
                </a>
              </li>
              <li>
                <a href="/contact" className="nav-link text-base">
                  CONTACT
                </a>
              </li>
              <li>
                <a href="/recruitment" className="nav-link text-base">
                  RECRUITMENT
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
