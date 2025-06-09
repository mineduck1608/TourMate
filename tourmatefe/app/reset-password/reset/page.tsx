"use client"

import { Suspense } from "react";

import Footer from "@/components/Footer";
import MegaMenu from "@/components/mega-menu";
import ResetPasswordForm from "@/components/reset-password-form";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <MegaMenu />
            <div className="flex flex-col items-center justify-center gap-6 bg-background p-6 my-8 md:p-10">
                <div className="w-full max-w-sm">
                    <ResetPasswordForm />
                </div>
            </div>
            <Footer />
        </Suspense>
    )
}