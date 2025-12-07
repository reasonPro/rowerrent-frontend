"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Zap, Battery, Disc, Timer, AlertCircle } from "lucide-react"
import SkeletonCard from "@/components/skeleton-card"
import { supabase } from "@/lib/supabase"

export interface Bike {
  id: number
  name: string
  category: string
  image: string
  isAvailable: boolean
  dayPrice: number
  weekPrice: number
  monthPrice: number
  specs: {
    wheels: string
    brakes: string
    motor: string
    battery: string
  }
}

interface BikesCatalogProps {
  onBookClick: (bike: Bike) => void
}

export default function BikesCatalog({ onBookClick }: BikesCatalogProps) {
  const { t, language } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bikes, setBikes] = useState<Bike[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)
  
  const [pricingType, setPricingType] = useState<Record<number, "day" | "week" | "month">>({})

  // Допоміжна функція для витягування тексту з jsonb
  const getSpecText = (spec: any) => {
    if (typeof spec === 'string') return spec
    return spec?.[language] || spec?.['pl'] || "—"
  }

  useEffect(() => {
    async function fetchBikes() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.from('bikes').select('*').order('id', { ascending: true })
        if (error) throw error

        if (data) {
          const mappedBikes: Bike[] = data.map((b: any) => ({
            id: b.id,
            name: b.name,
            category: b.category,
            image: b.image_url,
            isAvailable: b.is_available,
            dayPrice: b.price_day,
            weekPrice: b.price_week,
            monthPrice: b.price_month,
            specs: {
              wheels: getSpecText(b.wheels),
              brakes: getSpecText(b.brakes),
              motor: getSpecText(b.motor),
              battery: getSpecText(b.battery)
            }
          }))
          setBikes(mappedBikes)
        }
      } catch (err: any) {
        console.error(err)
        setError("Помилка завантаження.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchBikes()
  }, [language]) 

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true) }, { threshold: 0.1 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const priceLabels = {
    day: t("bikes.day") || "День",
    week: t("bikes.week") || "Тиждень",
    month: t("bikes.month") || "Місяць"
  }

  return (
    <section id="bikes" ref={sectionRef} className="w-full bg-white py-20 lg:py-32" style={{ opacity: isVisible ? 1 : 0, transition: "all 0.8s ease-out" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("bikes.title")}</h2>
          <p className="text-lg text-gray-600">{t("bikes.choose")}</p>
        </div>

        {error ? <div className="text-center text-red-500">{error}</div> : (
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {isLoading ? [1, 2].map(i => <SkeletonCard key={i} />) : bikes.map(bike => {
               // Визначаємо поточний тариф
               const currentPriceType = pricingType[bike.id] || "day"
               
               // Визначаємо ціну на основі тарифу
               const currentPrice = currentPriceType === 'day' ? bike.dayPrice : currentPriceType === 'week' ? bike.weekPrice : bike.monthPrice

               return (
                 <div key={bike.id} className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative h-64 bg-gray-50 flex items-center justify-center p-4">
                        <img src={bike.image} alt={bike.name} className="h-full w-full object-contain hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400?text=No+Image" }} />
                        <div className={`absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${bike.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          <span className={`h-2 w-2 rounded-full ${bike.isAvailable ? "bg-green-600 animate-pulse" : "bg-red-600"}`}></span>
                          {bike.isAvailable ? (t("bikes.availability") || "Доступний") : (t("bikes.unavailable") || "Немає в наявності")}
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6 lg:p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">{bike.name}</h3>

                      <div className="mb-8 grid grid-cols-2 gap-y-4 gap-x-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600"><Timer className="h-4 w-4 text-green-600" /><span>{t("bikes.wheels")}: <b>{bike.specs.wheels}</b></span></div>
                        <div className="flex items-center gap-2 text-sm text-gray-600"><Disc className="h-4 w-4 text-green-600" /><span>{t("bikes.brakes")}: <b>{bike.specs.brakes}</b></span></div>
                        <div className="flex items-center gap-2 text-sm text-gray-600"><Zap className="h-4 w-4 text-green-600" /><span>{t("bikes.motor")}: <b>{bike.specs.motor}</b></span></div>
                        <div className="flex items-center gap-2 text-sm text-gray-600"><Battery className="h-4 w-4 text-green-600" /><span>{t("bikes.battery")}: <b>{bike.specs.battery}</b></span></div>
                      </div>

                      <div className="mb-6 flex p-1 bg-gray-100 rounded-xl">
                          {(["day", "week", "month"] as const).map((itemType) => (
                            <button key={itemType} onClick={() => setPricingType({ ...pricingType, [bike.id]: itemType })} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${currentPriceType === itemType ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>
                              {priceLabels[itemType]}
                            </button>
                          ))}
                        </div>
                        
                        <div className="mb-6 flex items-baseline gap-2">
                          {/* 👇 ТУТ ТЕПЕР ВИКОРИСТОВУЄТЬСЯ currentPrice, ЯКИЙ МИ ПОРАХУВАЛИ ВИЩЕ */}
                          <span className="text-4xl font-bold text-gray-900">{currentPrice}</span>
                          <span className="text-lg text-gray-500 font-medium">zł</span>
                        </div>
                        
                        <Button onClick={bike.isAvailable ? () => onBookClick(bike) : undefined} disabled={!bike.isAvailable} size="lg" className={`w-full h-12 text-base font-bold rounded-xl shadow-md transition-all ${bike.isAvailable ? "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg" : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"}`}>
                          {bike.isAvailable ? t("bikes.book") : t("bikes.soldOut")}
                        </Button>
                    </div>
                 </div>
               )
            })}
          </div>
        )}
      </div>
    </section>
  )
}