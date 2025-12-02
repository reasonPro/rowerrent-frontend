"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Settings, LogOut, Bike } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // 👇 ПЕРЕВІРКА: Чи ми на сторінці логіну?
  const isLoginPage = pathname === "/admin"

  // Якщо це сторінка логіну - повертаємо просто контент без меню
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {children}
      </div>
    )
  }

  // Якщо це ВНУТРІШНЯ сторінка - показуємо меню
  const links = [
    { href: "/admin/dashboard", label: "Бронювання", icon: LayoutDashboard },
    { href: "/admin/bikes", label: "Велосипеди", icon: Bike },
    { href: "/admin/settings", label: "Налаштування", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full">
        
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
      </aside>

      {/* --- MAIN CONTENT --- */}
      {/* Додав ml-64, щоб контент не ховався під фіксованим меню */}
      <main className="flex-1 p-8 md:ml-64 w-full">
        {children}
      </main>
      
    </div>
  )
}