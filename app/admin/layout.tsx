"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Settings, LogOut, Bike, MessageSquare, Menu, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

// 👇 ВПИШИ ТУТ СВОЮ ПОШТУ АДМІНА (Тільки цей юзер зможе бачити меню)
const ADMIN_EMAIL = "stpetro9@gmail.com" 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  // Стан завантаження і перевірки
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 👇 ГОЛОВНИЙ ОХОРОНЕЦЬ
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      const isLoginPage = pathname === "/admin"

      // 1. Якщо юзера немає взагалі
      if (!user) {
        if (!isLoginPage) {
          router.replace("/admin") // Кидаємо на вхід
        } else {
          setIsLoading(false) // Ми на вході, можна показувати форму
        }
        return
      }

      // 2. Якщо юзер є, але це НЕ ПЕТРО (чужа пошта)
      if (user.email !== ADMIN_EMAIL) {
        alert("У вас немає доступу до цієї панелі.")
        await supabase.auth.signOut() // Викидаємо його
        router.replace("/") // Відправляємо на головну сайту
        return
      }

      // 3. Якщо це Петро
      setIsAuthorized(true)
      
      // Якщо Петро стоїть на сторінці входу - кидаємо в Дашборд
      if (isLoginPage) {
        router.replace("/admin/dashboard")
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  // Поки перевіряємо - показуємо крутилку на весь екран
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
      </div>
    )
  }

  // Якщо це сторінка логіну - показуємо її без меню (але тільки якщо перевірка пройшла)
  if (pathname === "/admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {children}
      </div>
    )
  }

  // Якщо ми тут - значить це АДМІН і це ВНУТРІШНЯ СТОРІНКА. Малюємо меню.
  if (!isAuthorized) return null // Про всяк випадок

  const links = [
    { href: "/admin/dashboard", label: "Бронювання", icon: LayoutDashboard },
    { href: "/admin/bikes", label: "Велосипеди", icon: Bike },
    { href: "/admin/reviews", label: "Відгуки", icon: MessageSquare },
    { href: "/admin/settings", label: "Налаштування", icon: Settings },
  ]

  const NavContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-xl text-green-600">
          <Bike /> Admin Panel
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-green-50 text-green-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={20} />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Вийти на сайт
        </Link>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-20">
        <NavContent />
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center justify-between px-4">
        <span className="font-bold text-lg text-gray-900">RowerRent Admin</span>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* MOBILE MENU */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-20 bg-gray-800/50 md:hidden" onClick={() => setIsMobileOpen(false)}>
          <div className="absolute top-16 left-0 bottom-0 w-64 bg-white shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
            <NavContent />
          </div>
        </div>
      )}

      {/* CONTENT */}
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 md:ml-64 w-full">
        {children}
      </main>
    </div>
  )
}