import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  reviews?: number
  className?: string
}

export function StarRating({ rating, reviews, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating)
          return (
            <Star
              key={i}
              className={cn(
                'h-3.5 w-3.5',
                filled
                  ? 'fill-accent text-accent'
                  : 'fill-transparent text-border',
              )}
              aria-hidden="true"
            />
          )
        })}
      </div>
      {reviews !== undefined && (
        <span className="text-xs text-muted-foreground">
          {rating.toFixed(1)} ({reviews})
        </span>
      )}
    </div>
  )
}
