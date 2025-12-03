"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { supabase } from "@/lib/supabase"

export default function HeroSection() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  // 👇 Стан для статусу
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    fetchHeroStatus() // Питаємо базу при завантаженні
  }, [])

  async function fetchHeroStatus() {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'hero_status')
      .single()
    
    if (data) {
      setIsAvailable(data.value === 'true')
    }
  }

  const handleScrollToBikes = () => {
    document.getElementById("bikes")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-white pt-20"
    >
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <img
          src="/bicycle-in-nature-scenic-landscape.jpg"
          alt="Bicycle in nature"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/40"></div> 
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          <div className={`flex flex-col justify-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            
            {/* 👇 ДИНАМІЧНИЙ БЕЙДЖ */}
            <div 
              className={`mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 border ${
                isAvailable 
                  ? "bg-green-100 border-green-200"  // Стиль, якщо доступні
                  : "bg-red-100 border-red-200"      // Стиль, якщо немає
              }`}
            >
              <span 
                className={`h-2 w-2 rounded-full ${
                  isAvailable 
                    ? "bg-green-600 animate-pulse"   // Зелена цятка
                    : "bg-red-600"                   // Червона цятка
                }`}
              ></span>
              <span 
                className={`text-sm font-medium ${
                  isAvailable ? "text-green-800" : "text-red-800"
                }`}
              >
                 {/* Якщо доступні - беремо ключ "hero.badge_available" ("Доступні велосипеди")
                     Якщо ні - беремо "hero.badge_unavailable" ("Немає в наявності") */}
                 {isAvailable 
                   ? (t("hero.badge_available") || "Доступні велосипеди") 
                   : (t("hero.badge_unavailable") || "Немає в наявності")}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl mb-6">
              {t("hero.headline")}
            </h1>
            <p className="text-lg text-gray-800 mb-8 font-medium">
              {t("hero.subheadline")}
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={handleScrollToBikes} className="bg-green-600 text-white rounded-lg h-12 px-8 shadow-lg hover:bg-green-700">
                {t("hero.cta")}
              </Button>
            </div>
          </div>

          <div className={`flex justify-center mt-8 lg:mt-0 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"}`}>
            <img src="/modern-bicycle-rental-bike-isolated.jpg" alt="Bike" className="w-full max-w-md drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}