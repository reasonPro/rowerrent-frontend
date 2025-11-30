"use client"

import { MapPin } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function LocationSection() {
  const { language } = useLanguage()

  const content = {
    pl: {
      title: "Miejsce Odbioru",
      subtitle: "Wygodna lokalizacja w centrum Warszawy",
      button: "Wyznacz trasę"
    },
    ua: {
      title: "Місце Оренди",
      subtitle: "Зручна локація в центрі Варшави",
      button: "Прокласти маршрут"
    },
    en: {
      title: "Pickup Location",
      subtitle: "Convenient location in Warsaw center",
      button: "Get Directions"
    }
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
          
          {/* 👇 ТУТ ТЕПЕР ЖИВА КАРТА */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.467076628676!2d20.9930769!3d52.2461386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecc669a869f01%3A0x7292275b2734c26!2sKarmelicka%203%2C%2000-155%20Warszawa%2C%20Poland!5e0!3m2!1spl!2spl!4v1700000000000!5m2!1spl!2spl" 
            className="absolute inset-0 w-full h-full border-0 grayscale-[20%] hover:grayscale-0 transition-all duration-500"
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          {/* Картка з адресою поверх карти */}
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-white p-6 rounded-xl shadow-lg max-w-xs transition-transform hover:scale-105 duration-300">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">RowerRent Point</h3>
                <p className="text-gray-600 text-sm mb-4">ul. Karmelicka 3CF<br />00-155 Warszawa</p>
                
                {/* Кнопка відкриває реальний Google Maps */}
                <a 
                  href="https://www.google.com/maps/dir//ul.+Karmelicka+3,+00-155+Warszawa" 
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