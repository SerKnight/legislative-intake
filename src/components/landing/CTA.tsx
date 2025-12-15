import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="container py-24">
      <div className="rounded-lg border bg-muted p-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Start tracking legislation today
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join thousands of organizations using Legislative Intake to stay ahead
        </p>
        <div className="mt-8">
          <Link href="/signup">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

