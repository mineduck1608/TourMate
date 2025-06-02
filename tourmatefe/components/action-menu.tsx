// ActionMenu.tsx
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Settings, Clock, LogOut } from "lucide-react";
import { useToken } from "./getToken";
import { MyJwtPayload } from "@/types/JwtPayload";
import { jwtDecode } from "jwt-decode";
import CustomerProfile from "./customerProfile";
import { ResetPass } from "./reset-password";

export default function ActionMenu() {

  const token = useToken("accessToken");
  const decoded: MyJwtPayload | null = token ? jwtDecode<MyJwtPayload>(token.toString()) : null;
  const accountName = decoded?.FullName;
  const accountId = decoded?.AccountId;
  const role = decoded?.Role

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer"
        >
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-blue-700">Menu người dùng</SheetTitle>
          <SheetDescription>
            Quản lý tài khoản và các hoạt động của bạn
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          <SheetTitle className=" px-4">Xin chào {accountName}</SheetTitle>
          <SheetDescription className=" px-4">
            ID: {accountId}
          </SheetDescription>
          {role === "Customer" ? <CustomerProfile /> : <button
            className="w-full flex items-center gap-3 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md"
            onClick={() => alert("TourGuide chỉnh sửa tài khoản")}
          >
            <Settings size={18} />
            Thông tin tài khoản
          </button>}
          <button
            className="w-full flex items-center gap-3 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md"
            onClick={() => alert("Xem lịch sử hoạt động")}
          >
            <Clock size={18} />
            Xem lịch sử hoạt động
          </button>
          <ResetPass />
          <button
            className="w-full flex items-center gap-3 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md font-semibold"
            onClick={() => {
              sessionStorage.removeItem("accessToken");
              sessionStorage.removeItem("refreshToken");
              window.location.href = "/"; // hoặc "/" tùy theo app bạn điều hướng
            }}
          >
            <LogOut size={18} />
            Đăng xuất
          </button>

        </div>
      </SheetContent>
    </Sheet>
  );
}
