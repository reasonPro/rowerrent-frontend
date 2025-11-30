"use client"

import { useState } from "react"
import { MessageCircle, Phone, X, MessageSquare } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export default function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >
            {/* Кнопка Телеграм */}
            <a
              href="https://t.me/" // Додай сюди свій лінк
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white text-gray-900 px-4 py-3 rounded-full shadow-xl hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <span className="font-medium text-sm">Telegram</span>
              <div className="bg-blue-500 text-white p-1.5 rounded-full">
                <MessageSquare size={16} />
              </div>
            </a>

            {/* Кнопка Телефону */}
            <a
              href="tel:+48000000000"
              className="flex items-center gap-3 bg-white text-gray-900 px-4 py-3 rounded-full shadow-xl hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <span className="font-medium text-sm">Дзвінок</span>
              <div className="bg-green-600 text-white p-1.5 rounded-full">
                <Phone size={16} />
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Головна кнопка */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`p-4 rounded-full shadow-xl transition-colors ${
          isOpen ? "bg-gray-800 text-white" : "bg-green-600 text-white"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  )
}