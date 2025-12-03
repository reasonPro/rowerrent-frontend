"use client"

import { useState } from "react"
import { X, Loader2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider" // 👇 Підключаємо

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { t } = useLanguage()
  const { login } = useAuth() // 👇 Функція входу
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      // 👇 СПРАВЖНІЙ ВХІД
      await login(email, password)
      onClose()
    } catch (error) {
      console.error(error)
      setErrorMessage("Невірний email або пароль.")
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
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <LogIn className="w-5 h-5 text-green-600" />
              {t("login.title")}
            </h2>
            <button onClick={onClose}><X size={24} className="text-gray-400" /></button>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("login.email")}</Label>
                <Input type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>{t("login.password")}</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              
              {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

              <Button type="submit" className="w-full bg-green-600 text-white" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : t("login.submit")}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}