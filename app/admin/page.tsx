
"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // ⚠️ МИ ПРИБРАЛИ useEffect, який перевіряв сесію автоматично.
  // Це зупинить безкінечне перезавантаження сторінки.

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.session) {
        // 👇 Успіх!
        // Робимо жорсткий перехід, щоб оновити всі права доступу
        window.location.href = "/admin/dashboard"
      }
    } catch (err: any) {
      console.error(err)
      setError("Невірний логін або пароль")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-4">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <Lock size={32} />
            </div>
          </div>
          <CardTitle className="text-2xl">Вхід в Адмінку</CardTitle>
          <CardDescription>Введіть дані адміністратора</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@rowerrent.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Увійти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}