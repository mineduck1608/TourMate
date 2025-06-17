import { Suspense } from "react"
import MegaMenu from "@/components/mega-menu"
import Footer from "@/components/Footer"
import { PaymentResultLoading } from "./payment-result-loading"
import { PaymentResultContent } from "./payment-result-content"

export default function PaymentResult() {
  return (
    <>
      <MegaMenu />
      <Suspense fallback={<PaymentResultLoading />}>
        <PaymentResultContent />
      </Suspense>
      <Footer />
    </>
  )
}
