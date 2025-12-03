"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { supabase } from "@/lib/supabase"

export default function LocationSection() {
  const { language } = useLanguage()
  
  const [address, setAddress] = useState("ul. Karmelicka 3CF, Warszawa")
  
  // 👇 СТАНИ ДЛЯ КООРДИНАТ (Дефолт - старі координати)
  const [lat, setLat] = useState("52.244889")
  const [lng, setLng] = useState("20.993500")

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('*')
      if (data) {
        const map: any = {}
        data.forEach((item: any) => map[item.key] = item.value)
        
        if (map.shop_address) setAddress(map.shop_address)
        if (map.shop_lat) setLat(map.shop_lat) // Встановлюємо нові з бази
        if (map.shop_lng) setLng(map.shop_lng)
      }
    }
    fetchSettings()
  }, [])

  // 👇 ФОРМУЄМО ПОСИЛАННЯ ДИНАМІЧНО
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`
  const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  const content = {
    pl: { title: "Miejsce Odbioru", subtitle: "Wygodna lokalizacja w centrum Warszawy", button: "Wyznacz trasę" },
    ua: { title: "Місце Оренди", subtitle: "Зручна локація в центрі Варшави", button: "Прокласти маршрут" },
    en: { title: "Pickup Location", subtitle: "Convenient location in Warsaw center", button: "Get Directions" }
  }

  const t = content[language] || content.pl

  return (
    <section id="pickup" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gray-200 group">
          
          <iframe 
            src={mapUrl}
            className="absolute inset-0 w-full h-full border-0 grayscale-[20%] hover:grayscale-0 transition-all duration-500"
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-white p-6 rounded-xl shadow-lg max-w-xs transition-transform hover:scale-105 duration-300">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">RowerRent Point</h3>
                <p className="text-gray-600 text-sm mb-4">{address}</p>
                
                <a 
                  href={directionUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="md:hidden inline-block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  {t.button}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}