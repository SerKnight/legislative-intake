import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { Pricing } from "@/components/landing/Pricing"
import { CTA } from "@/components/landing/CTA"
import { Footer } from "@/components/landing/Footer"
import { Navigation } from "@/components/landing/Navigation"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

