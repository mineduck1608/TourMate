"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Crown, Star } from "lucide-react"
import { getNearestMembershipOf } from "@/app/api/membership-package.api"

export default function MembershipPackageComponent({ accountId }: { accountId: number }) {
    const [modalOpen, setModalOpen] = useState(false)

    const {
        data: membershipPackage,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["membership-package", accountId],
        queryFn: () => getNearestMembershipOf(accountId),
        staleTime: 24 * 3600 * 1000, // 24 hours
    })

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
            </div>
        )
    }

    if (error || !membershipPackage) {
        return (
            <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-6 text-center">
                    <Crown className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">Chưa có gói thành viên</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50"
                onClick={() => setModalOpen(true)}
            >
                <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                <Crown className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">{membershipPackage.name}</h3>
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                    <Star className="h-3 w-3 mr-1" />
                                    Premium
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Nhấn để xem chi tiết gói thành viên</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                <Crown className="h-4 w-4 text-white" />
                            </div>
                            <span>Chi tiết gói thành viên</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{membershipPackage.name}</h3>
                            <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Gói Premium
                            </Badge>
                        </div>

                        {/* <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Giá gói</p>
                                <p className="text-xl font-bold text-green-600">{formatNumber(membershipPackage.price)} VND</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Thời hạn</p>
                                <p className="text-xl font-bold text-blue-600">{membershipPackage.duration} tháng</p>
                            </div>
                        </div> */}

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Thời hạn:</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-700 leading-relaxed">{membershipPackage.duration} tháng</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Quyền lợi thành viên:</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-700 leading-relaxed">{membershipPackage.benefitDesc}</p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
                                Đóng
                            </Button>
                            {/* <Button className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600">
                                Gia hạn gói
                            </Button> */}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
