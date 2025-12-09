"use client"

import { useState, useEffect } from "react"
import { Instagram, Send, MapPin, Phone, Mail, MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/components/language-provider"

interface FooterProps {
  onTermsClick: () => void
  onPrivacyClick: () => void
}

export default function Footer({ onTermsClick, onPrivacyClick }: FooterProps) {
  const { t } = useLanguage()
  
  const [address, setAddress] = useState("ul. Karmelicka 3CF, Warszawa")
  const [phone, setPhone] = useState("+48 12 345 67 89")
  
  // Стан для соцмереж
  const [links, setLinks] = useState({
    instagram: "https://instagram.com",
    telegram: "https://t.me",
    whatsapp: "https://wa.me"
  })

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('*')
      if (data) {
        const map: any = {}
        data.forEach((item: any) => map[item.key] = item.value)
        
        if (map.shop_address) setAddress(map.shop_address)
        if (map.contact_phone) setPhone(map.contact_phone)
        
        // Оновлюємо лінки
        setLinks({
          instagram: map.social_instagram || "https://instagram.com",
          telegram: map.social_telegram || "https://t.me",
          whatsapp: map.social_whatsapp || "https://wa.me"
        })
      }
    }
    fetchSettings()
  }, [])

  return (
    <footer id="contact" className="bg-gray-900 text-gray-300 py-12 lg:py-16 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
          
          {/* Колонка 1 */}
          <div className="space-y-4">
            <a href="#home" className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-white">ReworRent</span>
            </a>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {t("footer.about")}
            </p>
            
            <div className="flex gap-4 pt-2">
              <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href={links.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">
                <Send size={24} />
              </a>
              <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">
                <MessageCircle size={24} />
              </a>
            </div>
          </div>

          {/* Колонка 2 */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">{t("footer.navTitle")}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#home" className="hover:text-green-500 transition-colors">{t("header.main")}</a></li>
              <li><a href="#pickup" className="hover:text-green-500 transition-colors">{t("header.pickup")}</a></li>
              <li><a href="#bikes" className="hover:text-green-500 transition-colors">{t("header.bikes")}</a></li>
              <li><a href="#reviews" className="hover:text-green-500 transition-colors">{t("reviews.title")}</a></li>
            </ul>
          </div>

          {/* Колонка 3 */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">{t("footer.contactTitle")}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-green-600 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-green-600 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-green-600 shrink-0" />
                <a href="mailto:info@rowerrent.pl" className="hover:text-white transition-colors">info@rowerrent.pl</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>{t("footer.rights") || "© 2025 ReworRent. All rights reserved."}</p>
          <div className="flex gap-6">
            <button onClick={onTermsClick} className="hover:text-green-500 transition-colors">
              {t("footer.terms") || "Regulamin"}
            </button>
            <button onClick={onPrivacyClick} className="hover:text-green-500 transition-colors">
              {t("footer.privacy") || "Polityka Prywatności"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
