import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Pricing() {
  return (
    <section id="pricing" className="container py-24">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Try Before You Buy
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Start with a free trial. Experience all features with no credit card required. 
          Pricing available upon request for enterprise customers.
        </p>
        <Link href="/signup">
          <Button size="lg" className="text-lg px-8">
            Start Free Trial
          </Button>
        </Link>
        <p className="mt-6 text-sm text-muted-foreground">
          Need enterprise pricing or have questions?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </section>
  )
}

