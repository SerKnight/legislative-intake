"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

const showcases = [
  {
    id: "dashboard",
    label: "Dashboard",
    title: "Dashboard Overview",
    description:
      "Get a comprehensive view of all bills you're tracking, organized by status, topic, and priority.",
    imageAlt:
      "Dashboard showing bill list with filters, status indicators, topic tags, and quick action buttons",
  },
  {
    id: "bill-detail",
    label: "Bill Detail",
    title: "Bill Detail with AI Summary",
    description:
      "View complete bill information with AI-generated summaries, key provisions, impact analysis, and source citations.",
    imageAlt:
      "Bill detail page showing full bill text, AI summary with citations, key provisions highlighted, and related bills",
  },
  {
    id: "search",
    label: "Search",
    title: "Semantic Search Interface",
    description:
      "Search bills using natural language. Find relevant legislation even when exact keywords don't match.",
    imageAlt:
      "Search interface with natural language query box, search results showing relevance scores, and filters",
  },
  {
    id: "alerts",
    label: "Alerts",
    title: "Alert Settings & Notifications",
    description:
      "Configure custom alerts for bills matching your criteria. Get notified instantly when something changes.",
    imageAlt:
      "Alert configuration page showing saved searches, notification preferences, and recent alert history",
  },
  {
    id: "projects",
    label: "Projects",
    title: "Project Management View",
    description:
      "Organize bills into projects, track progress, assign team members, and manage workflows.",
    imageAlt:
      "Project management board showing bills organized in columns: Watching, In Committee, On Floor, Passed",
  },
]

export function ProductShowcase() {
  return (
    <section id="product-showcase" className="container py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          See It In Action
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Take a tour of the platform and see how it works
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
          {showcases.map((showcase) => (
            <TabsTrigger key={showcase.id} value={showcase.id}>
              {showcase.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {showcases.map((showcase) => (
          <TabsContent key={showcase.id} value={showcase.id}>
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-muted flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-sm text-muted-foreground mb-2">
                    {showcase.title} Screenshot
                  </p>
                  <p className="text-xs text-muted-foreground max-w-2xl">
                    {showcase.imageAlt}
                  </p>
                </div>
              </div>
              <div className="p-6 border-t">
                <h3 className="text-xl font-semibold mb-2">{showcase.title}</h3>
                <p className="text-muted-foreground">{showcase.description}</p>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

