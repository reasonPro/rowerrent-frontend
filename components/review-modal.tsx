"use client"

import type React from "react"
import { useState } from "react"
import { X, Loader2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (comment: string, rating: number) => void
}

export default function ReviewModal({ isOpen, onClose, onSubmit }: ReviewModalProps) {
  const { t } = useLanguage()
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim() && rating > 0) {
      setIsSubmitting(true)
      setTimeout(() => {
        onSubmit(comment, rating)
        setComment("")
        setRating(0)
        setIsSubmitting(false)
        onClose()
      }, 1000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-xl font-bold text-foreground">{t("review.title")}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">{t("review.rating")}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star size={28} className={star <= rating ? "fill-primary text-primary" : "text-muted-foreground"} />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-1">
              {t("review.comment")}
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("review.placeholder")}
              rows={4}
              maxLength={500}
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">{comment.length}/500</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              {t("review.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !comment.trim() || rating === 0}
              className={`flex-1 ${
                !isSubmitting && comment.trim() && rating > 0
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  {t("review.submitting")}
                </div>
              ) : (
                t("review.submit")
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
