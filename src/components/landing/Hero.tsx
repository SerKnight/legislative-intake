import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const stats = [
  { value: "150K+", label: "Bills Tracked" },
  { value: "Sub-minute", label: "Alert Speed" },
  { value: "99%", label: "Accuracy" },
  { value: "50+", label: "Organizations" },
]

export function Hero() {
  return (
    <section className="container py-24 md:py-32 relative">
      <div className="flex flex-col items-center gap-8 text-center relative z-10">
        <Badge variant="secondary" className="mb-2">
          Trusted by 50+ organizations
        </Badge>
        
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          Never Miss a Bill That Matters
        </h1>
        
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Legislative intelligence that works while you sleep. Get AI-powered summaries, 
          real-time alerts, and semantic search—so you can focus on what matters.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Start Free Trial
            </Button>
          </Link>
          <Link href="#product-showcase">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Watch Demo
            </Button>
          </Link>
        </div>
        
        <p className="text-sm text-muted-foreground">
          No credit card required • Setup in minutes
        </p>
      </div>

      {/* Stats Bar */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-b py-8 relative z-10">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Hero Visual */}
      <div className="mt-16 relative aspect-video rounded-lg border bg-muted overflow-hidden z-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-sm text-muted-foreground mb-2">Product Screenshot</p>
            <p className="text-xs text-muted-foreground max-w-2xl">
              ALT: "Dashboard showing real-time bill tracking with AI summaries, 
              semantic search interface, alert notifications, and organized bill list 
              with topic classifications"
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

