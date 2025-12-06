"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { supabase } from "@/lib/supabase"

export default function HeroSection() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  // Стани для динамічних даних
  const [isAvailable, setIsAvailable] = useState(true)
  const [bgImage, setBgImage] = useState("/bicycle-in-nature-scenic-landscape.jpg")
  const [bikeImage, setBikeImage] = useState("/modern-bicycle-rental-bike-isolated.jpg")

  useEffect(() => {
    setIsVisible(true)
    fetchHeroSettings()
  }, [])

  async function fetchHeroSettings() {
    const { data } = await supabase
      .from('settings')
      .select('*')
      .in('key', ['hero_status', 'hero_bg_image', 'hero_bike_image'])
    
    if (data) {
      data.forEach((item: any) => {
        if (item.key === 'hero_status') setIsAvailable(item.value === 'true')
        if (item.key === 'hero_bg_image' && item.value) setBgImage(item.value)
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
      {/* Background Image (Динамічна) */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <img
          src={bgImage} // 👇 З БАЗИ
          alt="Hero Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/40"></div> 
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          <div className={`flex flex-col justify-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            
            <div className={`mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 border ${
              isAvailable ? "bg-green-100 border-green-200" : "bg-red-100 border-red-200"
            }`}>
              <span className={`h-2 w-2 rounded-full ${isAvailable ? "bg-green-600 animate-pulse" : "bg-red-600"}`}></span>
              <span className={`text-sm font-medium ${isAvailable ? "text-green-800" : "text-red-800"}`}>
                 {isAvailable ? t("hero.badge_available") : t("hero.badge_unavailable")}
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

          {/* Bike Image (Динамічна) */}
          <div className={`flex justify-center mt-8 lg:mt-0 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"}`}>
            <img 
              src={bikeImage} // 👇 З БАЗИ
              alt="Hero Bike" 
              className="w-full max-w-md drop-shadow-2xl" 
            />
          </div>
        </div>
      </div>
    </section>
  )
}