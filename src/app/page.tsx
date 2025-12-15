import { Hero } from "@/components/landing/Hero"
import { Problem } from "@/components/landing/Problem"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Features } from "@/components/landing/Features"
import { UseCases } from "@/components/landing/UseCases"
import { Testimonials } from "@/components/landing/Testimonials"
import { ProductShowcase } from "@/components/landing/ProductShowcase"
import { FAQ } from "@/components/landing/FAQ"
import { CTA } from "@/components/landing/CTA"
import { Pricing } from "@/components/landing/Pricing"
import { Footer } from "@/components/landing/Footer"
import { Navigation } from "@/components/landing/Navigation"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col relative">
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <UseCases />
        <Testimonials />
        <ProductShowcase />
        <FAQ />
        <CTA />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}

