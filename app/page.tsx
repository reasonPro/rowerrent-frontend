"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import AdvantagesSection from "@/components/advantages-section"
import HowItWorks from "@/components/how-it-works"
import BikesCatalog, { Bike } from "@/components/bikes-catalog"
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

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null)

  const handleBookClick = (bike: Bike) => {
    setSelectedBike(bike)
    setIsBookingOpen(true)
  }

  return (
    <>
      <Header onRegisterClick={() => setIsRegistrationOpen(true)} onLoginClick={() => setIsLoginOpen(true)} />
      
      <main className="w-full min-h-screen">
        <HeroSection />
        <AdvantagesSection />
        <HowItWorks />
        <BikesCatalog onBookClick={handleBookClick} />
        <LocationSection />
        {/* 👇 ВИПРАВЛЕНО: Прибрали reviews={reviews} */}
        <ReviewsSection onLeaveReviewClick={() => setIsReviewOpen(true)} />
        <FaqSection />
      </main>

      <Footer onTermsClick={() => setIsTermsOpen(true)} onPrivacyClick={() => setIsPrivacyOpen(true)} />
      
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        selectedBike={selectedBike} 
      />
      
      <RegistrationModal isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)} onOpenTerms={() => setIsTermsOpen(true)} onOpenPrivacy={() => setIsPrivacyOpen(true)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      {/* 👇 ВИПРАВЛЕНО: Прибрали onSubmit={handleReviewSubmit} */}
      <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
      
      <FloatingContactButton />
      <CookieBanner />
      <LegalModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} type="terms" />
      <LegalModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} type="privacy" />
    </>
  )
}