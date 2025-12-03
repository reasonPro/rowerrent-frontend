"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  userName: string
  login: (email: string, pass: string) => Promise<any>
  register: (email: string, pass: string, meta: any) => Promise<any>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Перевіряємо, чи юзер вже увійшов (при завантаженні сторінки)
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }
    checkUser()

    // 2. Слухаємо зміни (увійшов/вийшов)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Функція Входу
  const login = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    })
    if (error) throw error
    return data
  }

  // Функція Реєстрації
  const register = async (email: string, pass: string, meta: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: meta // Тут ми зберігаємо Ім'я, Прізвище, Телефон
      }
    })
    if (error) throw error
    return data
  }

  // Функція Виходу
  const logout = async () => {
    await supabase.auth.signOut()
  }

  // Дістаємо ім'я користувача з метаданих або пошти
  const userName = user?.user_metadata?.firstName || user?.email?.split('@')[0] || "User"

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, userName, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}