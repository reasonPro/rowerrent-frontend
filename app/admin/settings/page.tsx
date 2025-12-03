"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Loader2, Save } from "lucide-react"

interface MultiLangText {
  pl: string
  ua: string
  en: string
}

const emptyLangText: MultiLangText = { pl: "", ua: "", en: "" }

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Налаштування контактів
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [hours, setHours] = useState("")
  
  // 👇 НОВЕ: Координати
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  
  // Соцмережі
  const [instagram, setInstagram] = useState("")
  const [telegram, setTelegram] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  // Документи
  const [terms, setTerms] = useState<MultiLangText>(emptyLangText)
  const [privacy, setPrivacy] = useState<MultiLangText>(emptyLangText)
  const [docLang, setDocLang] = useState<"pl" | "ua" | "en">("ua")
  const [heroStatus, setHeroStatus] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    setLoading(true)
    const { data } = await supabase.from('settings').select('*')
    
    if (data) {
      const map: any = {}
      data.forEach((item: any) => map[item.key] = item.value)
      
      setAddress(map.shop_address || "")
      setPhone(map.contact_phone || "")
      setHours(map.opening_hours || "")
      
      // 👇 Завантажуємо координати
      setLat(map.shop_lat || "52.244889")
      setLng(map.shop_lng || "20.993500")
      
      setInstagram(map.social_instagram || "")
      setTelegram(map.social_telegram || "")
      setWhatsapp(map.social_whatsapp || "")
      setHeroStatus(map.hero_status === 'true')

      try {
        if (map.legal_terms) setTerms(JSON.parse(map.legal_terms))
        if (map.legal_privacy) setPrivacy(JSON.parse(map.legal_privacy))
      } catch (e) {
        console.error("Error parsing JSON", e)
      }
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    
    const updates = [
      { key: 'shop_address', value: address },
      { key: 'contact_phone', value: phone },
      { key: 'opening_hours', value: hours },
      // 👇 Зберігаємо координати
      { key: 'shop_lat', value: lat },
      { key: 'shop_lng', value: lng },
      
      { key: 'social_instagram', value: instagram },
      { key: 'social_telegram', value: telegram },
      { key: 'social_whatsapp', value: whatsapp },
      { key: 'hero_status', value: String(heroStatus) },
      { key: 'legal_terms', value: JSON.stringify(terms) },
      { key: 'legal_privacy', value: JSON.stringify(privacy) }
    ]

    const { error } = await supabase.from('settings').upsert(updates)

    if (error) alert("Помилка: " + error.message)
    else alert("Збережено!")
    
    setSaving(false)
  }

  const updateDoc = (setter: any, current: MultiLangText, val: string) => {
    setter({ ...current, [docLang]: val })
  }

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Налаштування</h1>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white gap-2">
          {saving ? <Loader2 className="animate-spin" /> : <><Save size={16} /> Зберегти все</>}
        </Button>
      </div>

      {/* ГОЛОВНА */}
      <Card>
        <CardHeader><CardTitle>Головна сторінка</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-4 border rounded-lg bg-gray-50">
            <input type="checkbox" checked={heroStatus} onChange={(e) => setHeroStatus(e.target.checked)} className="w-5 h-5 accent-green-600 cursor-pointer" />
            <span className="font-medium">Статус "Доступні велосипеди" на банері</span>
          </div>
        </CardContent>
      </Card>

      {/* КОНТАКТИ І КООРДИНАТИ */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Контакти та Локація</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Адреса</Label><Input value={address} onChange={e => setAddress(e.target.value)} /></div>
            <div className="space-y-2"><Label>Телефон</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="space-y-2"><Label>Графік</Label><Input value={hours} onChange={e => setHours(e.target.value)} /></div>
            
            {/* 👇 Поля для координат */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Широта (Lat)</Label>
                <Input value={lat} onChange={e => setLat(e.target.value)} placeholder="52.24..." />
              </div>
              <div className="space-y-2">
                <Label>Довгота (Lng)</Label>
                <Input value={lng} onChange={e => setLng(e.target.value)} placeholder="20.99..." />
              </div>
            </div>
            <p className="text-xs text-gray-500">Скопіюйте з Google Maps (правий клік на точку).</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Соцмережі</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Instagram</Label><Input value={instagram} onChange={e => setInstagram(e.target.value)} /></div>
            <div className="space-y-2"><Label>Telegram</Label><Input value={telegram} onChange={e => setTelegram(e.target.value)} /></div>
            <div className="space-y-2"><Label>WhatsApp</Label><Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} /></div>
          </CardContent>
        </Card>
      </div>

      {/* ЮРИДИЧНІ ДОКУМЕНТИ */}
      <Card>
        <CardHeader><CardTitle>Документи</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
            {(["ua", "pl", "en"] as const).map(lang => (
              <button key={lang} onClick={() => setDocLang(lang)} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${docLang === lang ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-green-700">Правила ({docLang.toUpperCase()})</Label>
              <textarea className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm" value={terms[docLang]} onChange={e => updateDoc(setTerms, terms, e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-green-700">Політика ({docLang.toUpperCase()})</Label>
              <textarea className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm" value={privacy[docLang]} onChange={e => updateDoc(setPrivacy, privacy, e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}