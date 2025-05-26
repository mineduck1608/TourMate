"use client"

import Footer from "@/components/Footer";
import MegaMenu from "@/components/MegaMenu";
import ResetPasswordForm from "@/components/reset-password-form";

export default function ResetPasswordPage() {
    return (
        <>
            <MegaMenu />
            <hr className="border-gray-200 sm:mx-auto" />
            <div className="flex flex-col items-center justify-center gap-6 bg-background p-6 my-8 md:p-10">
                <div className="w-full max-w-sm">
                    <ResetPasswordForm />
                </div>
            </div>
            <Footer />
        </>
    )
}