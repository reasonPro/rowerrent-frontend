"use client"

import { useRef, useEffect, useState } from "react"
import { DollarSign, Wrench, Package, Smile, Zap, Shield } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function AdvantagesSection() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    return () => observer.disconnect()
  }, [])

  const advantages = [
    {
      icon: DollarSign,
      titleKey: "advantages.transparentPrices",
      descKey: "advantages.transparentPricesDesc",
    },
    {
      icon: Wrench,
      titleKey: "advantages.maintenance",
      descKey: "advantages.maintenanceDesc",
    },
    {
      icon: Package,
      titleKey: "advantages.equipment",
      descKey: "advantages.equipmentDesc",
    },
    {
      icon: Smile,
      titleKey: "advantages.comfort",
      descKey: "advantages.comfortDesc",
    },
    {
      icon: Zap,
      titleKey: "advantages.flexible",
      descKey: "advantages.flexibleDesc",
    },
    {
      icon: Shield,
      titleKey: "advantages.safety",
      descKey: "advantages.safetyDesc",
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-20 lg:py-32"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease-out",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-balance text-4xl font-bold text-foreground mb-4">{t("advantages.title")}</h2>
        </div>

        {/* Advantages Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 rounded-lg bg-secondary border border-border hover:shadow-lg transition-shadow"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `all 0.8s ease-out ${index * 0.1}s`,
                }}
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{t(advantage.titleKey)}</h3>
                <p className="text-muted-foreground">{t(advantage.descKey)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
