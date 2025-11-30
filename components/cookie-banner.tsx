"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieAccepted = localStorage.getItem("cookieAccepted")
    if (!cookieAccepted) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookieAccepted", "true")
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-foreground text-white p-4 sm:p-6"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <p className="text-sm sm:text-base">This site uses cookies.</p>
            <Button
              onClick={handleAccept}
              className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              OK
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
