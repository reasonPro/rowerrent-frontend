"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Zap, Battery, Disc, Timer, AlertCircle } from "lucide-react"
import SkeletonCard from "@/components/skeleton-card"
import { supabase } from "@/lib/supabase"

// Описуємо, що характеристика - це об'єкт з 3 мовами
interface MultiLangString {
  pl: string
  ua: string
  en: string
}

interface Bike {
  id: number
  name: string
  category: string
  image: string
  isAvailable: boolean
  dayPrice: number
  weekPrice: number
  monthPrice: number
  specs: {
    wheels: MultiLangString
    brakes: MultiLangString
    motor: MultiLangString
    battery: MultiLangString
  }
}

export default function BikesCatalog({ onBookClick }: { onBookClick: () => void }) {
  const { t, language } = useLanguage() // Беремо поточну мову
  const [bikes, setBikes] = useState<Bike[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [pricingType, setPricingType] = useState<Record<number, "day" | "week" | "month">>({})

  // Функція, яка витягує правильний текст
  const getSpecText = (spec: MultiLangString | string) => {
    // Якщо це старий формат (просто текст) - повертаємо як є
    if (typeof spec === 'string') return spec
    // Якщо це новий формат (об'єкт) - повертаємо потрібну мову або PL як запасний
    return spec?.[language] || spec?.['pl'] || "—"
  }

  useEffect(() => {
    async function fetchBikes() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('bikes')
          .select('*')
          .order('id', { ascending: true })

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
              wheels: b.wheels,
              brakes: b.brakes,
              motor: b.motor,
              battery: b.battery
            }
          }))
          setBikes(mappedBikes)
        }
      } catch (err: any) {
        console.error("Error:", err.message)
        setError("Помилка завантаження.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchBikes()
  }, [])

  const priceLabels = {
    day: t("bikes.day") || "День",
    week: t("bikes.week") || "Тиждень",
    month: t("bikes.month") || "Місяць"
  }

  // ... (Решта коду така сама, як була, змінюємо тільки вивід характеристик) ...
  // Щоб не копіювати все, я дам тільки частину рендеру картки:

  return (
    <section id="bikes" className="w-full bg-white py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("bikes.title")}</h2>
          <p className="text-lg text-gray-600">{t("bikes.choose")}</p>
        </div>

        {error ? <div className="text-center text-red-500">{error}</div> : (
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {isLoading ? [1, 2].map(i => <SkeletonCard key={i} />) : bikes.map(bike => {
               const currentPriceType = pricingType[bike.id] || "day"
               const currentPrice = currentPriceType === 'day' ? bike.dayPrice : currentPriceType === 'week' ? bike.weekPrice : bike.monthPrice

               return (
                 <div key={bike.id} className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
                    {/* ... (Картинка без змін) ... */}
                    <div className="relative h-64 bg-gray-50 flex items-center justify-center p-4">
                        <img src={bike.image} alt={bike.name} className="h-full w-full object-contain" />
                        {/* ... бейджі ... */}
                    </div>

                    <div className="flex flex-1 flex-col p-6 lg:p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">{bike.name}</h3>

                      {/* 👇 ТУТ ВИКОРИСТОВУЄМО getSpecText */}
                      <div className="mb-8 grid grid-cols-2 gap-y-4 gap-x-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600"><Timer className="h-4 w-4 text-green-600" /><span>{t("bikes.wheels")}: <b>{getSpecText(bike.specs.wheels)}</b></span></div>
                        <div className="flex items-center gap-2 text-sm text-gray-600"><Disc className="h-4 w-4 text-green-600" /><span>{t("bikes.brakes")}: <b>{getSpecText(bike.specs.brakes)}</b></span></div>
                        <div className="flex items-center gap-2 text-sm text-gray-600"><Zap className="h-4 w-4 text-green-600" /><span>{t("bikes.motor")}: <b>{getSpecText(bike.specs.motor)}</b></span></div>
                        <div className="flex items-center gap-2 text-sm text-gray-600"><Battery className="h-4 w-4 text-green-600" /><span>{t("bikes.battery")}: <b>{getSpecText(bike.specs.battery)}</b></span></div>
                      </div>

                      {/* ... (Кнопки цін і Бронювання без змін) ... */}
                      <div className="mb-6 flex p-1 bg-gray-100 rounded-xl">
                          {(["day", "week", "month"] as const).map((type) => (
                            <button key={type} onClick={() => setPricingType({ ...pricingType, [bike.id]: type })} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${currentPriceType === type ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>
                              {priceLabels[type]}
                            </button>
                          ))}
                        </div>
                        <div className="mb-6 flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-gray-900">{currentPrice}</span>
                          <span className="text-lg text-gray-500 font-medium">zł</span>
                        </div>
                        <Button onClick={onBookClick} disabled={!bike.isAvailable} size="lg" className="w-full bg-green-600 text-white hover:bg-green-700">
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