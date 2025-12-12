"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"

export default function HeroSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  
  const [isVisible, setIsVisible] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [bgImage, setBgImage] = useState("/bicycle-in-nature-scenic-landscape.jpg")
  // Дефолтна картинка, якщо в адмінці нічого не вибрано
  const [bikeImage, setBikeImage] = useState("/modern-bicycle-rental-bike-isolated.jpg")

  useEffect(() => {
    setIsVisible(true)
    fetchHeroSettings()
  }, [])

  async function fetchHeroSettings() {
    // Отримуємо дані з таблиці settings
    const { data } = await supabase
      .from('settings')
      .select('*')
      .in('key', ['hero_status', 'hero_bg_image', 'hero_bike_image'])
    
    if (data) {
      data.forEach((item: any) => {
        if (item.key === 'hero_status') setIsAvailable(item.value === 'true')
        if (item.key === 'hero_bg_image' && item.value) setBgImage(item.value)
        // Якщо в адмінці вибрано велосипед - ставимо його
        if (item.key === 'hero_bike_image' && item.value) setBikeImage(item.value)
      })
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
      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <img
          src={bgImage}
          alt="Hero Background"
          className="h-full w-full object-cover"
        />
        {/* Напівпрозоре накладання, щоб текст читався краще */}
        <div className="absolute inset-0 bg-white/60 sm:bg-white/40 backdrop-blur-[2px]"></div> 
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className={`flex flex-col justify-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            
            <div className={`mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 border backdrop-blur-md bg-white/80 shadow-sm ${
              isAvailable ? "border-green-200 text-green-800" : "border-red-200 text-red-800"
            }`}>
              <span className={`h-2 w-2 rounded-full ${isAvailable ? "bg-green-600 animate-pulse" : "bg-red-600"}`}></span>
              <span className="text-sm font-bold">
                 {isAvailable ? t("hero.badge_available") : t("hero.badge_unavailable")}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl mb-6 leading-tight drop-shadow-sm">
              {t("hero.headline")}
            </h1>
            <p className="text-lg text-gray-800 mb-8 font-medium max-w-lg leading-relaxed">
              {t("hero.subheadline")}
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={handleScrollToBikes} className="bg-green-600 text-white rounded-xl h-14 px-8 text-lg shadow-xl hover:bg-green-700 hover:scale-105 transition-all">
                {t("hero.cta")}
              </Button>
            </div>
          </div>

          {/* ✅ НОВИЙ БЛОК З КАРТИНКОЮ (Без білого квадрата) */}
          <div className={`relative h-[350px] sm:h-[450px] lg:h-[550px] w-full flex items-center justify-center mt-8 lg:mt-0 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"}`}>
            
            <motion.img
              src={bikeImage}
              alt="Hero Bike"
              // Додаємо сильну тінь (drop-shadow-2xl) до самої картинки
              className="relative w-full h-full object-contain hover:scale-105 transition-transform duration-500 filter drop-shadow-2xl z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            />
            
            {/* Декоративна тінь на "землі" під велосипедом */}
            <div className="absolute bottom-10 w-2/3 h-6 bg-black/20 blur-2xl rounded-[100%] z-0"></div>
          </div>

        </div>
      </div>
    </section>
  )
}