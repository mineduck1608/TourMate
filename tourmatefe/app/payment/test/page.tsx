"use client"

import { addPayment } from "@/app/api/payment.api"
import { useEffect } from "react"

export default function TestPaymentPage() {
    useEffect(() => {
        const createPayment = async () => {
            try {
                const response = await addPayment({
                    invoiceId: Number(15), // Replace with dynamic data if needed
                    accountId: Number(1),
                    price: 2000,
                    paymentMethod: "PayOS",
                    completeDate: new Date().toISOString(),
                    paymentType: "Đặt chuyến đi",
                    paymentId: 0,
                    status: "Thành công"
                })

                if (response) {
                    console.log("Payment created successfully:", response)
                }
            } catch (error) {
                console.error("Error creating payment:", error)
            }
        }

        createPayment()
    }, [])

    return (
        <div>
            <h1>Đang xử lý thanh toán...</h1>
        </div>
    )
}
