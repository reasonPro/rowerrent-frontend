"use client"

import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion" // 👇 Використовуємо гарний компонент
import { useLanguage } from "@/components/language-provider"
import { supabase } from "@/lib/supabase"

export default function FaqSection() {
  const { t } = useLanguage()
  
  // 👇 Логіка адреси (Залишили)
  const [address, setAddress] = useState("ul. Karmelicka 3CF, Warszawa")

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'shop_address')
        .single()
      
      if (data) setAddress(data.value)
    }
    fetchSettings()
  }, [])

  const faqs = [
    { q: "faq.q1", a: "faq.a1" },
    { q: "faq.q2", a: "faq.a2" },
    { q: "faq.q3", a: "faq.a3" },
    { q: "faq.q4", a: "faq.a4" },
    { q: "faq.q5", a: "faq.a5" },
    { q: "faq.q6", a: "faq.a6" },
    // 👇 Тут магія з підміною адреси
    { q: "faq.q7", a: "faq.a7", dynamic: true }, 
    { q: "faq.q8", a: "faq.a8" },
    { q: "faq.q9", a: "faq.a9" },
    { q: "faq.q10", a: "faq.a10" },
    { q: "faq.q11", a: "faq.a11" },
    { q: "faq.q12", a: "faq.a12" },
    { q: "faq.q13", a: "faq.a13" },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("faq.title")}</h2>
        </div>
        
        {/* 👇 Використовуємо компонент Accordion для красивих анімацій */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => {
            // Якщо це пункт з адресою - робимо заміну, якщо ні - просто переклад
            const answerText = faq.dynamic 
                ? t(faq.a).replace("{address}", address) 
                : t(faq.a)

            return (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-gray-900 font-medium hover:text-green-600">
                  {t(faq.q)}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {answerText}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}