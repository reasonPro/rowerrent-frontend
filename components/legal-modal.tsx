"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

interface LegalModalProps {
  isOpen: boolean
  onClose: () => void
  type: "terms" | "privacy"
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  const { t } = useLanguage()

  if (!isOpen) return null

  const isTerms = type === "terms"
  const title = isTerms ? t("legal.termsTitle") : t("legal.privacyTitle")
  const content = isTerms ? t("legal.termsContent") : t("legal.privacyContent")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-lg bg-white shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 text-foreground leading-relaxed whitespace-pre-wrap">{content}</div>

        {/* Footer */}
        <div className="border-t border-border p-6 bg-secondary">
          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90">
            {t("legal.close")}
          </Button>
        </div>
      </div>
    </div>
  )
}
