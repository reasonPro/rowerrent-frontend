"use client"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/components/language-provider"

interface LegalModalProps {
  isOpen: boolean
  onClose: () => void
  type: "terms" | "privacy"
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  const { language, t } = useLanguage()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchLegalText()
    }
  }, [isOpen, type, language])

  async function fetchLegalText() {
    setLoading(true)
    const dbKey = type === "terms" ? "legal_terms" : "legal_privacy"
    
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', dbKey)
        .single()

      if (error) throw error

      if (data && data.value) {
        try {
          const json = JSON.parse(data.value)
          const text = json[language] || json.pl || json.en || "Brak treści / Немає тексту."
          setContent(text)
        } catch (e) {
          setContent(data.value)
        }
      } else {
        setContent("Текст ще не додано адміністратором.")
      }
    } catch (err) {
      console.error(err)
      setContent("Помилка завантаження.")
    } finally {
      setLoading(false)
    }
  }

  const title = type === "terms" ? t("legal.termsTitle") : t("legal.privacyTitle")

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          // max-w-2xl: обмежуємо ширину
          // max-h-[85vh]: щоб влазило на екран телефону
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Шапка */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
            <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X size={24} />
            </button>
          </div>

          {/* Контент */}
          <div className="p-6 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-green-600 h-8 w-8" />
              </div>
            ) : (
              // 👇 ОСЬ ТУТ ГОЛОВНЕ ВИПРАВЛЕННЯ:
              // whitespace-pre-wrap: зберігає абзаци
              // break-words: примусово переносить довгі слова, щоб не було горизонтального скролу
              <div className="whitespace-pre-wrap break-words text-sm text-gray-600 leading-relaxed font-sans">
                {content}
              </div>
            )}
          </div>

          {/* Футер */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end">
            <Button onClick={onClose} variant="outline">
              {t("legal.close") || "Закрити"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}