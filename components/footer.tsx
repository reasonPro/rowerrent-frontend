"use client"

import { Mail, Phone, MapPin, Facebook, Instagram, Send } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface FooterProps {
  onTermsClick?: () => void
  onPrivacyClick?: () => void
}

export default function Footer({ onTermsClick, onPrivacyClick }: FooterProps) {
  const { t } = useLanguage()

  return (
    <footer id="contact" className="w-full bg-foreground text-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                R
              </div>
              <span className="text-lg font-bold text-white">RowerRent</span>
            </div>
            <p className="text-sm text-white/80">
              Nowoczesna wypożyczalnia rowerów w centrum miasta. Rezerwuj online, brak kaucji, darmowe kaski.
            </p>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-semibold mb-3 text-white">{t("footer.address")}</h3>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <p>{t("footer.address")}</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3 text-white">{t("contact.call")}</h3>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+48123456789"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Phone size={16} />
                {t("footer.phone")}
              </a>
              <a
                href="mailto:info@rowerrent.pl"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Mail size={16} />
                {t("footer.email")}
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-3 text-white">Social Media</h3>
            <div className="flex gap-4">
              <a href="#facebook" className="text-white/80 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#instagram" className="text-white/80 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a
                href="https://t.me/rowerrent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Send size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-white/20 pt-8 pb-8">
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            <button onClick={onTermsClick} className="text-sm text-white/80 hover:text-white transition-colors">
              {t("footer.terms")}
            </button>
            <button onClick={onPrivacyClick} className="text-sm text-white/80 hover:text-white transition-colors">
              {t("footer.privacy")}
            </button>
          </div>
          <p className="text-sm text-white/60 text-center">© 2025 RowerRent. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  )
}
