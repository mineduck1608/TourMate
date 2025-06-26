"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function ContactSection() {
    return (
        <Card className="bg-gradient-to-br from-gray-900 to-black border-0 shadow-xl overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

            <CardContent className="p-6 text-white relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <MessageCircle className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="text-2xl font-bold leading-tight">Bạn có câu hỏi nào không?</h4>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                    Đừng ngần ngại gọi cho chúng tôi. Chúng tôi là một đội ngũ chuyên gia và rất vui được trò chuyện với bạn.
                </p>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
                        <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                            <Phone className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Điện thoại</p>
                            <a href="tel:0977300916" className="text-white font-medium hover:text-blue-400 transition-colors">
                                0977-300-916
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
                        <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                            <Mail className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Email</p>
                            <a
                                href="mailto:tourmate2025@gmail.com"
                                className="text-white font-medium hover:text-blue-400 transition-colors break-all"
                            >
                                tourmate2025@gmail.com
                            </a>
                        </div>
                    </div>
                </div>

                <Link

                    href={'/contact'}
                >
                    <div
                        className="p-2 rounded-lg text-center w-full mt-6 bg-blue-500 hover:bg-blue-600 border-0 font-medium"
                    >
                        Liên hệ ngay
                    </div>
                </Link>
            </CardContent>
        </Card>
    )
}
