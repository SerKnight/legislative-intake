import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const benefits = [
  "AI-powered bill summaries in seconds",
  "Real-time alerts for critical changes",
  "Semantic search across all bills",
  "Pattern matching finds similar legislation",
  "Unlimited users on your team",
  "Export data anytime",
]

export function CTA() {
  return (
    <section className="container py-24">
      <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Start Tracking Legislation Today
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Join organizations using Legislative Intake to stay ahead of legislative changes. 
          Get started in minutes, no credit card required.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • Setup in minutes • Cancel anytime
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            <span>SOC 2 Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            <span>99.9% Uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            <span>Enterprise Security</span>
          </div>
        </div>
      </div>
    </section>
  )
}

