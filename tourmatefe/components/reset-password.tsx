import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Key } from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"
import { useToken } from "./getToken"
import { MyJwtPayload } from "@/types/JwtPayload"
import { jwtDecode } from "jwt-decode"
import { useMutation } from "@tanstack/react-query"
import { changePassword } from "@/app/api/account.api"

export function ResetPass() {
    const [open, setOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = useToken("accessToken");
    const decoded: MyJwtPayload | null = token
        ? jwtDecode<MyJwtPayload>(token.toString())
        : null;
    const currentAccountId = decoded?.AccountId;

    const { mutate } = useMutation<ChangePasswordResponse, ApiError>({
        mutationFn: () =>
            changePassword(currentAccountId as number, currentPassword, newPassword),
        onMutate: () => setIsSubmitting(true),
        onSuccess: (res) => {
            toast.success(res?.msg || "Đổi mật khẩu thành công!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setOpen(false); // đóng modal
        },
        onError: (error) => {
            const message = error.response?.data?.msg || "Đổi mật khẩu thất bại, vui lòng thử lại.";
            toast.error(message);
        },
        onSettled: () => setIsSubmitting(false),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận không khớp.");
            return;
        }

        mutate();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="w-full flex items-center gap-3 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md">
                    <Key size={18} />
                    Đổi mật khẩu
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Đổi mật khẩu</DialogTitle>
                    <DialogDescription>
                        Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">Mật khẩu mới</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Hủy</Button>
                        </DialogClose>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
