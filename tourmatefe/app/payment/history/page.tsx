"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, CreditCard, Filter, Search, Smartphone, Wallet, Download } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useToken } from "@/components/getToken"
import { MyJwtPayload } from "@/types/JwtPayload"
import { jwtDecode } from "jwt-decode"
import { getPaymentByAccountId } from "@/app/api/payment.api"
import { Payment } from "@/types/payment"
import MegaMenu from "@/components/mega-menu"
import Footer from "@/components/Footer"
import { Skeleton } from "@/components/ui/skeleton"
import Papa from "papaparse"
import { saveAs } from "file-saver"

export default function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const itemsPerPage = 10

  const token = useToken("accessToken")
  const decoded: MyJwtPayload | null = token ? jwtDecode<MyJwtPayload>(token.toString()) : null
  const accountId = decoded?.AccountId ? Number(decoded.AccountId) : undefined

  const { data, error, isLoading } = useQuery({
    queryKey: ["payment", accountId],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 5000)
      return getPaymentByAccountId(accountId as number)
    },
    enabled: !!accountId,
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 24 * 3600 * 1000,
  })

  const filteredPayments = (data ?? []).filter((payment: Payment) => {
    const matchesSearch =
      payment.paymentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.membershipPackage?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoice?.tourName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || payment.paymentType === typeFilter

    return matchesSearch && matchesType
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, typeFilter])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "momo":
        return <Smartphone className="h-4 w-4 text-pink-600" />
      case "vnpay":
        return <CreditCard className="h-4 w-4 text-blue-600" />
      case "payos":
        return <Wallet className="h-4 w-4 text-green-600" />
      default:
        return <Wallet className="h-4 w-4 text-gray-600" />
    }
  }

  const getPaymentTypeIcon = (type: string) =>
    type === "Membership" ? (
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
        <CreditCard className="h-3 w-3 mr-1" />
        Membership
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <CalendarDays className="h-3 w-3 mr-1" />
        Đặt chuyến đi
      </Badge>
    )

  const handleExportCSV = () => {
    const csv = Papa.unparse(
      filteredPayments.map((p, idx) => ({
        "STT": idx + 1,
        "Mã giao dịch": "#" + p.paymentId.toString().padStart(6, "0"),
        "Loại giao dịch": p.paymentType === "Membership" ? "Membership" : "Đặt chuyến đi",
        "Tên gói/Tour": p.paymentType === "Membership" ? p.membershipPackage?.name : p.invoice?.tourName,
        "Số tiền": formatCurrency(p.price),
        "Phương thức": p.paymentMethod?.toUpperCase(),
        "Ngày hoàn thành": formatDate(p.createdAt),
        "Mô tả": p.paymentType === "Membership"
          ? (p.membershipPackage?.benefitDesc?.replace(/<[^>]+>/g, " ") ?? "")
          : (p.invoice?.tourDesc?.replace(/<[^>]+>/g, " ") ?? "")
      }))
    )
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, "lich_su_thanh_toan.csv")
  }

  if (isLoading) {
    return (
      <>
        <MegaMenu />
        <div className="p-10 space-y-6">
          <Skeleton className="h-10 w-1/3 bg-gray-200" />
          <Skeleton className="h-20 w-full bg-gray-200" />
          <Skeleton className="h-[400px] w-full rounded-md bg-gray-200" />
        </div>
        <Footer />
      </>
    )
  }

  if (error) return <div>Error loading payment!</div>

  return (
    <>
      <MegaMenu />
      <div className="mx-auto p-10 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Lịch sử giao dịch</h1>
          <p className="text-muted-foreground">Xem tất cả các giao dịch thanh toán của bạn</p>
        </div>

        <Card className="py-5">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Bộ lọc
                </CardTitle>
                <CardDescription>Tìm kiếm và lọc giao dịch theo tiêu chí</CardDescription>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1 border px-3 py-1 rounded hover:bg-gray-100 text-sm"
              >
                <Download className="h-4 w-4" />
                Xuất CSV
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên gói hoặc tour..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Loại giao dịch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="Membership">Membership</SelectItem>
                  <SelectItem value="Đặt chuyến đi">Đặt chuyến đi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="py-5">
          <CardHeader>
            <CardTitle>Danh sách giao dịch</CardTitle>
            <CardDescription>Tổng cộng {filteredPayments.length} giao dịch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã GD</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead>Ngày hoàn thành</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Không tìm thấy giao dịch nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPayments.map((payment) => (
                      <>
                        <TableRow
                          key={payment.paymentId}
                          onClick={() =>
                            setExpandedRow(expandedRow === payment.paymentId ? null : payment.paymentId)
                          }
                          className="cursor-pointer hover:bg-gray-100 transition"
                        >
                          <TableCell className="font-medium">#{payment.paymentId.toString().padStart(6, "0")}</TableCell>
                          <TableCell>{getPaymentTypeIcon(payment.paymentType)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">
                                {payment.paymentType === "Membership"
                                  ? payment.membershipPackage?.name
                                  : payment.invoice?.tourName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {payment.paymentType === "Membership" ? "Gói thành viên" : "Đặt tour du lịch"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{formatCurrency(payment.price)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPaymentMethodIcon(payment.paymentMethod)}
                              <span className="capitalize">{payment.paymentMethod.toUpperCase()}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(payment.createdAt)}</TableCell>
                        </TableRow>

                        {expandedRow === payment.paymentId && (
                          <TableRow className="bg-gray-50">
                            <TableCell colSpan={6}>
                              <div className="p-4 space-y-1 text-sm text-gray-700">
                                <p><strong>Mã giao dịch:</strong> #{payment.paymentId}</p>
                                <p><strong>Phương thức thanh toán:</strong> {payment.paymentMethod}</p>
                                <p><strong>Thời gian:</strong> {formatDate(payment.createdAt)}</p>
                                <p>
                                  <strong>Chi tiết:</strong>{" "}
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        payment.paymentType === "Membership"
                                          ? payment.membershipPackage?.benefitDesc || ""
                                          : payment.invoice?.tourDesc || "",
                                    }}
                                  />
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Trang trước
                </button>
                <span className="px-3 py-1">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Trang sau
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  )
}
