"use client"

import { CheckCircle, XCircle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import MegaMenu from "@/components/mega-menu"
import Footer from "@/components/Footer"
import { useQuery } from "@tanstack/react-query"
import { fetchPaymentById } from "@/app/api/payment.api"
import { useParams } from "next/navigation"


export default function PaymentResult() {
    const params = useParams()
    const isSuccess = params.success === "true"
    const id = params.id
    const paymentId =  params.paymentId

    // Nếu thành công, fetch payment detail
    const { data: paymentData } = useQuery({
        queryKey: ["payment", paymentId],
        queryFn: () =>
            paymentId && typeof paymentId === "string"
                ? fetchPaymentById(Number(paymentId))
                : null,
        enabled: isSuccess && !!paymentId && typeof paymentId === "string",
    })

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const pad = (n: number) => n.toString().padStart(2, "0");
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1); // Tháng bắt đầu từ 0
        const year = date.getFullYear();
        const hour = pad(date.getHours());
        const minute = pad(date.getMinutes());
        const second = pad(date.getSeconds());

        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    };

    return (
        <>
            <MegaMenu />
            <hr className="border-gray-200 sm:mx-auto" />

            <div className={`min-h-screen bg-gradient-to-br ${isSuccess ? "from-green-100 via-green to-green-500" : "from-red-200 via-red to-red-700"}  relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-xl"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-green-200 rounded-full blur-xl"></div>
                    <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-purple-200 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-yellow-200 rounded-full blur-xl"></div>
                </div>

                <div className="relative flex items-center justify-center min-h-screen p-4 py-16">
                    <div className="w-full max-w-lg">
                        <div className="text-center mb-8">
                            <div
                                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${isSuccess ? "bg-green-100 animate-pulse" : "bg-red-100 animate-pulse"
                                    }`}
                            >
                                {isSuccess ? (
                                    <CheckCircle className="h-12 w-12 text-green-600" />
                                ) : (
                                    <XCircle className="h-12 w-12 text-red-600" />
                                )}
                            </div>
                            <h1 className={`text-3xl font-bold mb-2 ${isSuccess ? "text-green-800" : "text-red-600"}`}>
                                {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
                            </h1>
                            <p className="text-black text-lg">
                                {isSuccess
                                    ? "Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi"
                                    : "Đừng lo lắng, bạn có thể thử lại ngay bây giờ"}
                            </p>
                        </div>

                        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
                            <CardContent className="p-8">
                                {isSuccess ? (
                                    <div className="space-y-6">
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <h3 className="font-semibold text-green-800 mb-2">Chi tiết đơn hàng</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Mã đơn hàng:</span>
                                                    <span className="font-mono font-semibold">
                                                        #{paymentId || "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Thời gian:</span>
                                                    <span>
                                                        <span>
                                                            {paymentData?.completeDate
                                                                ? formatDateTime(paymentData.completeDate)
                                                                : formatDateTime(new Date().toISOString())}
                                                        </span>
                                                    </span>

                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Dịch vụ:</span>
                                                    <span className="text-black font-semibold">{paymentData?.paymentType}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Trạng thái:</span>
                                                    <span className="text-green-600 font-semibold">Đã thanh toán</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center space-y-2">
                                            <p className="text-gray-700">📧 Email xác nhận đã được gửi đến hộp thư của bạn</p>
                                            <p className="text-sm text-gray-500">Vui lòng kiểm tra cả thư mục spam nếu không thấy email</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <h3 className="font-semibold text-red-800 mb-2">Lý do có thể gây lỗi</h3>
                                            <ul className="text-sm text-red-700 space-y-1">
                                                <li>• Thông tin thẻ không chính xác</li>
                                                <li>• Số dư tài khoản không đủ</li>
                                                <li>• Thẻ đã hết hạn hoặc bị khóa</li>
                                                <li>• Lỗi kết nối mạng</li>
                                            </ul>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-gray-700">💡 Vui lòng kiểm tra lại thông tin và thử lại</p>
                                            <p className="text-sm text-gray-500 mt-2">Hoặc liên hệ với chúng tôi nếu vấn đề vẫn tiếp tục</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="p-8 pt-0">
                                <div className="w-full space-y-3">
                                    <Button
                                        asChild
                                        className={`w-full h-12 text-base font-semibold ${isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
                                    >
                                        <Link href="/">
                                            <Home className="mr-2 h-5 w-5" />
                                            Về trang chủ
                                        </Link>
                                    </Button>

                                    {/* Nếu là Membership */}
                                    {id === "Membership" ? (
                                        <>
                                            {!isSuccess && (
                                                <Button
                                                    variant="outline"
                                                    asChild
                                                    className="w-full h-12 text-base font-semibold border-2"
                                                >
                                                    <Link href="/payment/membership">
                                                        <RefreshCw className="mr-2 h-5 w-5" />
                                                        Thử thanh toán lại
                                                    </Link>
                                                </Button>
                                            )}
                                            {/* Nếu thành công: chỉ có về trang chủ, không có nút khác */}
                                        </>
                                    ) : (
                                        <>
                                            {/* Nếu KHÔNG phải Membership */}
                                            {isSuccess && (
                                                <Button
                                                    variant="outline"
                                                    asChild
                                                    className="w-full h-12 text-base"
                                                >
                                                    <Link href={`/tour-schedule`}>
                                                        Xem lịch trình của tôi
                                                    </Link>
                                                </Button>
                                            )}
                                            {!isSuccess && (
                                                <Button
                                                    variant="outline"
                                                    asChild
                                                    className="w-full h-12 text-base font-semibold border-2"
                                                >
                                                    <Link href={`/payment/tour/${id}`}>
                                                        <RefreshCw className="mr-2 h-5 w-5" />
                                                        Thử thanh toán lại
                                                    </Link>
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>

                        <div className="text-center mt-8 text-sm text-white">
                            <p>
                                Cần hỗ trợ? Liên hệ với chúng tôi qua email: <span className="font-semibold">tourmate2025@gmail.com </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}