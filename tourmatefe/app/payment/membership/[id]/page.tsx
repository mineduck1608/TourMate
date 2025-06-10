"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useParams } from "next/navigation"
import { usePayOS } from "@payos/payos-checkout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Calendar,
    Users,
    ArrowLeft,
    Clock,
    ShieldCheck,
    CheckCircle2,
    QrCode,
    Loader2,
    CreditCard,
    X,
    CircleDollarSign,
    ThumbsUp,
    TimerIcon,
    BoxesIcon,
} from "lucide-react"
import { fetchScheduleByInvoiceId } from "@/app/api/schedule.api"
import Footer from "@/components/Footer"
import MegaMenu from "@/components/mega-menu"
import type { MyJwtPayload } from "@/types/JwtPayload"
import { jwtDecode } from "jwt-decode"
import { useToken } from "@/components/getToken"
import { addPayment, createEmbeddedPaymentLink } from "@/app/api/payment.api"
import { webURL } from "@/types/constants"
import { getMembershipById } from "@/app/api/membership-package.api"
import { MembershipPackage } from "@/types/membership-package"

const formatDateTime = (dateStr: string) =>
    new Date(dateStr).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })

interface PayOSEvent {
    orderId: string;
    amount: number;
    description: string;
    code: string;
    status: 'PAID' | 'CANCELLED' | 'FAILED';
    cancelledReason?: string;
}

export default function MembershipPaymentPage() {
    const params = useParams()
    const membershipId = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "")

    const token = useToken("accessToken")
    const decoded: MyJwtPayload | null = token ? jwtDecode<MyJwtPayload>(token.toString()) : null
    const accountId = decoded?.AccountId

    const [membership, setMembership] = useState<MembershipPackage | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCreatingLink, setIsCreatingLink] = useState(false)
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)


    // Use ref to track if payment is already opened
    const paymentOpenedRef = useRef(false)
    const [isProcessing, setIsProcessing] = useState(false)


    // Simplified PayOS config - không cần state phức tạp
    const payOSConfig = useMemo(() => ({
        RETURN_URL: `${webURL}/payment/pay-result?success=true`,
        ELEMENT_ID: "embedded-payment-container",
        CHECKOUT_URL: checkoutUrl || "", // Đảm bảo không null
        embedded: true,
        onSuccess: async (event: PayOSEvent) => {
            console.log("Payment success:", event)
            setIsProcessing(true) // Show processing state

            try {
                const payment = await addPayment({
                    membershipId: Number(membershipId),
                    accountId: Number(accountId),
                    price: membership?.price || 0,
                    paymentMethod: "PayOS",
                    completeDate: new Date().toISOString(),
                    paymentType: "Membership",
                    paymentId: 0,
                    status: "Thành công"
                })

                if (payment) {
                    // Add delay to show processing state
                    setTimeout(() => {
                        setIsPaymentOpen(false)
                        setCheckoutUrl(null)
                        paymentOpenedRef.current = false
                        window.location.href = `/payment/pay-result?success=true&id=${membershipId}&paymentId=${payment.paymentId}&type=membership`
                    }, 2000)
                }
            } catch (error) {
                console.error("Payment error:", error)
                setError("Có lỗi xảy ra khi xử lý thanh toán")
            }
        },
        onCancel: (event: PayOSEvent) => {
            console.log("Payment cancelled:", event)
            window.location.href = `/payment/pay-result?success=false&id=${membershipId}`
            handleClosePayment()
        },
        onExit: (event: PayOSEvent) => {
            console.log("Payment exit:", event)
            window.location.href = `/payment/pay-result?success=false&id=${membershipId}`
            handleClosePayment()
        }
    }), [checkoutUrl])

    const { open, exit } = usePayOS(payOSConfig)

    useEffect(() => {
        console.log("PayOS Config:", payOSConfig)
        console.log("Checkout URL:", checkoutUrl)
        console.log("Is Payment Open:", isPaymentOpen)
    }, [payOSConfig, checkoutUrl, isPaymentOpen])

    // Load Membership - chỉ chạy khi membershipId thay đổi
    useEffect(() => {
        async function loadMembership() {
            if (!membershipId) return
            try {
                setLoading(true)
                setError(null)
                const data = await getMembershipById(Number(membershipId))
                setMembership(data)
            } catch (e) {
                setError("Không tìm thấy gói thành viên hoặc có lỗi xảy ra")
                console.error("Error fetching Membership:", e)
            } finally {
                setLoading(false)
            }
        }
        loadMembership()
    }, [membershipId])

    // Chỉ open payment khi có checkoutUrl và chưa được mở
    useEffect(() => {
        if (checkoutUrl && !paymentOpenedRef.current && isPaymentOpen) {
            // Đợi một chút để đảm bảo DOM đã render
            const timer = setTimeout(() => {
                const container = document.getElementById("embedded-payment-container")
                if (container) {
                    paymentOpenedRef.current = true
                    try {
                        open()
                    } catch (error) {
                        console.error("Error opening PayOS:", error)
                        setError("Không thể mở giao diện thanh toán. Vui lòng thử lại.")
                    }
                }
            }, 100)

            return () => clearTimeout(timer)
        }
    }, [checkoutUrl, open, isPaymentOpen])

    const handleGetPaymentLink = async () => {
        setIsCreatingLink(true)
        setError(null)

        try {
            exit()
        } catch (e) {
            console.log("Exit error (ignorable):", e)
        }
        paymentOpenedRef.current = false

        try {
            const amount = membership?.price || 0
            const type = "gói thành viên"

            const checkoutUrl = await createEmbeddedPaymentLink(
                amount,
                type,
            )

            if (checkoutUrl) {
                setCheckoutUrl(checkoutUrl)
                setIsPaymentOpen(true)
            } else {
                throw new Error("Không nhận được checkout URL")
            }

        } catch (error) {
            console.error("Error creating payment link:", error)
            setError("Lỗi kết nối thanh toán. Vui lòng thử lại.")
        } finally {
            setIsCreatingLink(false)
        }
    }

    const handleClosePayment = () => {
        setIsPaymentOpen(false)
        setCheckoutUrl(null)
        paymentOpenedRef.current = false
        exit()
    }


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang tải thông tin gói thành viên...</p>
                </div>
            </div>
        )
    }

    if (error && !membership) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-600 text-2xl">⚠</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Đã xảy ra lỗi</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Button onClick={() => window.history.back()} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }


    if (!membership) return null

    return (
        <>
            <MegaMenu />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Tour Information - Left Side */}
                        <div className="lg:col-span-2">
                            <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                                {/* Hero Section */}
                                <div className="relative h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h1 className="text-3xl font-bold leading-tight mb-2">Gói {membership.name}</h1>
                                        <p className="text-sm text-white/90 mb-3">Mã đơn hàng: #{membershipId}</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-white font-medium">Thời lượng:</span>
                                            </div>
                                            <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                                                {membership.duration} tháng
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-blue-600" />
                                            Thông tin gói thành viên
                                        </h3>
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                                                        <BoxesIcon className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Gói thành viên</p>
                                                        <p className="font-semibold text-gray-900">Gói: {membership.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 md:col-span-2">
                                                    <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                                                        <CircleDollarSign className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Giá</p>
                                                        <p className="font-semibold text-gray-900">{membership.price.toLocaleString("vi-VN")} ₫</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 md:col-span-2">
                                                    <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                                                        <TimerIcon className="w-5 h-5 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Thời lượng</p>
                                                        <p className="font-semibold text-gray-900">{membership.duration} tháng</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 md:col-span-2">
                                                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                                                        <ThumbsUp className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Miêu tả</p>
                                                        <p className="font-semibold text-gray-900">{membership.benefitDesc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 text-center border border-amber-100">
                                            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Calendar className="w-6 h-6 text-white" />
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1">Ngày bắt đầu</p>
                                            <p className="font-bold text-gray-900 text-sm">
                                                {formatDateTime(new Date().toISOString())}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 text-center border border-amber-100">
                                            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1">Ngày hết hạn</p>
                                            <p className="font-bold text-gray-900 text-sm">
                                                {formatDateTime(new Date(new Date().setMonth(new Date().getMonth() + (membership?.duration || 0))).toISOString())}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>

                            </Card>
                        </div>

                        {/* Payment Section - Right Side */}
                        <div className="lg:col-span-1">
                            <Card className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                                {/* Price Header */}
                                <CardHeader className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white text-center p-6">
                                    <div className="space-y-2">
                                        <p className="text-green-100 font-medium mb-3">Tổng thanh toán</p>
                                        <CardTitle className="text-4xl font-bold">{membership.price.toLocaleString("vi-VN")} ₫</CardTitle>
                                        <p className="text-green-100 text-sm">Đã bao gồm thuế và phí</p>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-6">

                                    {/* PayOS Payment Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-blue-600" />
                                            Thanh toán PayOS
                                        </h3>

                                        {error && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        )}

                                        {/* Payment Button - Only show if payment is not open */}
                                        {!isPaymentOpen ? (
                                            <div className="space-y-3">
                                                {isCreatingLink ? (
                                                    <div className="text-center py-6">
                                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
                                                        <p className="text-gray-600 font-medium">Đang tạo link thanh toán...</p>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        onClick={handleGetPaymentLink}
                                                        className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                                    >
                                                        <QrCode className="w-6 h-6 mr-2" />
                                                        Tạo mã QR thanh toán
                                                    </Button>
                                                )}
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={handleClosePayment}
                                                variant="outline"
                                                className="w-full h-12 border-2 hover:bg-gray-50"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Đóng thanh toán
                                            </Button>
                                        )}
                                    </div>

                                    {/* Payment Instructions - Only show when payment is open */}
                                    {isPaymentOpen && (
                                        <Alert className="border-blue-200 bg-blue-50">
                                            <AlertDescription className="text-blue-800">
                                                Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5-10 giây để hệ thống tự động cập nhật.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Embedded Payment Container */}
                                    <div
                                        id="embedded-payment-container"
                                        style={{
                                            height: "330px",
                                            position: "relative"
                                        }}
                                    >
                                        {/* Processing Payment Overlay */}
                                        {isProcessing && (
                                            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
                                                <div className="text-center space-y-4">
                                                    <div className="relative">
                                                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                                                        <CheckCircle2 className="w-8 h-8 text-green-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-lg font-semibold text-gray-900">Đang xử lý thanh toán</p>
                                                        <p className="text-sm text-gray-600">Vui lòng đợi trong giây lát...</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Existing Loading State */}
                                        {isPaymentOpen && !checkoutUrl && !isProcessing && (
                                            <div className="h-full flex items-center justify-center">
                                                <div className="text-center text-gray-500">
                                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                                    <p>Đang tải mã QR...</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Security Features */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                                <span className="font-medium">Mã hóa SSL</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                <span className="font-medium">Bảo mật 100%</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div >
            <Footer />
        </>
    )
}