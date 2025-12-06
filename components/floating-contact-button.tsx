"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X, Send, MessageSquare } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { supabase } from "@/lib/supabase" // 👇 Підключили базу

export default function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false)
  
  // 👇 Стан для посилань (за замовчуванням пусті або стандартні)
  const [links, setLinks] = useState({
    telegram: "https://t.me/",
    whatsapp: "https://wa.me/"
  })

  // 👇 Завантажуємо реальні посилання з Адмінки
  useEffect(() => {
    async function fetchLinks() {
      const { data } = await supabase.from('settings').select('*')
      if (data) {
        const map: any = {}
        data.forEach((item: any) => map[item.key] = item.value)
        
        setLinks({
          telegram: map.social_telegram || "https://t.me/",
          whatsapp: map.social_whatsapp || "https://wa.me/"
        })
      }
    }
    fetchLinks()
  }, [])

  return (
    // 👇 ЗМІНА ПОЗИЦІЇ: bottom-10 right-10 (було bottom-6 right-6, тобто зсунули на ~16px вгору і вліво)
    <div className="fixed bottom-10 right-10 z-40 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-3"
          >
            {/* TELEGRAM (Іконка Send - літачок) */}
            <a
              href={links.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white text-gray-900 px-4 py-3 rounded-full shadow-xl hover:bg-blue-50 transition-colors border border-blue-100 group"
            >
              <span className="font-medium text-sm group-hover:text-blue-600 transition-colors">Telegram</span>
              <div className="bg-blue-500 text-white p-2 rounded-full shadow-sm group-hover:bg-blue-600 transition-colors">
                <Send size={18} className="-ml-0.5 mt-0.5" /> {/* Трохи підправив літачок, щоб візуально був по центру */}
              </div>
            </a>

            {/* WHATSAPP (Іконка MessageCircle) */}
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white text-gray-900 px-4 py-3 rounded-full shadow-xl hover:bg-green-50 transition-colors border border-green-100 group"
            >
              <span className="font-medium text-sm group-hover:text-green-600 transition-colors">WhatsApp</span>
              <div className="bg-green-500 text-white p-2 rounded-full shadow-sm group-hover:bg-green-600 transition-colors">
                <MessageCircle size={18} />
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ГОЛОВНА КНОПКА З АНІМАЦІЄЮ */}
      <div className="relative">
        {/* Пульсуюче коло (для привернення уваги), працює тільки коли кнопка закрита */}
        {!isOpen && (
          <span className="absolute top-0 left-0 w-full h-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
        )}
        
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          // Анімація "дихання" кожні 3 секунди, якщо не натиснута
          animate={!isOpen ? { scale: [1, 1.05, 1] } : {}}
          transition={!isOpen ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : {}}
          className={`relative p-4 rounded-full shadow-2xl transition-all duration-300 border-2 border-white ${
            isOpen ? "bg-gray-800 text-white rotate-90" : "bg-green-600 text-white"
          }`}
        >
          {isOpen ? <X size={28} /> : <MessageSquare size={28} fill="currentColor" className="text-white" />}
        </motion.button>
      </div>
    </div>
  )
}