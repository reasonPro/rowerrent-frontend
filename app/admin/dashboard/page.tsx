"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge" <--- Якщо буде помилка з Badge, розкоментуй це, коли створиш файл

export default function DashboardPage() {
  // Фейкові дані бронювань
  const [bookings] = useState([
    { id: "1001", client: "Олексій К.", phone: "+48 123 456 789", date: "2025-06-01", status: "New" },
    { id: "1002", client: "Марія В.", phone: "+48 987 654 321", date: "2025-06-02", status: "Confirmed" },
    { id: "1003", client: "Іван П.", phone: "+48 555 666 777", date: "2025-06-03", status: "Completed" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Бронювання</h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          Додати замовлення
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Останні замовлення</CardTitle>
          <CardDescription>Список всіх бронювань велосипедів.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">ID</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Клієнт</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Телефон</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Дата</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Статус</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Дії</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{booking.id}</td>
                    <td className="p-4 align-middle">{booking.client}</td>
                    <td className="p-4 align-middle">{booking.phone}</td>
                    <td className="p-4 align-middle">{booking.date}</td>
                    <td className="p-4 align-middle">
                      {/* Проста імітація бейджа кольором тексту */}
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        booking.status === 'New' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                        Ред.
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}