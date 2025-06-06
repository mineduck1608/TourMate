"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { TourSchedule } from "@/types/tour-schedule"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Phone, Mail, CreditCard, CheckCircle2, ArrowLeft, Clock, Star, ShieldCheck, WalletCards } from 'lucide-react'
import { fetchScheduleByInvoiceId } from "@/app/api/schedule.api"
import Footer from "@/components/Footer"
import MegaMenu from "@/components/mega-menu"
import { getCreatePaymentUrl } from "@/app/api/payment.api"
import { useToken } from "@/components/getToken"
import { MyJwtPayload } from "@/types/JwtPayload"
import { jwtDecode } from "jwt-decode"

const PaymentMethodCard = ({
  method,
  isSelected,
  onSelect,
}: {
  method: { key: string; label: string; desc: string; icon: string; gradient: string }
  isSelected: boolean
  onSelect: () => void
}) => (
  <div
    onClick={onSelect}
    className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${isSelected ? "ring-4 ring-blue-400 ring-opacity-50 shadow-2xl" : "hover:shadow-xl"
      }`}
  >
    <div className={`bg-gradient-to-br ${method.gradient} p-4 text-white`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <img
            src={method.icon || "/placeholder.svg?height=32&width=32"}
            alt={method.label}
            className="w-8 h-8 object-contain"
          />
        </div>
        {isSelected && (
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
        )}
      </div>
      <h3 className="font-bold text-lg mb-1">{method.label}</h3>
      <p className="text-white/80 text-sm">{method.desc}</p>
    </div>
  </div>
)

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

const paymentMethods = [
  {
    key: "VNPAY",
    label: "VNPay",
    desc: "Thanh toán nhanh chóng & bảo mật",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s",
    gradient: "from-red-500 via-red-600 to-red-700",
  },
  {
    key: "MOMO",
    label: "MoMo",
    desc: "Ví điện tử phổ biến nhất VN",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnV4cUM7jBauINof35Yn_unOz976Iz5okV8A&s",
    gradient: "from-pink-500 via-pink-600 to-purple-600",
  },
  {
    key: "Bank",
    label: "Chuyển khoản",
    desc: "Chuyển khoản trực tiếp",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWMrzhDTh8uJaQ-KWzy6sdGUf9J7U7P513yg&s",
    gradient: "from-blue-500 via-blue-600 to-indigo-600",
  },
]

export default function TourPaymentPage() {
  const params = useParams()
  const invoiceId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? ""

  const [schedule, setSchedule] = useState<TourSchedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [paying, setPaying] = useState(false)

  const token = useToken("accessToken");
  const decoded: MyJwtPayload | null = token
    ? jwtDecode<MyJwtPayload>(token.toString())
    : null;
  const accountId = decoded?.AccountId;

  useEffect(() => {
    async function loadSchedule() {
      if (!invoiceId) return
      try {
        setLoading(true)
        setError(null)
        const data = await fetchScheduleByInvoiceId(Number(invoiceId))
        setSchedule(data)
      } catch (e) {
        setError("Không tìm thấy lịch hẹn hoặc có lỗi xảy ra")
        console.error("Error fetching schedule:", e)
      } finally {
        setLoading(false)
      }
    }
    loadSchedule()
  }, [invoiceId])

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }
    if (!schedule) {
      alert("Không có dữ liệu lịch hẹn");
      return;
    }

    try {
      setPaying(true);

      if (selectedMethod.toLowerCase() === "vnpay") {
        // Gọi API backend để lấy paymentUrl
        const amount = schedule.price || 0; // hoặc lấy giá đúng bạn cần
        const orderId = invoiceId; // hoặc ID đơn hàng bạn có

        // Gọi API backend VNPAY
        const paymentUrl = await getCreatePaymentUrl(amount, orderId, "Đặt lịch hẹn");
        console.log("Payment URL:", paymentUrl);

        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          throw new Error("Không nhận được URL thanh toán");
        }
      } else {
        // Xử lý các phương thức thanh toán khác
        alert("Phương thức thanh toán chưa được hỗ trợ");
        setPaying(false);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Lỗi thanh toán");
      setPaying(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    )
  }

  if (error || !schedule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Đã xảy ra lỗi</h2>
            <p className="text-gray-600 mb-6">{error || "Không tìm thấy thông tin thanh toán"}</p>
            <Button onClick={() => window.history.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <MegaMenu />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-full mx-auto p-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Tour Information - Left Side */}
            <div className="lg:col-span-3">
              <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                {/* Hero Section */}
                <div className="relative h-45 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h2 className="text-4xl font-bold leading-tight mb-2">{schedule.tourName}</h2>
                    <p className="text-sm text-white mb-4">Mã đơn hàng: #{invoiceId}</p>

                    <div className="flex items-center gap-3 text-blue-100">
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <Star className="w-4 h-4 text-yellow-300 fill-current" />
                        <span className="text-white font-medium">4.9</span>
                      </div>
                      <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                        {schedule.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8">
                  {/* Customer Info */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      Thông tin khách hàng
                    </h3>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {schedule.customerName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Họ tên</p>
                            <p className="font-bold text-gray-900 text-lg">{schedule.customerName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                            <p className="font-bold text-gray-900 text-lg">{schedule.customerPhone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 md:col-span-2">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Mail className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Email</p>
                            <p className="font-bold text-gray-900 text-lg">{schedule.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 text-center border border-orange-100">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Thời gian khởi hành</p>
                      <p className="font-bold text-gray-900 text-lg">{formatDateTime(schedule.startDate)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 text-center border border-green-100">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Thời gian kết thúc</p>
                      <p className="font-bold text-gray-900 text-lg">{formatDateTime(schedule.endDate)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 text-center border border-blue-100">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Số người</p>
                      <p className="font-bold text-gray-900 text-lg">{schedule.peopleAmount} người</p>
                    </div>
                  </div>

                  {/* Tour Guide */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                      Hướng dẫn viên
                    </h3>
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {schedule.tourGuideName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-xl mb-1">{schedule.tourGuideName}</p>
                        <p className="text-gray-600 text-lg mb-2">{schedule.tourGuidePhone}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                          <span className="text-sm text-gray-500 ml-2 font-medium">(4.9 • 127 đánh giá)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Section - Right Side */}
            <div className="lg:col-span-2">
              <div className="">
                <Card className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                  {/* Price Header */}
                  <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                      <p className="text-green-100 text-lg font-medium mb-3">Tổng thanh toán</p>
                      <div className="text-5xl font-bold mb-2">{schedule.price.toLocaleString("vi-VN")} ₫</div>
                      <p className="text-green-100 text-sm">Đã bao gồm thuế và phí dịch vụ</p>
                    </div>
                  </div>

                  <CardContent className="p-8">
                    {/* Payment Methods */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        Chọn phương thức thanh toán
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {paymentMethods.map((method) => (
                          <PaymentMethodCard
                            key={method.key}
                            method={method}
                            isSelected={selectedMethod === method.key}
                            onSelect={() => setSelectedMethod(method.key)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Payment Button */}
                    <Button
                      onClick={handlePayment}
                      disabled={!selectedMethod || paying}
                      className={`w-full h-16 text-xl font-bold rounded-2xl transition-all duration-300 ${selectedMethod && !paying
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                      {paying ? (
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Đang xử lý thanh toán...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <WalletCards className="w-12 h-12" />
                          Thanh toán
                        </div>
                      )}
                    </Button>

                    {/* Security Features */}
                    <div className="mt-7 p-6 bg-gray-50 rounded-2xl">
                      <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-green-500" />
                          <span className="font-medium">Mã hóa SSL</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="font-medium">Bảo mật 100%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
