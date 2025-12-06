"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Check, X, Trash2, Star, MessageSquare } from "lucide-react"

interface Review {
  id: number
  created_at: string
  client_name: string
  rating: number
  content: string
  is_approved: boolean
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    setLoading(true)
    // Бачимо ВСІ відгуки, сортуємо: нові зверху
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setReviews(data)
    setLoading(false)
  }

  // Опублікувати / Сховати
  async function toggleApproval(id: number, currentStatus: boolean) {
    // Оптимістичне оновлення (щоб інтерфейс був швидким)
    setReviews(prev => prev.map(r => r.id === id ? { ...r, is_approved: !currentStatus } : r))

    await supabase.from('reviews').update({ is_approved: !currentStatus }).eq('id', id)
  }

  async function deleteReview(id: number) {
    if (!confirm("Видалити цей відгук?")) return
    setReviews(prev => prev.filter(r => r.id !== id))
    await supabase.from('reviews').delete().eq('id', id)
  }

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-gray-900">Модерація Відгуків</h1>

      <Card>
        <CardHeader>
          <CardTitle>Всі відгуки ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-green-600" /></div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className={`p-4 border rounded-lg flex flex-col md:flex-row gap-4 justify-between items-start ${review.is_approved ? 'bg-white' : 'bg-yellow-50 border-yellow-200'}`}>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-gray-900">{review.client_name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <p className="text-gray-700 text-sm italic">"{review.content}"</p>
                    
                    {!review.is_approved && (
                      <span className="inline-block mt-2 text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                        На перевірці (Не видно на сайті)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Кнопка Опублікуватимо / Сховати */}
                    <Button 
                      size="sm" 
                      variant={review.is_approved ? "outline" : "default"}
                      className={review.is_approved ? "text-gray-500" : "bg-green-600 hover:bg-green-700 text-white"}
                      onClick={() => toggleApproval(review.id, review.is_approved)}
                    >
                      {review.is_approved ? "Сховати" : "Опублікувати"}
                    </Button>

                    <Button size="icon" variant="destructive" onClick={() => deleteReview(review.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>

                </div>
              ))}
              {reviews.length === 0 && <p className="text-center text-gray-500">Відгуків поки немає.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}