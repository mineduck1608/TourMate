import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
    {
        name: "Nguyễn Minh Anh",
        role: "Hướng dẫn viên tại Hà Nội",
        content:
            "Từ khi sử dụng gói Plus, thu nhập của tôi tăng 300%. Các công cụ marketing và khóa học rất hữu ích!",
        rating: 5,
        avatar: "https://kienthucnganhdulich.edu.vn/wp-content/uploads/2024/07/Vi-Tri-Huong-Dan-Vien-Du-Lich-Tour-Guide.jpg",
    },
    {
        name: "Trần Văn Hùng",
        role: "Hướng dẫn viên tại TP.HCM",
        content:
            "Gói Pro giúp tôi tiếp cận được nhiều khách hàng quốc tế hơn. Mentor 1-1 rất chuyên nghiệp và tận tâm.",
        rating: 5,
        avatar: "https://bachkhoasaigon.edu.vn/wp-content/uploads/2021/07/ngoai-hinh-nguoi-huong-dan-vien-du-lich.jpg",

    },
    {
        name: "Lê Thị Mai",
        role: "Hướng dẫn viên tại Đà Nẵng",
        content:
            "Platform này thay đổi hoàn toàn cách tôi làm việc. Từ nghiệp dư giờ tôi đã trở thành hướng dẫn viên chuyên nghiệp.",
        rating: 5,
        avatar: "https://sunghiephoc.com/wp-content/uploads/2016/06/vai-tro-cua-huong-dan-vien-du-lich-1.jpg",

    },
]

export function Testimonials() {
    return (
        <div className="mt-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Câu chuyện thành công</h2>
                <p className="text-gray-600">Hàng nghìn hướng dẫn viên đã thay đổi cuộc sống với chúng tôi</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <Card
                        key={index}
                        className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 italic">&quot;{testimonial.content}&quot;</p>
                            <div className="flex items-center gap-3">
                                <img
                                    src={testimonial.avatar || "/placeholder.svg"}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
