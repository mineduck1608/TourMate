"use client";
import { useRouter } from "next/navigation";
import { User, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleSelectionModal({
  isOpen,
  onClose,
}: RoleSelectionModalProps) {
  const router = useRouter();

  const handleRoleSelection = (role: "customer" | "tourguide") => {
    router.push(`/signUp/${role}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Chọn Loại Tài Khoản
          </DialogTitle>
          <DialogDescription className="text-center">
            Vui lòng chọn loại tài khoản phù hợp với nhu cầu của bạn
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
          <Card
            className="border-2 hover:border-sky-500 transition-all cursor-pointer"
            onClick={() => handleRoleSelection("customer")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 mt-4">
                <User className="h-6 w-6 text-sky-500" />
              </div>
              <CardTitle className="mt-2">Khách Hàng</CardTitle>
            </CardHeader>
            <CardContent className=" mt-[-10]">
              <CardDescription className="text-center">
                Đăng ký tài khoản để tìm kiếm và đặt tour du lịch phù hợp với
                nhu cầu của bạn
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            className="border-2 hover:border-sky-500 transition-all cursor-pointer"
            onClick={() => handleRoleSelection("tourguide")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 mt-4">
                <MapPin className="h-6 w-6 text-sky-500" />
              </div>
              <CardTitle className="mt-2">Hướng Dẫn Viên</CardTitle>
            </CardHeader>
            <CardContent className="mb-10 mt-[-10]">
              <CardDescription className="text-center">
                Đăng ký tài khoản để tạo và quản lý các tour du lịch của bạn
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
