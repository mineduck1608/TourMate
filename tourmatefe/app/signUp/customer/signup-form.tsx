"use client";

import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { createCustomer } from "@/app/api/account.api";
import { useRouter } from "next/navigation";
// import { Customer } from "@/types/customer";
import { toast } from "react-toastify";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "", // Add confirmPassword to formData
    fullName: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      toast.success("Đăng ký thành công!");
      setTimeout(() => {
        router.push("/login");
      }, 500);
    },
    onError: (error) => {
      
      setError(error.message || "Đăng ký thất bại");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }

    const { email, password, fullName, phone, gender, dateOfBirth } =
      formData;
    mutation.mutate({
      email,
      password,
      fullName,
      phone,
      gender,
      dateOfBirth,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
            name="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            required
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Mật Khẩu</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="full_name">Họ Tên</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className="w-full"
              required
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
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="ps-10"
                placeholder="0123-456-789"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gender">Giới tính</Label>
            <select
              id="gender"
              name="gender"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>
                Chọn giới tính
              </option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="birthdate">Ngày sinh</Label>
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
                id="birthdate"
                name="dateOfBirth"
                type="date"
                className="ps-10"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}
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
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Đang xử lý..." : "Đăng Ký"}
        </Button>
        <div className="text-center text-sm">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-gray-600 transition"
          >
            Đăng Nhập
          </Link>
        </div>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"></div>
        <div className="text-balance text-center text-xs text-black [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-gray-600">
          Bằng cách nhấn Đăng ký, bạn đồng ý với các{" "}
          <Link href="#">Điều khoản Dịch vụ</Link> và{" "}
          <Link href="#">Chính sách Bảo mật</Link> của chúng tôi.
        </div>
      </div>
    </form>
  );
}
