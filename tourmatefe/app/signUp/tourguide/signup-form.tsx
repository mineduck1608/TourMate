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
      fullName: formData.fullName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      image: formData.image,
      phone: formData.phone,
      account: {
        email: formData.email,
        password: password,
      },
    } as Partial<TourGuide>);
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
