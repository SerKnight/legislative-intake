import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const painPoints = [
  {
    title: "Hours Spent Reading Bills Manually",
    description: "Your team wastes countless hours reading through hundreds of pages of legislative text, trying to find what matters.",
  },
  {
    title: "Miss Critical Amendments",
    description: "Important changes slip through the cracks because you can't track every version of every bill across all jurisdictions.",
  },
  {
    title: "Can't Find Related Bills",
    description: "Similar legislation exists in other states, but you have no way to discover it or learn from those outcomes.",
  },
  {
    title: "Outdated Interfaces from the 90s",
    description: "Legacy platforms feel like they're from another era—clunky, slow, and frustrating to use.",
  },
  {
    title: "Expensive Per-User Pricing",
    description: "Every team member costs more, making it expensive to give your whole organization access to critical intelligence.",
  },
  {
    title: "No Real-Time Intelligence",
    description: "By the time you learn about a bill, it may have already moved through committee or been amended multiple times.",
  },
]

export function Problem() {
  return (
    <section className="container py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          The Problem with Legacy Legislative Tracking
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          If you're using traditional bill tracking tools, you're probably experiencing these frustrations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {painPoints.map((point, index) => (
          <Card key={index} className="border-destructive/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground">{point.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl font-bold mb-4">The Old Way</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2 text-destructive">✗</span>
              <span>Manual bill reading and analysis</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-destructive">✗</span>
              <span>Keyword-based search that misses context</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-destructive">✗</span>
              <span>Hours or days of delay before alerts</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-destructive">✗</span>
              <span>No way to find similar bills across states</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-destructive">✗</span>
              <span>Expensive per-user licensing</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-4">The New Way</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2 text-primary">✓</span>
              <span>AI-powered summaries in seconds</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">✓</span>
              <span>Semantic search that understands meaning</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">✓</span>
              <span>Sub-minute alerts for real-time intelligence</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">✓</span>
              <span>Pattern matching finds similar bills everywhere</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">✓</span>
              <span>Transparent pricing, unlimited users</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="relative aspect-video rounded-lg border bg-muted flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Old Way Screenshot</p>
            <p className="text-xs text-muted-foreground">
              ALT: "Legacy legislative tracking interface showing cluttered design, keyword search box, and basic bill list"
            </p>
          </div>
        </div>
        <div className="relative aspect-video rounded-lg border bg-muted flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">New Way Screenshot</p>
            <p className="text-xs text-muted-foreground">
              ALT: "Modern dashboard showing AI summaries, semantic search, real-time alerts, and organized bill tracking"
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

