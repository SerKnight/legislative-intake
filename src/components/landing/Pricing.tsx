import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Limited bill tracking",
      "Basic search",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$99",
    description: "For growing teams",
    features: [
      "Unlimited bill tracking",
      "AI summaries",
      "Advanced search",
      "Priority support",
      "Custom alerts",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Training & onboarding",
    ],
  },
]

export function Pricing() {
  return (
    <section className="container py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Simple Pricing
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that works for you
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, index) => (
          <Card key={index} className={index === 1 ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.price !== "Custom" && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <span className="mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block">
                <Button
                  className="w-full"
                  variant={index === 1 ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

