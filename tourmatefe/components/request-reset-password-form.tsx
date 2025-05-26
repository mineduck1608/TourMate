"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RequestResetPassword } from "@/app/api/account.api"
import { toast } from "react-toastify"
import { useState } from "react"

export function RequestResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false)

  async function handleRequestReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return // chặn khi đang gửi

    const form = e.currentTarget  // lưu form tại đây
    const formData = new FormData(form)
    const email = formData.get("email") as string

    if (!email) {
      toast.error("Vui lòng nhập email hợp lệ")
      return
    }

    try {
      setLoading(true)
      const result = await RequestResetPassword(email)
      toast.success(result || "Yêu cầu gửi link đặt lại mật khẩu thành công")
      form.reset() // reset form an toàn
    } catch (err) {
      toast.error(
        (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg ||
        (err instanceof Error ? err.message : "Đã xảy ra lỗi, vui lòng thử lại")
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleRequestReset}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
            </a>
            <h1 className="text-xl font-bold">Đặt lại mật khẩu</h1>
            <div className="text-center text-sm">
              Hãy nhập email của bạn vào ô dưới đây để khôi phục!!!
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang gửi..." : "Khôi phục"}
            </Button>
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"></div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Sau khi nhấn khôi phục, hãy kiểm tra email của bạn để nhận hướng dẫn đặt lại mật khẩu.
      </div>
    </div>
  )
}
