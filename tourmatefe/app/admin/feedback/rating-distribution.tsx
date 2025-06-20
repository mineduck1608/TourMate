import { Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface RatingDistributionProps {
  title: string
  description: string
  ratingDistribution: Array<{
    rating: number
    count: number
    percentage: number
  }>
}

export default function RatingDistribution({ title, description, ratingDistribution }: RatingDistributionProps) {
  return (
    <Card className="py-5">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {ratingDistribution.reverse().map((item) => (
          <div key={item.rating} className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 w-12">
              <span className="text-sm font-medium">{item.rating}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
            <div className="flex-1">
              <Progress value={item.percentage} className="h-2" />
            </div>
            <div className="text-sm text-muted-foreground w-16 text-right">
              {item.count} ({item.percentage.toFixed(0)}%)
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
