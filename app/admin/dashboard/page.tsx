"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Check, X, Bike, Archive, Trash2, Phone, User, Search, RefreshCw, Mail } from "lucide-react"

// Тип даних замовлення
interface Booking {
  id: number
  created_at: string
  client_name: string
  phone: string
  email: string
  bike_name: string
  total_price: number
  status: string
  start_date: string
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"new" | "active" | "archive" | "all">("new")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.error(error)
    else setBookings(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: number, newStatus: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
    const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id)
    if (error) {
      alert("Помилка оновлення")
      fetchBookings()
    }
  }

  const deleteBooking = async (id: number) => {
    if(!confirm("Видалити цей запис з історії назавжди?")) return
    setBookings(prev => prev.filter(b => b.id !== id))
    const { error } = await supabase.from('bookings').delete().eq('id', id)
    if (error) {
      alert("Помилка видалення")
      fetchBookings()
    }
  }

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.client_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.phone || "").includes(search) ||
      (b.email || "").toLowerCase().includes(search.toLowerCase()) || // Додав пошук по email
      (b.bike_name || "").toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false

    if (activeTab === 'all') return true
    if (activeTab === 'new') return b.status === 'New'
    if (activeTab === 'active') return b.status === 'Confirmed' || b.status === 'Active'
    if (activeTab === 'archive') return b.status === 'Completed' || b.status === 'Cancelled'
    
    return true
  })

  const counts = {
    new: bookings.filter(b => b.status === 'New').length,
    active: bookings.filter(b => b.status === 'Confirmed' || b.status === 'Active').length,
    archive: bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled').length
  }

  const getStatusBadge = (status: string) => {
    const styles: any = {
      'New': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Completed': 'bg-gray-100 text-gray-800 border-gray-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200',
    }
    const labels: any = {
      'New': 'Нове', 'Confirmed': 'Підтверджено', 'Active': 'Видано', 'Completed': 'Завершено', 'Cancelled': 'Скасовано',
    }
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles['New']}`}>
        {labels[status] || status}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    try {
      return new Date(dateString).toLocaleString('uk-UA', { 
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
      })
    } catch (e) { return dateString }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">CRM / Бронювання</h1>
        <Button variant="outline" onClick={fetchBookings} disabled={loading} size="sm">
          <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Оновити
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg w-full sm:w-fit">
        <button onClick={() => setActiveTab('new')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'new' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
          Нові {counts.new > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full min-w-[18px] text-center">{counts.new}</span>}
        </button>
        <button onClick={() => setActiveTab('active')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'active' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
          Активні {counts.active > 0 && <span className="bg-blue-500 text-white text-[10px] px-1.5 rounded-full min-w-[18px] text-center">{counts.active}</span>}
        </button>
        <button onClick={() => setActiveTab('archive')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'archive' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
          Архів ({counts.archive})
        </button>
        <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
          Всі
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Пошук клієнта, email або телефону..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-white border-gray-200 focus:border-green-500" />
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50/50">
          <CardTitle>Список замовлень</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="flex justify-center p-10"><Loader2 className="animate-spin text-green-600" /></div>
          ) : filteredBookings.length === 0 ? (
             <div className="text-center py-16 text-gray-500">
               <Archive className="mx-auto h-10 w-10 text-gray-300 mb-2" />
               <p>Замовлень не знайдено</p>
             </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredBookings.map((item) => (
                <div key={item.id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 hover:bg-gray-50 transition-colors gap-4">
                  
                  <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-4 w-full lg:w-auto">
                    
                    {/* Клієнт */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] text-gray-400">#{item.id}</span>
                        {getStatusBadge(item.status)}
                      </div>
                      <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                        <User size={14} className="text-gray-400" /> {item.client_name || "Гість"}
                      </h4>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <a href={`tel:${item.phone}`} className="text-xs text-gray-600 hover:text-green-600 flex items-center gap-1">
                          <Phone size={12} /> {item.phone || "—"}
                        </a>
                        {/* 👇 ДОДАВ EMAIL СЮДИ */}
                        {item.email && (
                          <a href={`mailto:${item.email}`} className="text-xs text-gray-500 hover:text-green-600 flex items-center gap-1">
                            <Mail size={12} /> {item.email}
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Велосипед */}
                    <div className="flex flex-col justify-center">
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <Bike size={14} className="text-green-600" /> {item.bike_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(item.created_at)}
                      </div>
                    </div>

                    {/* Ціна */}
                    <div className="flex items-center md:justify-center lg:justify-start">
                       <span className="text-lg font-bold text-green-700">{item.total_price} zł</span>
                    </div>
                  </div>

                  {/* Дії */}
                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 mt-2 lg:mt-0">
                    {item.status === 'New' && (
                      <>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8" onClick={() => updateStatus(item.id, 'Confirmed')}><Check size={14} className="mr-1" /> Підтвердити</Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 h-8 px-2" onClick={() => updateStatus(item.id, 'Cancelled')}><X size={16} /></Button>
                      </>
                    )}
                    {item.status === 'Confirmed' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-8" onClick={() => updateStatus(item.id, 'Active')}><Bike size={14} className="mr-1" /> Видати</Button>
                        <Button size="sm" variant="ghost" className="text-gray-500 h-8 px-2" onClick={() => updateStatus(item.id, 'Cancelled')}>Скасувати</Button>
                      </>
                    )}
                    {item.status === 'Active' && (
                      <Button size="sm" className="bg-gray-800 hover:bg-gray-900 text-white h-8" onClick={() => updateStatus(item.id, 'Completed')}><Archive size={14} className="mr-1" /> Завершити</Button>
                    )}
                    {(item.status === 'Completed' || item.status === 'Cancelled') && (
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2" onClick={() => deleteBooking(item.id)}><Trash2 size={16} /></Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}