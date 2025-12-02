"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Налаштування</h1>

      <Card>
        <CardHeader>
          <CardTitle>Інформація про прокат</CardTitle>
          <CardDescription>Змініть контактні дані, які відображаються на сайті.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Адреса точки видачі</Label>
            <Input id="address" defaultValue="ul. Karmelicka 3CF, Warszawa" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Контактний телефон</Label>
            <Input id="phone" defaultValue="+48 123 456 789" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Графік роботи</Label>
            <Input id="hours" defaultValue="Pn-Pt 09:00 - 18:00" />
          </div>

          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Зберегти зміни
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}