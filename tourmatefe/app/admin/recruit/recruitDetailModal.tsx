"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Home,
  Award,
  Camera,
  Download,
} from "lucide-react";
import { Applications } from "@/types/applications";
import { useQuery } from "@tanstack/react-query";
import { getActiveArea } from "@/app/api/active-area.api";

type CVDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentCV: Applications;
};

export default function CVDetailModal({
  isOpen,
  onClose,
  currentCV,
}: CVDetailModalProps) {
  const [formData, setFormData] = useState<Applications>(currentCV);

  useEffect(() => {
    setFormData(currentCV);
  }, [currentCV]);

  // Fetch areaName từ areaId
  const { data: areaData, isLoading: isAreaLoading } = useQuery({
    queryKey: ["active-area", formData.areaId],
    queryFn: () => getActiveArea(formData.areaId),
    enabled: !!formData.areaId,
    staleTime: 5 * 60 * 1000,
  });

  // Hàm format ngày dd/mm/yyyy
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-gray-50">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Award className="w-6 h-6" />
              Chi tiết Hướng dẫn viên
            </DialogTitle>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gradient-to-r from-blue-400 to-purple-400 p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <img
                        src={formData.image}
                        alt={formData.fullName || "Ảnh hướng dẫn viên"}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-slate-800">
                    {formData.fullName}
                  </h2>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-700">
                  <User className="w-5 h-5" />
                  Thông tin cá nhân
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Ngày sinh</p>
                      <p className="font-medium">
                        {formatDate(formData.dateOfBirth)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                    <User className="w-5 h-5 text-pink-600" />
                    <div>
                      <p className="text-sm text-gray-600">Giới tính</p>
                      <p className="font-medium">{formData.gender}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-700">
                  <Phone className="w-5 h-5" />
                  Thông tin liên hệ
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Số điện thoại</p>
                      <p className="font-medium">{formData.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Information */}
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-700">
                <MapPin className="w-5 h-5" />
                Thông tin địa điểm
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Khu vực hoạt động</p>
                    <p className="font-medium">
                      {isAreaLoading
                        ? "Đang tải..."
                        : areaData?.areaName || formData.areaId || ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <Home className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Địa chỉ</p>
                    <p className="font-medium">{formData.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {/* Đã hiển thị ở trên, nếu muốn tách riêng thì bỏ comment này */}

          {/* CV Section */}
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-slate-700">
                  <Award className="w-5 h-5" />
                  Hồ sơ năng lực (CV)
                </h3>
                {formData.link && (
                  <Button
                    className="bg-slate-600 hover:bg-slate-700 text-white"
                    asChild
                  >
                    <a
                      href={formData.link}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Tải về
                    </a>
                  </Button>
                )}
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                {formData.link ? (
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <iframe
                      src={`${formData.link}#toolbar=0`}
                      className="w-full h-full rounded-lg"
                      title="CV Preview"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <Award className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                    <p className="text-indigo-700 font-medium">Không có CV</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    Trạng thái
                  </h3>
                  <Badge
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2"
                    variant={
                      formData.status === "Đang chờ duyệt"
                        ? "outline"
                        : formData.status === "Đã xử lí"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {formData.status}
                  </Badge>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Liên hệ
                  </Button>
                  <Button
                    className="bg-slate-600 hover:bg-slate-700 text-white"
                    onClick={onClose}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
