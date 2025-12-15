import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="container flex flex-col items-center gap-8 py-24 text-center md:py-32">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
        AI-Powered Legislative Intelligence
      </h1>
      <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
        Track bills, predict outcomes, and stay ahead with real-time legislative
        intelligence powered by AI.
      </p>
      <div className="flex gap-4">
        <Link href="/signup">
          <Button size="lg">Get Started Free</Button>
        </Link>
        <Link href="#features">
          <Button size="lg" variant="outline">
            See Demo
          </Button>
        </Link>
      </div>
    </section>
  )
}

