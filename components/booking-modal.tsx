"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Loader2, Zap, Battery } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { supabase } from "@/lib/supabase"

// Тип велосипеда (такий самий, як у каталозі)
interface Bike {
  id: number
  name: string
  category: string
  image: string
  dayPrice: number
  weekPrice: number
  monthPrice: number
  specs: {
    motor: string
    battery: string
  }
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenTerms: () => void
  onOpenPrivacy: () => void
  selectedBike: Bike | null // 👇 НОВЕ: Приймаємо велосипед
}

export default function BookingModal({ isOpen, onClose, onOpenTerms, onOpenPrivacy, selectedBike }: BookingModalProps) {
  const { language } = useLanguage()
  
  const t = {
    pl: {
      title: "Rezerwacja", priceLabel: "Do zapłaty (przy odbiorze)", bookBtn: "Zarezerwuj",
      successTitle: "Dziękujemy za rezerwację!", successDesc: "Skontaktujemy się z Tobą wkrótce.", close: "Zamknij",
      termsText: "Akceptuję", termsLink: "Regulamin", and: " i ", privacyLink: "Politykę Prywatności",
      termDay: "1 Dzień", termWeek: "Tydzień", termMonth: "Miesiąc",
      firstName: "Imię", lastName: "Nazwisko", errName: "Minimum 2 znaki", errPhone: "Wprowadź poprawny numer", errEmail: "Poprawny email"
    },
    ua: {
      title: "Бронювання", priceLabel: "До оплати (при отриманні)", bookBtn: "Забронювати",
      successTitle: "Дякуємо за бронювання!", successDesc: "Ми зв'яжемося з вами найближчим часом.", close: "Чудово",
      termsText: "Приймаю", termsLink: "Положення", and: " і ", privacyLink: "Політику конфіденційності",
      termDay: "1 День", termWeek: "Тиждень", termMonth: "Місяць",
      firstName: "Ім'я", lastName: "Прізвище", errName: "Мінімум 2 символи", errPhone: "Введіть номер", errEmail: "Введіть email"
    },
    en: {
      title: "Booking", priceLabel: "Total (pay on pickup)", bookBtn: "Book Now",
      successTitle: "Booking Successful!", successDesc: "We will contact you shortly.", close: "Great",
      termsText: "I accept", termsLink: "Terms", and: " and ", privacyLink: "Privacy",
      termDay: "1 Day", termWeek: "Week", termMonth: "Month",
      firstName: "First Name", lastName: "Last Name", errName: "Min 2 chars", errPhone: "Valid phone", errEmail: "Valid email"
    }
  }[language]

  const [isLoading, setIsLoading] = useState(false)
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState<"day" | "week" | "month">("day")
  
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<{firstName?: string, lastName?: string, phone?: string, email?: string}>({})

  // Очищення при відкритті
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false)
      setErrors({})
      setFirstName("")
      setLastName("")
      setPhone("")
      setEmail("")
      setIsTermsAccepted(false)
      setSelectedTerm("day") // Скидаємо тариф на дефолтний
    }
  }, [isOpen])

  // Розрахунок ціни на основі вибраного велосипеда
  const currentPrice = selectedBike 
    ? (selectedTerm === "day" ? selectedBike.dayPrice : selectedTerm === "week" ? selectedBike.weekPrice : selectedBike.monthPrice)
    : 0

  const validateForm = () => {
    const newErrors: any = {}
    let isValid = true
    if (firstName.trim().length < 2) { newErrors.firstName = t.errName; isValid = false }
    if (lastName.trim().length < 2) { newErrors.lastName = t.errName; isValid = false }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { newErrors.email = t.errEmail; isValid = false }
    if (phone.length < 9) { newErrors.phone = t.errPhone; isValid = false }
    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // 👇 ВІДПРАВКА В БАЗУ ДАНИХ
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            client_name: `${firstName} ${lastName}`,
            phone: phone,
            email: email,
            bike_name: selectedBike?.name || "Unknown Bike", // Реальна назва
            total_price: currentPrice, // Реальна ціна
            status: "New",
            start_date: new Date().toISOString()
          }
        ])

      if (error) throw error
      setIsSuccess(true)
    } catch (err: any) {
      alert("Помилка: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !selectedBike) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
          
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
            <button onClick={onClose}><X size={24} className="text-gray-400" /></button>
          </div>

          <div className="p-6">
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{t.successTitle}</h3>
                <p className="text-gray-600 mb-6">{t.successDesc}</p>
                <Button onClick={onClose} className="w-full bg-green-600 text-white">{t.close}</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Картка велосипеда (Динамічна) */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100 flex items-center gap-4">
                  {/* Міні-фото */}
                  <div className="w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                     <img src={selectedBike.image} alt={selectedBike.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{selectedBike.name}</h4>
                    <div className="flex gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1"><Zap size={12}/> {selectedBike.specs.motor}</span>
                      <span className="flex items-center gap-1"><Battery size={12}/> {selectedBike.specs.battery}</span>
                    </div>
                  </div>
                </div>

                {/* Вибір тарифу */}
                <div className="space-y-2">
                  <Label>Тариф</Label>
                  <div className="flex gap-2">
                    {(["day", "week", "month"] as const).map((opt) => (
                      <button key={opt} type="button" onClick={() => setSelectedTerm(opt)} className={`flex-1 py-2 text-sm rounded-md border transition-all ${selectedTerm === opt ? "border-green-600 bg-green-50 text-green-700 font-bold" : "border-gray-200"}`}>
                        {opt === "day" ? t.termDay : opt === "week" ? t.termWeek : t.termMonth}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>{t.firstName}</Label><Input value={firstName} onChange={e=>setFirstName(e.target.value)} className={errors.firstName ? "border-red-500":""}/></div>
                  <div className="space-y-2"><Label>{t.lastName}</Label><Input value={lastName} onChange={e=>setLastName(e.target.value)} className={errors.lastName ? "border-red-500":""}/></div>
                </div>

                <div className="space-y-2"><Label>Телефон</Label><Input value={phone} onChange={e=>setPhone(e.target.value)} className={errors.phone ? "border-red-500":""}/></div>
                <div className="space-y-2"><Label>Email</Label><Input value={email} onChange={e=>setEmail(e.target.value)} className={errors.email ? "border-red-500":""}/></div>
                
                <div className="flex items-start gap-3 pt-2">
                  <Checkbox checked={isTermsAccepted} onCheckedChange={(c:any)=>setIsTermsAccepted(c)}/>
                  <label className="text-sm text-gray-600 leading-tight pt-0.5">
                    {t.termsText} <button type="button" onClick={onOpenTerms} className="text-green-600 underline">{t.termsLink}</button>
                    {t.and} <button type="button" onClick={onOpenPrivacy} className="text-green-600 underline">{t.privacyLink}</button>
                  </label>
                </div>

                {/* Ціна */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-gray-600 font-medium">{t.priceLabel}:</span>
                  <span className="text-2xl font-bold text-green-600">{currentPrice} zł</span>
                </div>

                <Button type="submit" className="w-full bg-green-600 text-white h-12 text-lg" disabled={!isTermsAccepted || isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : t.bookBtn}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}