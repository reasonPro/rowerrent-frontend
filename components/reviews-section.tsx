"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star, MessageSquare, Lock, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"

interface Review {
  id: number
  client_name: string
  content: string
  rating: number
  created_at: string
}

interface ReviewsSectionProps {
  onLeaveReviewClick: () => void
}

export default function ReviewsSection({ onLeaveReviewClick }: ReviewsSectionProps) {
  const { t } = useLanguage()
  const { isLoggedIn } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  
  // 👇 Стан для показу попередження
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    async function fetchPublicReviews() {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(4)

      if (data) setReviews(data)
    }
    fetchPublicReviews()
  }, [])

  const handleReviewClick = () => {
    if (isLoggedIn) {
      onLeaveReviewClick()
    } else {
      // 👇 Замість alert показуємо текст
      setShowWarning(true)
      // Ховаємо через 3 секунди
      setTimeout(() => setShowWarning(false), 3000)
    }
  }

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{t("reviews.title")}</h2>
            <p className="text-gray-600">Реальні відгуки наших користувачів</p>
          </div>
          
          {/* 👇 Обгортка для кнопки і тексту помилки */}
          <div className="flex flex-col items-center md:items-end relative">
            <Button 
              onClick={handleReviewClick} 
              className={`gap-2 text-white transition-all ${
                isLoggedIn 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-gray-500 hover:bg-gray-600 opacity-90"
              }`}
            >
              {isLoggedIn ? <MessageSquare size={18} /> : <Lock size={18} />}
              {t("reviews.writeReview")}
            </Button>

            {/* Анімований текст помилки */}
            <AnimatePresence>
              {showWarning && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 right-0 text-red-500 text-sm font-medium flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 shadow-sm whitespace-nowrap z-10"
                >
                  <AlertCircle size={14} />
                  {t("reviews.loginWarning")}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }} viewport={{ once: true }}>
              <Card className="h-full border-gray-100 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="max-h-32 overflow-y-auto text-sm text-gray-600 mb-4 italic whitespace-pre-wrap break-words">
                    "{review.content}"
                  </div>
                  
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
                      {review.client_name.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-bold text-sm text-gray-900">{review.client_name}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {reviews.length === 0 && (
            <div className="col-span-4 text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
              Ще немає відгуків. Будьте першим!
            </div>
          )}
        </div>
      </div>
    </section>
  )
}