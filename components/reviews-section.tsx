"use client"

import { useRef, useEffect, useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"

interface Review {
  name: string
  content: string
  rating: number
  avatar: string
  timestamp?: string
}

interface ReviewsSectionProps {
  onLeaveReviewClick?: () => void
  reviews: Review[]
}

export default function ReviewsSection({ onLeaveReviewClick, reviews }: ReviewsSectionProps) {
  const { t } = useLanguage()
  const { isLoggedIn } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-secondary py-20 lg:py-32"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease-out",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 flex items-center justify-between">
          <h2 className="text-balance text-4xl font-bold text-foreground">{t("reviews.title")}</h2>
          {isLoggedIn ? (
            <Button onClick={onLeaveReviewClick} className="bg-primary hover:bg-primary/90">
              {t("reviews.writeReview")}
            </Button>
          ) : (
            <div className="relative group">
              <Button disabled className="bg-primary/50 text-primary-foreground cursor-not-allowed">
                {t("reviews.writeReview")}
              </Button>
              <div className="absolute hidden group-hover:block bg-foreground text-white text-xs rounded px-2 py-1 whitespace-nowrap -top-10 right-0">
                {t("reviews.loginReview")}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex flex-col h-full p-6 rounded-lg bg-white border border-border hover:shadow-lg transition-shadow animate-in fade-in duration-500"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.8s ease-out ${index * 0.1}s`,
              }}
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Review Text */}
              <div className="mb-6 flex-1 overflow-y-auto max-h-32 break-words">
                <p className="text-foreground leading-relaxed">"{review.content}"</p>
              </div>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  {review.avatar}
                </div>
                <p className="text-sm font-semibold text-foreground">{review.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
