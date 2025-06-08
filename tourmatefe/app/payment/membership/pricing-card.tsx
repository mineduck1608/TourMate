import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PricingCardProps {
  title: string
  description: string
  price: number
  originalPrice?: number
  period: string
  features: string[]
  isPopular?: boolean
  discount?: string
}

export function PricingCard({
  title,
  description,
  price,
  originalPrice,
  period,
  features,
  isPopular = false,
  discount,
}: PricingCardProps) {
  return (
    <Card
      className={`relative  p-5 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
        isPopular ? "ring-2 ring-blue-500 shadow-blue-100" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-600 text-white px-4 py-1 flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3" />
            Phổ biến nhất
          </Badge>
        </div>
      )}

      {discount && (
        <div className="absolute -top-2 -right-2">
          <Badge variant="destructive" className="bg-red-500 shadow-lg">
            {discount}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{description}</p>

        <div className="space-y-2">
          {originalPrice && (
            <div className="text-gray-400 line-through text-lg">{originalPrice.toLocaleString("vi-VN")}đ</div>
          )}
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">{price.toLocaleString("vi-VN")}đ</span>
            <span className="text-gray-500 ml-2">/{period}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{feature}</span>
          </div>
        ))}
      </CardContent>

      <CardFooter>
        <Button
          className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
            isPopular
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              : "bg-gray-900 hover:bg-gray-800 text-white"
          }`}
        >
          Chọn gói {title}
        </Button>
      </CardFooter>
    </Card>
  )
}
