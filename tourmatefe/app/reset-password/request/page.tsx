import Footer from "@/components/Footer";
import MegaMenu from "@/components/mega-menu";
import { RequestResetPasswordForm } from "@/components/request-reset-password-form";

export default function RequestResetPasswordPage() {
    return (
        <>
            <MegaMenu />
            <div className="flex flex-col items-center justify-center gap-6 bg-background p-6 my-8 md:p-10">
                <div className="w-full max-w-sm">
                    <RequestResetPasswordForm />
                </div>
            </div>
            <Footer />
        </>
    )
}