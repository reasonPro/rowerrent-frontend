"use client"

import { useState, useEffect } from "react"
import { X, Star, Loader2, AlertCircle } from "lucide-react" // Додав іконку помилки
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const { language } = useLanguage() // Беремо мову, щоб показувати помилки зрозумілою мовою
  const { user, userName } = useAuth()
  
  // Локальні тексти для помилок (щоб не лізти в словник)
  const errorText = {
    pl: { exists: "Już dodałeś opinię.", limit: "Limit 500 znaków.", generic: "Wystąpił błąd." },
    ua: { exists: "Ви вже залишили відгук.", limit: "Ліміт 500 символів.", generic: "Сталася помилка." },
    en: { exists: "You already reviewed.", limit: "Limit 500 chars.", generic: "Error occurred." }
  }[language]

  // Тексти інтерфейсу (беремо з провайдера або фолбек)
  const t = {
    title: language === 'ua' ? "Написати відгук" : language === 'pl' ? "Napisz opinię" : "Write a Review",
    rating: language === 'ua' ? "Ваша оцінка" : language === 'pl' ? "Twoja ocena" : "Your Rating",
    comment: language === 'ua' ? "Ваш коментар" : language === 'pl' ? "Twój komentarz" : "Your Comment",
    placeholder: language === 'ua' ? "Поділіться враженнями..." : language === 'pl' ? "Opisz swoje wrażenia..." : "Share your experience...",
    submit: language === 'ua' ? "Надіслати" : language === 'pl' ? "Wyślij" : "Submit",
    close: language === 'ua' ? "Закрити" : language === 'pl' ? "Zamknij" : "Close",
    success: language === 'ua' ? "Відгук надіслано!" : language === 'pl' ? "Wysłano!" : "Sent!",
    successDesc: language === 'ua' ? "Він з'явиться після перевірки." : language === 'pl' ? "Pojawi się po weryfikacji." : "Pending approval."
  }
  
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("") // Стан для красивої помилки

  // Скидаємо все при відкритті
  useEffect(() => {
    if (isOpen) {
      setRating(0)
      setComment("")
      setError("")
      setIsSuccess(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("") // Очищаємо старі помилки
    
    if (rating === 0 || !user) return

    setIsLoading(true)
    
    try {
      // 1. ПЕРЕВІРКА: Чи вже є відгук?
      const { data: existing } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existing) {
        setError(errorText.exists) // Показуємо красиву помилку
        setIsLoading(false)
        return
      }

      // 2. ВІДПРАВКА
      const { error: insertError } = await supabase.from('reviews').insert([
        {
          client_name: userName,
          user_id: user.id,
          rating: rating,
          content: comment,
          is_approved: false
        }
      ])

      if (insertError) throw insertError
      
      setIsSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2500)

    } catch (err: any) {
      if (err.code === '23505') {
         setError(errorText.exists)
      } else {
         setError(errorText.generic)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
          
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
            <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
          </div>

          <div className="p-6">
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="text-lg font-bold mb-2">{t.success}</h3>
                <p className="text-gray-600">{t.successDesc}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Зірочки */}
                <div className="space-y-2">
                  <Label>{t.rating}</Label>
                  <div className="flex gap-2 justify-center py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" className="focus:outline-none transition-transform hover:scale-110"
                        onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} onClick={() => setRating(star)}>
                        <Star size={32} className={`${star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} transition-colors`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Коментар з лічильником */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{t.comment}</Label>
                    {/* 👇 ЛІЧИЛЬНИК СИМВОЛІВ */}
                    <span className={`text-xs ${comment.length >= 500 ? "text-red-500 font-bold" : "text-gray-400"}`}>
                      {comment.length}/500
                    </span>
                  </div>
                  <textarea 
                    className="flex min-h-[100px] w-full rounded-md border border-input px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder={t.placeholder} 
                    value={comment} 
                    // 👇 ОБМЕЖЕННЯ 500 СИМВОЛІВ
                    onChange={(e) => setComment(e.target.value.slice(0, 500))} 
                    required
                  />
                </div>

                {/* 👇 БЛОК ПОМИЛКИ (З'являється, якщо вже є відгук) */}
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 border border-red-100 animate-pulse">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading || rating === 0}>
                  {isLoading ? <Loader2 className="animate-spin" /> : t.submit}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}