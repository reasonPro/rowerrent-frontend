"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2, Plus, Pencil, X } from "lucide-react"

// Тип для мультимовних полів (словник)
interface MultiLangString {
  pl: string
  ua: string
  en: string
}

// Тип велосипеда з бази
interface Bike {
  id: number
  name: string
  category: string
  image_url: string
  is_available: boolean
  price_day: number
  price_week: number
  price_month: number
  // Ці поля тепер можуть бути або об'єктом (новий формат), або текстом (старий формат)
  motor: MultiLangString | string
  battery: MultiLangString | string
  wheels: MultiLangString | string
  brakes: MultiLangString | string
}

const emptyLangField = { pl: "", ua: "", en: "" }

export default function AdminBikesPage() {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  // Активна мова для вводу
  const [inputLang, setInputLang] = useState<"pl" | "ua" | "en">("ua")

  // Стан форми
  const [name, setName] = useState("")
  const [category, setCategory] = useState("city")
  const [imageUrl, setImageUrl] = useState("")
  const [priceDay, setPriceDay] = useState("")
  const [priceWeek, setPriceWeek] = useState("")
  const [priceMonth, setPriceMonth] = useState("")
  
  // Мультимовні поля
  const [motor, setMotor] = useState<MultiLangString>(emptyLangField)
  const [battery, setBattery] = useState<MultiLangString>(emptyLangField)
  const [wheels, setWheels] = useState<MultiLangString>(emptyLangField)
  const [brakes, setBrakes] = useState<MultiLangString>(emptyLangField)

  useEffect(() => { fetchBikes() }, [])

  async function fetchBikes() {
    setLoading(true)
    const { data, error } = await supabase.from('bikes').select('*').order('id', { ascending: false })
    if (error) console.error(error)
    else setBikes(data || [])
    setLoading(false)
  }

  // Оновлення конкретної мови в об'єкті
  const updateLangField = (
    setter: React.Dispatch<React.SetStateAction<MultiLangString>>, 
    field: MultiLangString, 
    val: string
  ) => {
    setter({ ...field, [inputLang]: val })
  }

  // Допоміжна функція: перетворює дані з бази (які можуть бути старого формату) в об'єкт
  const normalizeLangField = (field: any): MultiLangString => {
    if (typeof field === 'object' && field !== null) return field
    return { pl: String(field || ""), ua: String(field || ""), en: String(field || "") }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const bikeData = {
      name, category, 
      image_url: imageUrl || "/city-bike.jpg",
      price_day: Number(priceDay),
      price_week: Number(priceWeek),
      price_month: Number(priceMonth),
      motor, battery, wheels, brakes,
      is_available: true
    }

    const { error } = editingId 
      ? await supabase.from('bikes').update(bikeData).eq('id', editingId)
      : await supabase.from('bikes').insert([bikeData])

    if (error) alert("Помилка: " + error.message)
    else {
      resetForm()
      fetchBikes()
    }
    setSubmitting(false)
  }

  function resetForm() {
    setEditingId(null)
    setName(""); setCategory("city"); setImageUrl(""); 
    setPriceDay(""); setPriceWeek(""); setPriceMonth("");
    setMotor(emptyLangField); setBattery(emptyLangField); 
    setWheels(emptyLangField); setBrakes(emptyLangField);
  }

  function handleEdit(bike: Bike) {
    setEditingId(bike.id)
    setName(bike.name)
    setCategory(bike.category)
    setImageUrl(bike.image_url)
    setPriceDay(String(bike.price_day))
    setPriceWeek(String(bike.price_week))
    setPriceMonth(String(bike.price_month))
    
    // Нормалізуємо дані (щоб старі текстові записи не ламали форму)
    setMotor(normalizeLangField(bike.motor))
    setBattery(normalizeLangField(bike.battery))
    setWheels(normalizeLangField(bike.wheels))
    setBrakes(normalizeLangField(bike.brakes))
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id: number) {
    if (!confirm("Видалити?")) return
    await supabase.from('bikes').delete().match({ id })
    fetchBikes()
  }

  return (
    <div className="space-y-8 pb-20">
      <h1 className="text-3xl font-bold">{editingId ? "✏️ Редагування" : "➕ Новий велосипед"}</h1>

      <Card className={editingId ? "border-green-500 border-2" : ""}>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Основні дані</CardTitle>
          {editingId && <Button variant="ghost" onClick={resetForm} className="text-red-500"><X size={16} /> Скасувати</Button>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Назва</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Категорія</Label>
                <select className="w-full p-2 border rounded-md" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="city">Міський</option><option value="mountain">Гірський</option>
                </select>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2"><Label>Ціна (День)</Label><Input type="number" value={priceDay} onChange={e => setPriceDay(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Ціна (Тиждень)</Label><Input type="number" value={priceWeek} onChange={e => setPriceWeek(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Ціна (Місяць)</Label><Input type="number" value={priceMonth} onChange={e => setPriceMonth(e.target.value)} required /></div>
            </div>

            <div className="space-y-2"><Label>Фото URL</Label><Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} /></div>

            <hr />

            {/* МУЛЬТИМОВНІ ХАРАКТЕРИСТИКИ */}
            <div>
              <div className="flex gap-2 mb-4">
                <span className="text-sm font-bold pt-2">Мова вводу:</span>
                {(["ua", "pl", "en"] as const).map(lang => (
                  <button type="button" key={lang} onClick={() => setInputLang(lang)}
                    className={`px-3 py-1 rounded text-sm font-bold border ${inputLang === lang ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}>
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2 bg-gray-50 p-4 rounded-xl border">
                <div className="space-y-2"><Label>Двигун ({inputLang})</Label>
                  <Input value={motor[inputLang]} onChange={e => updateLangField(setMotor, motor, e.target.value)} placeholder={inputLang === 'en' ? '250W' : '250Вт'} />
                </div>
                <div className="space-y-2"><Label>Акумулятор ({inputLang})</Label>
                  <Input value={battery[inputLang]} onChange={e => updateLangField(setBattery, battery, e.target.value)} />
                </div>
                <div className="space-y-2"><Label>Колеса ({inputLang})</Label>
                  <Input value={wheels[inputLang]} onChange={e => updateLangField(setWheels, wheels, e.target.value)} />
                </div>
                <div className="space-y-2"><Label>Гальма ({inputLang})</Label>
                  <Input value={brakes[inputLang]} onChange={e => updateLangField(setBrakes, brakes, e.target.value)} />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 text-white" disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin" /> : editingId ? "Зберегти зміни" : "Додати"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 👇 СПИСОК ВЕЛОСИПЕДІВ (ПОВЕРНУВ ЙОГО!) */}
      <Card>
        <CardHeader>
          <CardTitle>Список ({bikes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-green-600" /></div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {bikes.map(bike => (
                <div key={bike.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 bg-white shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={bike.image_url || "/placeholder.svg"} alt={bike.name} className="w-16 h-12 object-cover rounded bg-gray-100" />
                    <div>
                      <p className="font-bold text-gray-900">{bike.name}</p>
                      <div className="flex gap-2 text-xs text-gray-500 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded capitalize">{bike.category}</span>
                        <span className="font-medium text-green-700">{bike.price_day} zł/d</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(bike)}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(bike.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
              {bikes.length === 0 && <p className="text-center text-gray-500 py-4">Список порожній</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}