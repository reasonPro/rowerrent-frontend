"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Loader2, Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"

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
  
  // Координати
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  
  // Головна сторінка (Hero)
  const [heroStatus, setHeroStatus] = useState(true)
  const [heroBg, setHeroBg] = useState("") // 👇 НОВЕ: Фон
  const [heroBike, setHeroBike] = useState("") // 👇 НОВЕ: Велосипед

  // Соцмережі
  const [instagram, setInstagram] = useState("")
  const [telegram, setTelegram] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  // Документи
  const [terms, setTerms] = useState<MultiLangText>(emptyLangText)
  const [privacy, setPrivacy] = useState<MultiLangText>(emptyLangText)
  const [docLang, setDocLang] = useState<"pl" | "ua" | "en">("ua")

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
      setLat(map.shop_lat || "52.244889")
      setLng(map.shop_lng || "20.993500")
      
      setHeroStatus(map.hero_status === 'true')
      setHeroBg(map.hero_bg_image || "/bicycle-in-nature-scenic-landscape.jpg") // 👇
      setHeroBike(map.hero_bike_image || "/modern-bicycle-rental-bike-isolated.jpg") // 👇
      
      setInstagram(map.social_instagram || "")
      setTelegram(map.social_telegram || "")
      setWhatsapp(map.social_whatsapp || "")

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
      { key: 'shop_lat', value: lat },
      { key: 'shop_lng', value: lng },
      
      { key: 'hero_status', value: String(heroStatus) },
      { key: 'hero_bg_image', value: heroBg }, // 👇
      { key: 'hero_bike_image', value: heroBike }, // 👇
      
      { key: 'social_instagram', value: instagram },
      { key: 'social_telegram', value: telegram },
      { key: 'social_whatsapp', value: whatsapp },
      
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

      {/* 1. ГОЛОВНА СТОРІНКА (Оновлено) */}
      <Card>
        <CardHeader>
          <CardTitle>Головний Банер (Hero)</CardTitle>
          <CardDescription>Змініть зображення та статус на головній сторінці.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
            <Switch checked={heroStatus} onCheckedChange={setHeroStatus} />
            <span className="font-medium">Статус "Доступні велосипеди" (Зелений бейдж)</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Велике фонове фото (URL)</Label>
              <Input value={heroBg} onChange={e => setHeroBg(e.target.value)} placeholder="/image.jpg або https://..." />
            </div>
            <div className="space-y-2">
              <Label>Фото велосипеда (URL)</Label>
              <Input value={heroBike} onChange={e => setHeroBike(e.target.value)} placeholder="/bike.jpg або https://..." />
            </div>
          </div>
          
          {/* Прев'ю для зручності */}
          <div className="grid gap-4 md:grid-cols-2">
             <div className="h-24 rounded-lg bg-gray-100 overflow-hidden border">
                <img src={heroBg || "/placeholder.svg"} alt="Background Preview" className="w-full h-full object-cover opacity-80" />
             </div>
             <div className="h-24 rounded-lg bg-gray-100 overflow-hidden border flex items-center justify-center">
                <img src={heroBike || "/placeholder.svg"} alt="Bike Preview" className="h-full object-contain" />
             </div>
          </div>

        </CardContent>
      </Card>

      {/* 2. КОНТАКТИ І ЛОКАЦІЯ */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Контакти та Локація</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Адреса</Label><Input value={address} onChange={e => setAddress(e.target.value)} /></div>
            <div className="space-y-2"><Label>Телефон</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="space-y-2"><Label>Графік</Label><Input value={hours} onChange={e => setHours(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Широта (Lat)</Label><Input value={lat} onChange={e => setLat(e.target.value)} /></div>
              <div className="space-y-2"><Label>Довгота (Lng)</Label><Input value={lng} onChange={e => setLng(e.target.value)} /></div>
            </div>
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

      {/* 3. ДОКУМЕНТИ */}
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
              <Label>Правила ({docLang.toUpperCase()})</Label>
              <textarea className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={terms[docLang]} onChange={e => updateDoc(setTerms, terms, e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Політика ({docLang.toUpperCase()})</Label>
              <textarea className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={privacy[docLang]} onChange={e => updateDoc(setPrivacy, privacy, e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}