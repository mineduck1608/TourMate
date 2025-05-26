"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"
import { useQueryString } from "@/app/utils/utils"
import { GalleryVerticalEnd } from "lucide-react"
import { ResetPassword } from "@/app/api/account.api"
import { useRouter } from "next/navigation"

export default function ResetPasswordForm() {
    const router = useRouter()  // <-- Thêm useRouter
  const queryString: { token?: string } = useQueryString();
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Kiểm tra token tồn tại
  useEffect(() => {
    if (typeof queryString.token === "string" && queryString.token.length > 0) {
      setTokenValid(true)
    } else {
      setTokenValid(false)
    }
  }, [queryString.token])

  // Kiểm tra trùng mật khẩu và hiển thị lỗi trực tiếp
  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
    } else {
      setError(null)
    }
  }, [newPassword, confirmPassword])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return

    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu và xác nhận mật khẩu")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    if (!tokenValid) {
      setError("Token không hợp lệ hoặc không tồn tại")
      return
    }

    setError(null)
    try {
      setLoading(true)
      const response = await ResetPassword(queryString.token as string, newPassword)
      toast.success(response.msg || "Đổi mật khẩu thành công.")
      setNewPassword("")
      setConfirmPassword("")
      // Bạn có thể redirect về login sau vài giây nếu muốn:
      router.push("/login")
    } catch (error) {
      let message = "Đã xảy ra lỗi, vui lòng thử lại";
      if (typeof error === "object" && error !== null) {
        if ("response" in error && typeof error.response === "object" && error.response !== null && "msg" in error.response) {
          message = (error.response as { msg?: string }).msg || message;
        } else if ("message" in error && typeof (error as { message?: string }).message === "string") {
          message = (error as { message?: string }).message || message;
        }
      }
      setError(message);
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Token không hợp lệ</h2>
        <p>Vui lòng kiểm tra lại đường link đặt lại mật khẩu của bạn.</p>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
            </a>
            <h1 className="text-xl font-bold mb-6 text-center">Đặt lại mật khẩu mới</h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Nhập lại mật khẩu"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}