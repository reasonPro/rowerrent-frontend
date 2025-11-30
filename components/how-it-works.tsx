"use client"

import { BookOpen, MapPin, Bike } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function HowItWorks() {
  const { t } = useLanguage()

  const steps = [
    {
      icon: BookOpen,
      title: t("howItWorks.step1"),
      description: t("howItWorks.step1Desc"),
    },
    {
      icon: MapPin,
      title: t("howItWorks.step2"),
      description: t("howItWorks.step2Desc"),
    },
    {
      icon: Bike,
      title: t("howItWorks.step3"),
      description: t("howItWorks.step3Desc"),
    },
  ]

  return (
    <section className="w-full bg-secondary py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-balance text-4xl font-bold text-foreground mb-4">{t("howItWorks.title")}</h2>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              // Додав relative про всяк випадок, але саму лінію ми видалили
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Step Number Circle */}
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white font-bold text-2xl">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>

                {/* ТУТ БУЛА ЛІНІЯ - Я ЇЇ ВИДАЛИВ */}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}