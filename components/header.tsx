"use client"

import { useState } from "react"
import { Menu, X, Clock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { motion, AnimatePresence } from "framer-motion"

interface HeaderProps {
  onRegisterClick: () => void
  onLoginClick?: () => void
}

export default function Header({ onRegisterClick, onLoginClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHoursOpen, setIsHoursOpen] = useState(false)
  
  const { language, setLanguage, t } = useLanguage()
  const { isLoggedIn, userName, logout } = useAuth()

  const languages: Array<"pl" | "ua" | "en"> = ["pl", "ua", "en"]
  const languageLabels: Record<string, string> = { pl: "PL", ua: "UA", en: "EN" }

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const navLinks = [
    { id: "home", label: t("header.main") || "Головна" },
    { id: "pickup", label: t("header.pickup") || "Локація" },
    { id: "bikes", label: t("header.bikes") || "Велосипеди" },
    { id: "contact", label: t("header.contact") || "Контакти" },
  ]

  const getMobileLangLabel = () => {
    if (language === 'en') return "Language:";
    if (language === 'pl') return "Język:";
    return "Мова:";
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Логотип */}
        <a 
          href="#home" 
          onClick={(e) => handleScrollTo(e, "home")}
          className="flex items-center gap-2"
        >
          <img 
            src="/logo.png" 
            alt="Logo" 
            // Підібрав розмір, щоб не був завеликим і не заважав
            className="h-[40px] w-[40px] object-contain" 
          />
          <span className="text-xl font-bold text-gray-900">ReworRent</span>
        </a>

        {/* Меню десктоп - ТУТ ЗМІНА: xl:flex (з'являється тільки на дуже широких екранах) */}
        <div className="hidden gap-6 xl:flex">
          {navLinks.map((link) => (
            <a 
              key={link.id} 
              href={`#${link.id}`}
              onClick={(e) => handleScrollTo(e, link.id)}
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Права частина - ТУТ ЗМІНА: xl:flex */}
        <div className="hidden xl:flex items-center gap-4">
           {/* Години роботи */}
           <div className="relative">
            <button onClick={() => setIsHoursOpen(!isHoursOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <Clock size={16} className="text-green-600" />
              <span className="text-xs font-medium text-gray-900">{t("header.openingHours") || "Час роботи"}</span>
            </button>
            <AnimatePresence>
              {isHoursOpen && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 whitespace-nowrap">
                  <p className="text-sm font-medium text-gray-900">Pn-Pt: 09:00 - 18:00</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

           {/* Мови */}
           <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {languages.map((lang) => (
              <button 
                key={lang} 
                onClick={() => setLanguage(lang)} 
                className={`text-xs font-bold w-8 h-7 flex items-center justify-center rounded transition-colors ${
                  language === lang 
                    ? "bg-green-600 text-white shadow-sm" 
                    : "text-gray-600 hover:bg-white hover:shadow-sm"
                }`}
              >
                {languageLabels[lang]}
              </button>
            ))}
          </div>

          {!isLoggedIn ? (
            <>
              <Button variant="ghost" size="sm" onClick={onLoginClick}>
                {t("header.login") || "Вхід"}
              </Button>
              <Button size="sm" onClick={onRegisterClick} className="bg-green-600 hover:bg-green-700 text-white">
                {t("header.signup") || "Реєстрація"}
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
               <span className="text-sm font-bold text-gray-900">Hi, {userName}</span>
               <Button variant="ghost" size="icon" onClick={logout}><LogOut size={16}/></Button>
            </div>
          )}
        </div>

        {/* Мобільна кнопка - ТУТ ЗМІНА: xl:hidden (зникає тільки на дуже широких екранах) */}
        <button className="xl:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Мобільне меню - ТУТ ЗМІНА: xl:hidden */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden overflow-hidden border-t border-gray-100 bg-white shadow-lg max-h-[80vh] overflow-y-auto"
          >
            <div className="p-4 space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.id} 
                  href={`#${link.id}`} 
                  onClick={(e) => handleScrollTo(e, link.id)}
                  className="block text-base font-medium text-gray-900 hover:text-green-600 py-2 border-b border-gray-50"
                >
                  {link.label}
                </a>
              ))}
              
              {/* Години роботи в мобільному меню */}
              <div className="py-2 border-b border-gray-50">
                 <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">
                   {t("header.openingHours") || "Час роботи"}
                 </p>
                 <div className="flex items-center gap-2 text-gray-900">
                   <Clock size={16} className="text-green-600" />
                   <span className="text-sm font-bold">Pn-Pt: 09:00 - 18:00</span>
                 </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-medium text-gray-500">{getMobileLangLabel()}</span>
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <button 
                      key={lang} 
                      onClick={() => setLanguage(lang)} 
                      className={`text-xs font-bold w-8 h-8 flex items-center justify-center rounded ${
                        language === lang ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {languageLabels[lang]}
                    </button>
                  ))}
                </div>
              </div>

              {!isLoggedIn ? (
                <div className="flex flex-col gap-3 pt-2">
                  <Button variant="outline" className="w-full" onClick={() => { onLoginClick?.(); setIsMenuOpen(false); }}>
                    {t("header.login") || "Вхід"}
                  </Button>
                  <Button className="w-full bg-green-600 text-white" onClick={() => { onRegisterClick(); setIsMenuOpen(false); }}>
                    {t("header.signup") || "Реєстрація"}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full">Вийти</Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}