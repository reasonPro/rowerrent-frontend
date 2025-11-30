import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import LanguageProvider from "@/components/language-provider"
import AuthProvider from "@/components/auth-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RowerRent - Wypożyczalnia Rowerów | Bike Rental",
  description:
    "Nowoczesna wypożyczalnia rowerów. Proste rezerwacje, brak kaucji, darmowe kaski. Modern bike rental service.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <body className={`${_geist.className} antialiased`}>
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
