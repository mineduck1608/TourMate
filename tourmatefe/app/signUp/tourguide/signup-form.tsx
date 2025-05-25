"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import Axios from "axios";
import { TourGuide } from "@/types/tour-guide";
import ImageUpload from "@/components/image-upload";

// Add this before the SignupForm component
const registerTourGuide = async (data: Partial<TourGuide>) => {
  const response = await Axios.post(
    "https://localhost:7147/api/account/registertourguide",
    data
  );
  return response.data;
};

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    gender: "",
    phone: "",
    address: "",
    image: "",
    dateOfBirth: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: registerTourGuide,
    onSuccess: () => {
      router.push("/login"); // Redirect to login page
    },
    onError: (error: Error | unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      setError(errorMessage);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords không trùng");
      return;
    }

    // Submit form data
    mutation.mutate({
      ...formData,
      password: password,
    });
  };

  // Add handleChange function to update form data
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setError("Passwords không trùng");
    } else {
      setError("");
    }
  }, [password, confirmPassword]);

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-4 text-center mt-[-50]">
        <Link href="/">
          <Image
            src="/Logo.png"
            alt="TOURMATE Logo"
            width={180}
            height={180}
            className="mb-[-20]"
          />
        </Link>
        <h1 className="text-2xl font-bold">Tạo Tài Khoản</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Nhập thông tin của bạn bên dưới để tạo tài khoản.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Mật Khẩu</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Xác Nhận Mật Khẩu</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fullName">Họ Tên</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John"
              className="w-full"
              required
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 19 18"
                >
                  <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                </svg>
              </div>
              <Input
                id="phone"
                type="tel"
                className="ps-10"
                placeholder="(+84) 123-456-7890"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gender">Giới tính</Label>
            <select
              id="gender"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
              defaultValue=""
              onChange={handleChange}
            >
              <option value="" disabled>
                Chọn giới tính
              </option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main St"
              className="w-full"
              required
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dateOfBirth">Ngày sinh</Label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <Input
                id="dateOfBirth"
                type="date"
                className="ps-10"
                required
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Hình Đại Diện</Label>
          <ImageUpload
            onImageUpload={(url: string) =>
              setFormData((prev) => ({ ...prev, image: url }))
            }
          />
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        <div className="flex items-start gap-2">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 border rounded bg-background border-input focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <label htmlFor="terms" className="text-sm text-muted-foreground">
            Tôi đồng ý với{" "}
            <Link href="#" className="text-primary hover:underline">
              các điều khoản và điều kiện
            </Link>
          </label>
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Đăng Ký
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Hoặc tiếp tục với
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mr-2 h-4 w-4"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Đăng Nhập Với Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Đã có tài khoản?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Đăng Nhập
        </Link>
      </div>
    </form>
  );
}
