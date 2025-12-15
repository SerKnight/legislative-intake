import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Real-Time Tracking",
    description:
      "Get instant alerts when bills are introduced, amended, or passed. Never miss an important legislative update.",
  },
  {
    title: "AI Summaries",
    description:
      "Automated bill summaries powered by advanced AI. Understand complex legislation in seconds, not hours.",
  },
  {
    title: "Semantic Search",
    description:
      "Find relevant bills using natural language queries. Search by intent, not just keywords.",
  },
  {
    title: "Predictive Analytics",
    description:
      "Forecast bill passage probability and identify strategic opportunities before your competitors.",
  },
]

export function Features() {
  return (
    <section id="features" className="container py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Powerful Features
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to stay ahead of legislative changes
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

