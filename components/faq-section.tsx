"use client"

import { useRef, useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
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

  const faqItems = [
    {
      question: t("faq.q1"),
      answer: t("faq.a1"),
    },
    {
      question: t("faq.q2"),
      answer: t("faq.a2"),
    },
    {
      question: t("faq.q3"),
      answer: t("faq.a3"),
    },
    {
      question: t("faq.q4"),
      answer: t("faq.a4"),
    },
    {
      question: t("faq.q5"),
      answer: t("faq.a5"),
    },
    {
      question: t("faq.q6"),
      answer: t("faq.a6"),
    },
    {
      question: t("faq.q7"),
      answer: t("faq.a7"),
    },
    {
      question: t("faq.q8"),
      answer: t("faq.a8"),
    },
    {
      question: t("faq.q9"),
      answer: t("faq.a9"),
    },
    {
      question: t("faq.q10"),
      answer: t("faq.a10"),
    },
    {
      question: t("faq.q11"),
      answer: t("faq.a11"),
    },
    {
      question: t("faq.q12"),
      answer: t("faq.a12"),
    },
    {
      question: t("faq.q13"),
      answer: t("faq.a13"),
    },
  ]

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="w-full bg-white py-20 lg:py-32"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease-out",
      }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-balance text-4xl font-bold text-foreground mb-4">{t("faq.title")}</h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden bg-white hover:border-primary/30 transition-colors"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(10px)",
                transition: `all 0.6s ease-out ${index * 0.05}s`,
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left hover:bg-secondary transition-colors"
              >
                <span className="font-semibold text-foreground text-balance">{item.question}</span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-primary transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="border-t border-border px-6 py-4 bg-secondary/30">
                  <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
