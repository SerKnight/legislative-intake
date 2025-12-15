import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Sarah Chen",
    title: "Director of Government Affairs",
    company: "Fortune 500 Healthcare Company",
    quote:
      "Legislative Intake has transformed how we track bills. The AI summaries save us hours every week, and the semantic search helps us find bills we would have missed with keyword search.",
    initials: "SC",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    title: "Policy Director",
    company: "National Trade Association",
    quote:
      "The pattern matching feature is incredible. We can see if similar bills have been tried in other states, which helps us predict outcomes and develop better advocacy strategies.",
    initials: "MR",
    rating: 5,
  },
  {
    name: "Jennifer Park",
    title: "Partner",
    company: "Law Firm",
    quote:
      "Real-time alerts mean we're always the first to know about regulatory changes affecting our clients. The structured data export makes it easy to integrate with our case management system.",
    initials: "JP",
    rating: 5,
  },
  {
    name: "David Thompson",
    title: "Chief Policy Officer",
    company: "State Government Agency",
    quote:
      "The ability to track similar legislation across states has been invaluable for our policy development. We can learn from what's worked elsewhere and avoid repeating mistakes.",
    initials: "DT",
    rating: 5,
  },
]

const logos = [
  "Fortune 500 Company",
  "National Trade Association",
  "Major Law Firm",
  "State Government",
  "Healthcare Organization",
  "Technology Corporation",
]

export function Testimonials() {
  return (
    <section id="testimonials" className="container py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Trusted by Leading Organizations
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          See what our customers are saying
        </p>
      </div>

      {/* Logo Bar */}
      <div className="mb-16">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="relative aspect-video w-full max-w-[120px] bg-muted rounded flex items-center justify-center"
            >
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  ALT: "Logo of {logo}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar>
                  <AvatarImage
                    src=""
                    alt={`Headshot of ${testimonial.name}, ${testimonial.title} at ${testimonial.company}`}
                  />
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.company}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-500">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-muted-foreground italic">
                "{testimonial.quote}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

