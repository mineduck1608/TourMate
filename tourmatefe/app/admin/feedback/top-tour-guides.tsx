import { Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TopTourGuidesProps {
  guides: Array<{
    id: number
    name: string
    avgRating: number
    count: number
  }>
}

export default function TopTourGuides({ guides }: TopTourGuidesProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  return (
    <Card className="py-5">
      <CardHeader>
        <CardTitle>Top Hướng dẫn viên</CardTitle>
        <CardDescription>Xếp hạng theo điểm đánh giá trung bình</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {guides.slice(0, 5).map((guide, index) => (
            <div key={guide.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold">{guide.name}</h4>
                  <p className="text-sm text-muted-foreground">{guide.count} đánh giá</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {renderStars(Math.round(guide.avgRating))}
                <span className="font-semibold">{guide.avgRating.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
