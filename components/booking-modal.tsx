"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/components/language-provider"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenTerms: () => void
  onOpenPrivacy: () => void
}

export default function BookingModal({ isOpen, onClose, onOpenTerms, onOpenPrivacy }: BookingModalProps) {
  const { language } = useLanguage()
  
  // Словник (Додав сюди переклади для Імені та Прізвища)
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
      termDay: "1 Dzień", termWeek: "Tydzień", termMonth: "Miesiąc",
      firstName: "Imię",
      lastName: "Nazwisko",
      errName: "Minimum 2 znaki",
      errPhone: "Wprowadź poprawny numer telefonu",
      errEmail: "Wprowadź poprawny adres email"
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
      termDay: "1 День", termWeek: "Тиждень", termMonth: "Місяць",
      firstName: "Ім'я",
      lastName: "Прізвище",
      errName: "Мінімум 2 символи",
      errPhone: "Введіть коректний номер телефону",
      errEmail: "Введіть коректний email"
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
      privacyLink: "Privacy Policy",
      termDay: "1 Day", termWeek: "Week", termMonth: "Month",
      firstName: "First Name",
      lastName: "Last Name",
      errName: "Minimum 2 characters",
      errPhone: "Enter a valid phone number",
      errEmail: "Enter a valid email"
    }
  }[language]

  const [isLoading, setIsLoading] = useState(false)
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState<"day" | "week" | "month">("day")
  
  // Стани для полів
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  
  // Стан помилок
  const [errors, setErrors] = useState<{
    firstName?: string, 
    lastName?: string, 
    phone?: string, 
    email?: string
  }>({})

  const prices = { day: 50, week: 180, month: 720 }

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false)
      setErrors({})
      // Очищаємо поля при відкритті
      setFirstName("")
      setLastName("")
      setPhone("")
      setEmail("")
      setIsTermsAccepted(false)
    }
  }, [isOpen])

  // Функція валідації
  const validateForm = () => {
    const newErrors: {firstName?: string, lastName?: string, phone?: string, email?: string} = {}
    let isValid = true

    // Валідація Ім'я
    if (firstName.trim().length < 2) {
      newErrors.firstName = t.errName
      isValid = false
    }

    // Валідація Прізвища
    if (lastName.trim().length < 2) {
      newErrors.lastName = t.errName
      isValid = false
    }

    // Перевірка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      newErrors.email = t.errEmail
      isValid = false
    }

    // Перевірка телефону
    const phoneRegex = /^[\d\+\-\s]{9,}$/
    if (!phoneRegex.test(phone)) {
      newErrors.phone = t.errPhone
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSuccess(true)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{t.successTitle}</h3>
                <p className="text-gray-600 mb-6">{t.successDesc}</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left text-sm border border-gray-100">
                  <p className="text-gray-500 mb-1">ID:</p>
                  <p className="font-mono font-bold text-xl text-gray-900 tracking-wider">#RR-{Math.floor(Math.random() * 9000) + 1000}</p>
                </div>
                <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white">
                  {t.close}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Тариф */}
                <div className="space-y-2">
                  <Label>Тариф</Label>
                  <div className="flex gap-2">
                    {(["day", "week", "month"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedTerm(opt)}
                        className={`flex-1 py-2 text-sm rounded-md border transition-all ${
                          selectedTerm === opt 
                            ? "border-green-600 bg-green-50 text-green-700 font-bold shadow-sm" 
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {opt === "day" ? t.termDay : opt === "week" ? t.termWeek : t.termMonth}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ім'я та Прізвище (НОВЕ) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={errors.firstName ? "text-red-500" : ""}>{t.firstName}</Label>
                    <Input 
                      placeholder={t.firstName}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={errors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}
                      maxLength={50}
                    />
                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className={errors.lastName ? "text-red-500" : ""}>{t.lastName}</Label>
                    <Input 
                      placeholder={t.lastName}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={errors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}
                      maxLength={50}
                    />
                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Телефон */}
                <div className="space-y-2">
                  <Label className={errors.phone ? "text-red-500" : ""}>Телефон</Label>
                  <Input 
                    type="tel" 
                    placeholder="+48..." 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className={errors.email ? "text-red-500" : ""}>Email</Label>
                  <Input 
                    type="email" 
                    placeholder="mail@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
                
                {/* Галочка з двома посиланнями */}
                <div className="flex items-start gap-3 pt-2">
                  <Checkbox 
                    id="book-terms" 
                    checked={isTermsAccepted}
                    onCheckedChange={(checked: any) => setIsTermsAccepted(checked)}
                  />
                  <label htmlFor="book-terms" className="text-sm text-gray-600 leading-tight pt-0.5">
                    {t.termsText} 
                    <button type="button" onClick={onOpenTerms} className="text-green-600 underline hover:text-green-700 ml-1">
                      {t.termsLink}
                    </button>
                    {t.and}
                    <button type="button" onClick={onOpenPrivacy} className="text-green-600 underline hover:text-green-700">
                      {t.privacyLink}
                    </button>
                  </label>
                </div>

                {/* Ціна */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-gray-600 font-medium">{t.priceLabel}:</span>
                  <span className="text-2xl font-bold text-green-600">{prices[selectedTerm]} zł</span>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg shadow-md" disabled={!isTermsAccepted || isLoading}>
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