import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const useCases = [
  {
    title: "Fortune 500 Government Affairs",
    description:
      "Track multi-state legislation affecting operations across all jurisdictions where you do business.",
    useCase:
      "Monitor healthcare, data privacy, and labor bills across 20+ states simultaneously. Get alerts when bills affecting your industry are introduced, and access AI summaries to quickly assess impact.",
    imageAlt:
      "Dashboard view showing multi-state bill tracking for Fortune 500 company with alerts and summaries",
  },
  {
    title: "Trade Associations",
    description:
      "Monitor bills impacting your industry and provide members with timely intelligence.",
    useCase:
      "Track all legislation related to your industry across federal and state levels. Share curated bill summaries with members, identify advocacy opportunities, and track similar bills in other states.",
    imageAlt:
      "Trade association dashboard showing industry-specific bill tracking and member sharing features",
  },
  {
    title: "Law Firms",
    description:
      "Stay ahead of regulatory changes for clients and identify new business opportunities.",
    useCase:
      "Monitor regulatory changes that affect your clients' industries. Get early alerts on bills that may require legal review, find similar legislation for precedent research, and track compliance requirements.",
    imageAlt:
      "Law firm interface showing client-specific bill monitoring and regulatory compliance tracking",
  },
  {
    title: "Government Agencies",
    description:
      "Real-time tracking of related legislation and policy developments across jurisdictions.",
    useCase:
      "Track similar legislation in other states to inform policy development. Monitor federal legislation that may impact state programs, and stay informed about regulatory changes in related policy areas.",
    imageAlt:
      "Government agency dashboard showing cross-jurisdictional legislative tracking and policy analysis",
  },
]

export function UseCases() {
  return (
    <section id="use-cases" className="container py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Built for Every Type of Organization
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          See how different teams use Legislative Intake to stay ahead
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {useCases.map((useCase, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative aspect-video bg-muted flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  {useCase.title} Screenshot
                </p>
                <p className="text-xs text-muted-foreground">{useCase.imageAlt}</p>
              </div>
            </div>
            <CardHeader>
              <CardTitle>{useCase.title}</CardTitle>
              <CardDescription>{useCase.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{useCase.useCase}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

