import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TourGuide } from "@/types/tour-guide";
import { useState } from "react";

export default function ProfileForm({ tourGuide }: { tourGuide: TourGuide }) {
    const [formData, setFormData] = useState(tourGuide)
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    return (
        <form className={cn("flex flex-col gap-6")}>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleChange(e)}
                        required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                        <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleChange(e)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleChange(e)}
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
                                type="tel"
                                className="ps-10"
                                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                                required
                                value={formData.phone}
                                onChange={(e) => handleChange(e)}
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
                        >
                            <option value="" disabled>
                                Chọn giới tính
                            </option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                        </select>
                    </div>
                    <div className="grid gap-2">


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
                            <Input id="birthdate" type="date" className="ps-10" required />
                        </div>
                    </div>
                </div>
                <div className="flex items-start gap-2">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            type="checkbox"
                            className="w-4 h-4 border rounded bg-background border-input focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Hoặc tiếp tục với
                    </span>
                </div>
            </div>
        </form>
    )
}