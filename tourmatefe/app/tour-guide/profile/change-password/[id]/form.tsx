"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TourGuide } from "@/types/tour-guide";
import { FormEvent, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
export default function ProfileForm({
  tourGuide,
  updateFn,
}: {
  tourGuide: TourGuide;
  updateFn: (password: string) => void;
}) {
  const [formData, setFormData] = useState(tourGuide);
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { value } = e.target;
    const acc = tourGuide.account;
    acc.password = value;
    setFormData((prev) => ({ ...prev, account: acc }));
  };
  function submit(e: FormEvent) {
    e.preventDefault();
    updateFn(formData.account.password);
  }
  const enabled =
    confirmPassword.length > 0 &&
    formData.account.password.length > 0 &&
    formData.account.password === confirmPassword;
  return (
    <form className={cn("flex flex-col gap-6")} onSubmit={(e) => submit(e)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={formData.fullName}
          readOnly
          required
        />
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Mật khẩu</Label>
          <Input
            id="fullName"
            type="password"
            name="fullName"
            value={formData.account.password}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fullName">Nhập lại mật khẩu</Label>
          <Input
            id="fullName"
            type="password"
            name="fullName"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <div className="grid">
            <label>
              <input disabled type="checkbox" name=""/>
              Ít nhất 12 kí tự
            </label>
          </div>
        </div>
      </div>

      <Button
        disabled={!enabled}
        className={cn(
          "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer"
        )}
      >
        Cập nhật thông tin
      </Button>
    </form>
  );
}
