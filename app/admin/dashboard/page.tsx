"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Check, X, RefreshCw } from "lucide-react"

// Тип даних (має збігатися з колонками в Supabase)
interface Booking {
  id: number
  created_at: string
  client_name: string
  phone: string
  email: string
  bike_name: string
  total_price: number
  status: string // 'New', 'Confirmed', 'Cancelled'
  start_date: string
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Завантаження при вході
  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('id', { ascending: false }) // Найновіші зверху

    if (error) {
      console.error('Помилка:', error)
    } else {
      setBookings(data || [])
    }
    setLoading(false)
  }

  // 2. Зміна статусу (Підтвердити / Скасувати)
  async function updateStatus(id: number, newStatus: string) {
    // Спочатку оновлюємо візуально (щоб було швидко)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))

    // Потім шлемо в базу
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      alert("Не вдалося оновити статус")
      fetchBookings() // Відкатуємо назад, якщо помилка
    }
  }

  // Допоміжна функція для кольорів статусу
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200'
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'Підтверджено'
      case 'Cancelled': return 'Скасовано'
      default: return 'Нове'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Бронювання</h1>
        <Button variant="outline" onClick={fetchBookings} disabled={loading} className="gap-2">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Оновити
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Останні замовлення</CardTitle>
          <CardDescription>Керуйте запитами на оренду тут.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-green-600" /></div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm text-left">
                <thead className="[&_tr]:border-b bg-gray-50">
                  <tr className="border-b transition-colors">
                    <th className="h-12 px-4 align-middle font-medium text-gray-500">ID</th>
                    <th className="h-12 px-4 align-middle font-medium text-gray-500">Клієнт</th>
                    <th className="h-12 px-4 align-middle font-medium text-gray-500">Велосипед</th>
                    <th className="h-12 px-4 align-middle font-medium text-gray-500">Ціна</th>
                    <th className="h-12 px-4 align-middle font-medium text-gray-500">Статус</th>
                    <th className="h-12 px-4 align-middle font-medium text-gray-500 text-right">Дії</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-mono text-xs">{booking.id}</td>
                      <td className="p-4 align-middle">
                        <div className="font-medium">{booking.client_name}</div>
                        <div className="text-xs text-gray-500">{booking.phone}</div>
                        <div className="text-xs text-gray-400">{booking.email}</div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="font-medium">{booking.bike_name}</div>
                        <div className="text-xs text-gray-500">
                            {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 align-middle font-bold text-green-700">
                        {booking.total_price} zł
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => updateStatus(booking.id, 'Confirmed')}
                            title="Підтвердити"
                          >
                            <Check size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => updateStatus(booking.id, 'Cancelled')}
                            title="Скасувати"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        Поки що немає замовлень
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}