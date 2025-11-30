"use client"

import type React from "react"

import { useState } from "react"
import { X, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenTerms?: () => void
  onOpenPrivacy?: () => void
}

export default function RegistrationModal({ isOpen, onClose, onOpenTerms, onOpenPrivacy }: RegistrationModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!termsAccepted) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1500)
  }

  const handleClose = () => {
    setFormData({ firstName: "", lastName: "", phone: "", email: "", password: "" })
    setIsSuccess(false)
    setIsSubmitting(false)
    setTermsAccepted(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-xl font-bold text-foreground">{t("registration.title")}</h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={24} />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <CheckCircle size={48} className="text-primary" />
            <h3 className="text-xl font-bold text-foreground">{t("registration.successTitle")}</h3>
            <p className="text-foreground leading-relaxed">{t("registration.successMessage")}</p>
            <Button onClick={handleClose} className="mt-4 bg-primary hover:bg-primary/90 w-full">
              {t("registration.close")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">
                  {t("registration.firstName")}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">
                  {t("registration.lastName")}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                {t("registration.phone")}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                {t("registration.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                {t("registration.password")}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">{t("registration.passwordHint")}</p>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border border-border focus:ring-2 focus:ring-primary cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                {t("registration.termsLabel")}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    onOpenTerms?.()
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {t("registration.termsLink")}
                </button>
                {t("registration.termsAnd")}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    onOpenPrivacy?.()
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {t("registration.privacyLink")}
                </button>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                {t("registration.close")}
              </Button>
              <Button
                type="submit"
                disabled={!termsAccepted || isSubmitting}
                className={`flex-1 ${
                  termsAccepted && !isSubmitting ? "bg-primary hover:bg-primary/90" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    {t("registration.processing")}
                  </div>
                ) : (
                  t("registration.submit")
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
