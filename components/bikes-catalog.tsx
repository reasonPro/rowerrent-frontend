"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Zap, Battery, Disc, Timer } from "lucide-react" // Іконки
import SkeletonCard from "@/components/skeleton-card"

interface BikesCatalogProps {
  onBookClick: () => void
}

export default function BikesCatalog({ onBookClick }: BikesCatalogProps) {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  const [pricingType, setPricingType] = useState<Record<number, "day" | "week" | "month">>({
    1: "day",
    2: "day",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

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

  // 👇 ТВОЇ ДАНІ (Повернув як було у тебе)
  const bikes = [
    {
      id: 1,
      name: "Urban Pro",
      category: "city",
      image: "/OT05proA.2.jpeg", // Твоя картинка
      specs: {
        wheels: "27.5''",
        brakes: "Hydraulic",
        motor: "250W",
        battery: "18.5Ah",
      },
      dayPrice: 50,
      weekPrice: 180,
      monthPrice: 720,
      isAvailable: true,
    },
    {
      id: 2,
      name: "Mountain Beast",
      category: "mountain",
      image: "/L7electricbike.jpeg", // Твоя картинка
      specs: {
        wheels: "27.5''",
        brakes: "Hydraulic", // Повернув як у тебе було
        motor: "250W",
        battery: "18.5Ah",
      },
      dayPrice: 50,
      weekPrice: 180,
      monthPrice: 720,
      isAvailable: true, // Зміни на false, щоб перевірити червоний бейдж
    },
  ]

  const priceLabels = {
    day: t("bikes.day") || "День",
    week: t("bikes.week") || "Тиждень",
    month: t("bikes.month") || "Місяць"
  }

  return (
    <section
      id="bikes"
      ref={sectionRef}
      className="w-full bg-white py-20 lg:py-32"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease-out",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок */}
        <div className="mb-16 text-center">
          <h2 className="text-balance text-4xl font-bold text-gray-900 mb-4">{t("bikes.title")}</h2>
          <p className="text-lg text-gray-600">{t("bikes.choose")}</p>
        </div>

        {/* Сітка велосипедів */}
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {isLoading
            ? [1, 2].map((i) => <SkeletonCard key={i} />)
            : bikes.map((bike) => (
                <div
                  key={bike.id}
                  // 👇 СТИЛЬ: Новий дизайн (заокруглення, тіні)
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  
                  {/* Картинка */}
                  <div className="relative h-64 bg-gray-50 flex items-center justify-center p-4">
                    <img
                      src={bike.image}
                      alt={bike.name}
                      // 👇 FIX: object-contain покаже все фото цілком
                      className="h-full w-full object-contain hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* ЛОГІКА СТАТУСУ (Зелений/Червоний) */}
                    <div className={`absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                      bike.isAvailable 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${bike.isAvailable ? "bg-green-600 animate-pulse" : "bg-red-600"}`}></span>
                      {bike.isAvailable 
                        ? (t("bikes.availability") || "Доступний") 
                        : (t("bikes.unavailable") || "Немає в наявності")}
                    </div>
                  </div>

                  {/* Контент */}
                  <div className="flex flex-1 flex-col p-6 lg:p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{bike.name}</h3>

                    {/* Характеристики (з іконками, але твоїми даними) */}
                    <div className="mb-8 grid grid-cols-2 gap-y-4 gap-x-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Timer className="h-4 w-4 text-green-600 shrink-0" />
                        <span>{t("bikes.wheels")}: <span className="font-semibold text-gray-900">{bike.specs.wheels}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Disc className="h-4 w-4 text-green-600 shrink-0" />
                        <span>{t("bikes.brakes")}: <span className="font-semibold text-gray-900">{bike.specs.brakes}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Zap className="h-4 w-4 text-green-600 shrink-0" />
                        <span>{t("bikes.motor")}: <span className="font-semibold text-gray-900">{bike.specs.motor}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Battery className="h-4 w-4 text-green-600 shrink-0" />
                        <span>{t("bikes.battery")}: <span className="font-semibold text-gray-900">{bike.specs.battery}</span></span>
                      </div>
                    </div>

                    {/* Перемикач цін */}
                    <div className="mb-6 flex p-1 bg-gray-100 rounded-xl">
                      {(["day", "week", "month"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setPricingType({ ...pricingType, [bike.id]: type })}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            pricingType[bike.id] === type 
                              ? "bg-white text-green-700 shadow-sm" 
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          {priceLabels[type]}
                        </button>
                      ))}
                    </div>

                    {/* Ціна */}
                    <div className="mb-6 flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {pricingType[bike.id] === "day"
                          ? bike.dayPrice
                          : pricingType[bike.id] === "week"
                            ? bike.weekPrice
                            : bike.monthPrice}
                      </span>
                      <span className="text-lg text-gray-500 font-medium">
                        zł
                      </span>
                    </div>

                    {/* Кнопка */}
                    <Button
                      onClick={bike.isAvailable ? onBookClick : undefined}
                      disabled={!bike.isAvailable}
                      size="lg"
                      className={`w-full h-12 text-base font-bold rounded-xl shadow-md transition-all ${
                        bike.isAvailable
                          ? "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {bike.isAvailable ? (t("bikes.book") || "Забронювати") : (t("bikes.soldOut") || "Розпродано")}
                    </Button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}