"use client"

import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  hoveredRating: number
  onRatingChange: (rating: number) => void
  onHover: (rating: number) => void
  onLeave: () => void
}

export function StarRating({ rating, hoveredRating, onRatingChange, onHover, onLeave }: StarRatingProps) {
  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Rất không hài lòng"
      case 2:
        return "Không hài lòng"
      case 3:
        return "Bình thường"
      case 4:
        return "Hài lòng"
      case 5:
        return "Rất hài lòng"
      default:
        return ""
    }
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="transition-colors duration-200"
            onMouseEnter={() => onHover(star)}
            onMouseLeave={onLeave}
            onClick={() => onRatingChange(star)}
          >
            <Star
              className={`h-8 w-8 ${
                star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      {rating > 0 && <p className="text-sm text-gray-500">{getRatingText(rating)}</p>}
    </div>
  )
}
