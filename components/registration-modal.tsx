"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider" // 👇 Підключаємо наш хук

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenTerms: () => void
  onOpenPrivacy: () => void
}

export default function RegistrationModal({ isOpen, onClose, onOpenTerms, onOpenPrivacy }: RegistrationModalProps) {
  const { t } = useLanguage()
  const { register } = useAuth() // 👇 Беремо функцію реєстрації
  
  const [isLoading, setIsLoading] = useState(false)
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isTermsAccepted) return
    setErrorMessage("")
    setIsLoading(true)

    try {
      // 👇 ВІДПРАВЛЯЄМО ДАНІ В SUPABASE
      await register(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      })
      setIsSuccess(true)
    } catch (error: any) {
      console.error(error)
      setErrorMessage("Помилка реєстрації. Можливо, такий email вже існує.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
          
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">{t("registration.title")}</h2>
            <button onClick={onClose}><X size={24} className="text-gray-400" /></button>
          </div>

          <div className="p-6">
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="text-lg font-bold mb-2">{t("registration.successTitle")}</h3>
                <p className="text-gray-600 mb-6">{t("registration.successMessage")}</p>
                <Button onClick={onClose} className="w-full bg-green-600 text-white">{t("registration.close")}</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="firstName">{t("registration.firstName")}</Label><Input id="firstName" value={formData.firstName} onChange={handleChange} required /></div>
                  <div className="space-y-2"><Label htmlFor="lastName">{t("registration.lastName")}</Label><Input id="lastName" value={formData.lastName} onChange={handleChange} required /></div>
                </div>

                <div className="space-y-2"><Label htmlFor="phone">{t("registration.phone")}</Label><Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required /></div>
                <div className="space-y-2"><Label htmlFor="email">{t("registration.email")}</Label><Input id="email" type="email" value={formData.email} onChange={handleChange} required /></div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("registration.password")}</Label>
                  <Input id="password" type="password" value={formData.password} onChange={handleChange} required minLength={6} />
                  <p className="text-xs text-gray-500">{t("registration.passwordHint")}</p>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Checkbox checked={isTermsAccepted} onCheckedChange={(c:any) => setIsTermsAccepted(c)} />
                  <label className="text-sm text-gray-600 leading-tight">
                    {t("registration.termsLabel")} <span onClick={onOpenTerms} className="text-green-600 underline cursor-pointer">{t("registration.termsLink")}</span>
                    {t("registration.termsAnd")} <span onClick={onOpenPrivacy} className="text-green-600 underline cursor-pointer">{t("registration.privacyLink")}</span>
                  </label>
                </div>

                {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

                <Button type="submit" className="w-full bg-green-600 text-white" disabled={!isTermsAccepted || isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : t("registration.submit")}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}