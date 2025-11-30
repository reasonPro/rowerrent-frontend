"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import AdvantagesSection from "@/components/advantages-section"
import HowItWorks from "@/components/how-it-works"
import BikesCatalog from "@/components/bikes-catalog"
import ReviewsSection from "@/components/reviews-section"
import FaqSection from "@/components/faq-section"
import Footer from "@/components/footer"
import BookingModal from "@/components/booking-modal"
import RegistrationModal from "@/components/registration-modal"
import LoginModal from "@/components/login-modal"
import FloatingContactButton from "@/components/floating-contact-button"
import CookieBanner from "@/components/cookie-banner"
import LegalModal from "@/components/legal-modal"
import ReviewModal from "@/components/review-modal"
import LocationSection from "@/components/location-section"

// Інтерфейс для відгуків
interface Review {
  name: string
  content: string
  rating: number
  avatar: string
  timestamp?: string
}

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  const [reviews, setReviews] = useState<Review[]>([
    {
      name: "Jan Kowalski",
      content: "Świetna usługa! Rowery są zawsze w doskonałym stanie.",
      rating: 5,
      avatar: "JK",
    },
    {
      name: "Maria Nowak",
      content: "Brak kaucji to genialne rozwiązanie. Polecam!",
      rating: 5,
      avatar: "MN",
    },
    {
      name: "Piotr Wiśniewski",
      content: "Bezproblemowa wypożyczalnia. Kaski są zawsze dostępne.",
      rating: 5,
      avatar: "PW",
    },
    {
      name: "Anna Lewandowska",
      content: "Ceny bardzo konkurencyjne!",
      rating: 5,
      avatar: "AL",
    },
  ])

  const handleReviewSubmit = (comment: string, rating: number) => {
    const newReview: Review = {
      name: "Nazar",
      content: comment,
      rating: rating,
      avatar: "N",
      timestamp: new Date().toLocaleDateString(),
    }
    setReviews((prevReviews) => [newReview, ...prevReviews].slice(0, 4))
  }

  return (
    <main className="w-full">
      <Header onRegisterClick={() => setIsRegistrationOpen(true)} onLoginClick={() => setIsLoginOpen(true)} />
      
      <HeroSection />
      <AdvantagesSection />
      <HowItWorks />
      <BikesCatalog onBookClick={() => setIsBookingOpen(true)} />
      <LocationSection />
      <ReviewsSection onLeaveReviewClick={() => setIsReviewOpen(true)} reviews={reviews} />
      <FaqSection />
      <Footer onTermsClick={() => setIsTermsOpen(true)} onPrivacyClick={() => setIsPrivacyOpen(true)} />
      
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} onSubmit={handleReviewSubmit} />
      <FloatingContactButton />
      <CookieBanner />
      <LegalModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} type="terms" />
      <LegalModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} type="privacy" />
    </main>
  )
}