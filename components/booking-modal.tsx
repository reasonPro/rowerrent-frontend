"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Loader2, Zap, Battery, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { supabase } from "@/lib/supabase"

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
  selectedBike: Bike | null
}

export default function BookingModal({ isOpen, onClose, onOpenTerms, onOpenPrivacy, selectedBike }: BookingModalProps) {
  const { language } = useLanguage()
  
  const t = {
    pl: { 
      title: "Rezerwacja", 
      priceLabel: "Do zapłaty (przy odbiorze)", 
      bookBtn: "Zarezerwuj", 
      successTitle: "Dziękujemy za rezerwację!", 
      successDesc: "Skontaktujemy się z Tobą wkrótce.", 
      close: "Zamknij", 
      termsText: "Akceptuję", 
      termsLink: "Regulamin", 
      and: " i ", 
      privacyLink: "Politykę Prywatności", 
      termDay: "1 Dzień", 
      termWeek: "Tydzień", 
      termMonth: "Miesiąc", 
      firstName: "Imię", 
      lastName: "Nazwisko", 
      errName: "Min. 2 znaki", 
      errPhone: "Poprawny telefon", 
      errEmail: "Poprawny email", 
      errLimit: "Osiągnąłeś limit 5 aktywnych rezerwacji.",
      tariffLabel: "Taryfa" // 👈 ДОДАНО
    },
    ua: { 
      title: "Бронювання", 
      priceLabel: "До оплати (при отриманні)", 
      bookBtn: "Забронювати", 
      successTitle: "Дякуємо за бронювання!", 
      successDesc: "Ми зв'яжемося з вами найближчим часом.", 
      close: "Чудово", 
      termsText: "Приймаю", 
      termsLink: "Положення", 
      and: " і ", 
      privacyLink: "Політику конфіденційності", 
      termDay: "1 День", 
      termWeek: "Тиждень", 
      termMonth: "Місяць", 
      firstName: "Ім'я", 
      lastName: "Прізвище", 
      errName: "Мін. 2 символи", 
      errPhone: "Введіть телефон", 
      errEmail: "Введіть email", 
      errLimit: "Ви досягли ліміту 5 активних бронювань.",
      tariffLabel: "Тариф" // 👈 ДОДАНО
    },
    en: { 
      title: "Booking", 
      priceLabel: "Total (pay on pickup)", 
      bookBtn: "Book Now", 
      successTitle: "Booking Successful!", 
      successDesc: "We will contact you shortly.", 
      close: "Great", 
      termsText: "I accept", 
      termsLink: "Terms", 
      and: " and ", 
      privacyLink: "Privacy", 
      termDay: "1 Day", 
      termWeek: "Week", 
      termMonth: "Month", 
      firstName: "First Name", 
      lastName: "Last Name", 
      errName: "Min 2 chars", 
      errPhone: "Valid phone", 
      errEmail: "Valid email", 
      errLimit: "You reached the limit of 5 active bookings.",
      tariffLabel: "Tariff" // 👈 ДОДАНО
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
  
  const [globalError, setGlobalError] = useState("")

  const prices = { day: 50, week: 180, month: 720 }

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false)
      setErrors({})
      setGlobalError("")
    }
  }, [isOpen])

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
    setGlobalError("")
    if (!validateForm()) return
    if (!selectedBike) return

    setIsLoading(true)

    try {
      const { count, error: countError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('email', email)
        .in('status', ['New', 'Confirmed', 'Active'])

      if (countError) throw countError

      if (count !== null && count >= 5) {
        setGlobalError(t.errLimit)
        setIsLoading(false)
        return
      }

      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            client_name: `${firstName} ${lastName}`,
            phone: phone,
            email: email,
            bike_name: selectedBike.name,
            total_price: Number(currentPrice),
            status: "New",
            start_date: new Date().toISOString()
          }
        ])

      if (error) throw error
      setIsSuccess(true)
    } catch (err: any) {
      setGlobalError("Сталася помилка. Спробуйте пізніше.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !selectedBike) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
            <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
            <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-5 overflow-y-auto">
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{t.successTitle}</h3>
                <p className="text-gray-600 mb-6">{t.successDesc}</p>
                <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white">
                  {t.close}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100 flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0 border border-gray-200 flex items-center justify-center">
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

                <div className="space-y-2">
                  {/* 👇 ВИПРАВЛЕНО: Тепер береться з перекладу */}
                  <Label className="text-sm font-medium text-gray-700">{t.tariffLabel}</Label>
                  <div className="flex gap-2">
                    {(["day", "week", "month"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedTerm(opt)}
                        className={`flex-1 py-2 text-xs sm:text-sm rounded-lg border transition-all ${
                          selectedTerm === opt 
                            ? "border-green-600 bg-green-50 text-green-700 font-bold shadow-sm" 
                            : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {opt === "day" ? t.termDay : opt === "week" ? t.termWeek : t.termMonth}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className={errors.firstName ? "text-red-500" : ""}>{t.firstName}</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={errors.firstName ? "border-red-500" : ""} />
                    {errors.firstName && <p className="text-[10px] text-red-500">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className={errors.lastName ? "text-red-500" : ""}>{t.lastName}</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className={errors.lastName ? "border-red-500" : ""} />
                    {errors.lastName && <p className="text-[10px] text-red-500">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className={errors.phone ? "text-red-500" : ""}>{t.errPhone.includes("telefon") || t.errPhone.includes("телефон") ? "Telefon" : "Phone"}</Label>
                  <Input type="tel" placeholder="+48..." value={phone} onChange={(e) => setPhone(e.target.value)} className={errors.phone ? "border-red-500" : ""} />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className={errors.email ? "text-red-500" : ""}>Email</Label>
                  <Input type="email" placeholder="mail@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={errors.email ? "border-red-500" : ""} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
                
                <div className="flex items-start gap-3 pt-2 bg-gray-50 p-3 rounded-lg">
                  <Checkbox id="book-terms" checked={isTermsAccepted} onCheckedChange={(c:any) => setIsTermsAccepted(c)} className="mt-0.5" />
                  <label htmlFor="book-terms" className="text-xs text-gray-600 leading-snug cursor-pointer select-none">
                    {t.termsText} <button type="button" onClick={onOpenTerms} className="text-green-600 font-medium hover:underline ml-1">{t.termsLink}</button>
                    {t.and} <button type="button" onClick={onOpenPrivacy} className="text-green-600 font-medium hover:underline">{t.privacyLink}</button>
                  </label>
                </div>

                {globalError && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 border border-red-100 animate-pulse">
                    <AlertCircle size={16} />
                    {globalError}
                  </div>
                )}

                <div className="pt-4 mt-2 border-t border-gray-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-sm">{t.priceLabel}:</span>
                    <span className="text-2xl font-bold text-green-600">{currentPrice} zł</span>
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg shadow-md" disabled={!isTermsAccepted || isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : t.bookBtn}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}