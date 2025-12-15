import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const featureSections = [
  {
    id: "summaries",
    title: "Understand Complex Bills in Seconds, Not Hours",
    description:
      "Our AI reads through hundreds of pages of legislative text and extracts the key provisions, impact, and implications—so you don't have to.",
    imageAlt:
      "AI-generated bill summary showing key provisions, impact analysis, and stakeholder implications",
    visualDescription: "Before/After comparison: 100-page bill → 2-paragraph summary",
  },
  {
    id: "classification",
    title: "Bills Automatically Organized by Topic",
    description:
      "Every bill is automatically tagged and categorized using pattern matching across 1,200+ topics. No more manual sorting or missing relevant legislation.",
    imageAlt:
      "Bill dashboard showing bills organized by topics like Healthcare, Data Privacy, Energy Policy",
    visualDescription: "Tag cloud or category tree visualization",
  },
  {
    id: "semantic-search",
    title: "Search by Meaning, Not Just Keywords",
    description:
      "Semantic search understands what you're looking for, even if the exact words don't appear in the bill. Ask 'What bills affect data privacy?' and find all relevant legislation, regardless of how it's worded.",
    imageAlt:
      "Search interface showing natural language query 'bills affecting small business taxes' with relevant results",
    visualDescription: "Search bar with example queries",
  },
  {
    id: "pattern-matching",
    title: "Find Similar Bills Across All Jurisdictions",
    description:
      "See if a bill has been tried elsewhere. Our pattern matching identifies similar legislation across states, helping you predict outcomes and learn from other jurisdictions.",
    imageAlt:
      "Map visualization showing similar data privacy bills across multiple states with similarity scores",
    visualDescription: "Map showing connected bills across states",
  },
  {
    id: "structured-data",
    title: "From Unstructured Chaos to Organized Intelligence",
    description:
      "We transform messy PDFs, Word documents, and web pages into structured, searchable data. Every bill becomes a database entry with metadata, relationships, and full-text search.",
    imageAlt:
      "Side-by-side view of original bill PDF and extracted structured data with metadata fields",
    visualDescription: "PDF → Structured JSON/data visualization",
  },
  {
    id: "citations",
    title: "Every Claim Backed by Sources",
    description:
      "Our AI summaries include citations to specific bill sections, amendments, and related documents. Trust but verify—we show you exactly where information comes from.",
    imageAlt:
      "AI summary with numbered citations linking to specific bill sections",
    visualDescription: "Summary with clickable citations",
  },
  {
    id: "project-management",
    title: "Track Bills Like Projects",
    description:
      "Organize bills into projects, assign team members, set deadlines, and track progress. Turn legislative monitoring into actionable workflows.",
    imageAlt:
      "Project management view showing bills organized in columns: Watching, In Committee, On Floor, Passed",
    visualDescription: "Kanban board or project view",
  },
]

export function Features() {
  return (
    <section id="features" className="container py-24">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Powerful Features That Save You Time
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Every feature is designed to eliminate manual work and give you the intelligence 
          you need to make better decisions faster.
        </p>
      </div>

      <div className="space-y-24">
        {featureSections.map((feature, index) => (
          <div key={feature.id}>
            <div
              className={`grid gap-12 items-center ${
                index % 2 === 0 ? "md:grid-cols-2" : "md:grid-cols-2"
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  {feature.description}
                </p>
                {index === 0 && (
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <p className="text-sm font-medium mb-2">Example:</p>
                    <p className="text-sm text-muted-foreground">
                      A 150-page healthcare bill becomes a concise 3-paragraph summary 
                      highlighting: key provisions, affected stakeholders, estimated impact, 
                      and passage probability—all in under 30 seconds.
                    </p>
                  </div>
                )}
                {index === 2 && (
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <p className="text-sm font-medium mb-2">What is Semantic Search?</p>
                    <p className="text-sm text-muted-foreground">
                      Unlike keyword search that only finds exact word matches, semantic 
                      search understands the meaning behind your query. Search for "data 
                      privacy" and find bills about "information security," "consumer data 
                      protection," and "personal information safeguards" even if those exact 
                      words aren't used.
                    </p>
                  </div>
                )}
              </div>

              {/* Visual */}
              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-muted flex items-center justify-center">
                    <div className="text-center p-6">
                      <p className="text-sm text-muted-foreground mb-2">
                        {feature.visualDescription}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {feature.imageAlt}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {index < featureSections.length - 1 && (
              <Separator className="mt-12" />
            )}
          </div>
        ))}
      </div>

      {/* CTA after features */}
      <div className="mt-16 text-center">
        <p className="text-lg text-muted-foreground mb-6">
          Ready to see these features in action?
        </p>
        <Link href="/signup">
          <Button size="lg">Start Free Trial</Button>
        </Link>
      </div>
    </section>
  )
}
