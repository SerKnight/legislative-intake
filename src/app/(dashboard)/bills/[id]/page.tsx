import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function BillDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const bill = await prisma.bill.findUnique({
    where: { id: params.id },
    include: {
      jurisdiction: true,
      versions: true,
      amendments: true,
    },
  })

  if (!bill) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/bills">
          <Button variant="ghost">← Back to Bills</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{bill.billNumber}</CardTitle>
              <CardDescription className="mt-1">
                {bill.jurisdiction.name}
              </CardDescription>
            </div>
            <Badge>{bill.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Title</h2>
            <p>{bill.title}</p>
          </div>
          {bill.summary && (
            <div>
              <h2 className="mb-2 text-xl font-semibold">Summary</h2>
              <p className="text-muted-foreground">{bill.summary}</p>
            </div>
          )}
          {bill.aiSummary && (
            <div>
              <h2 className="mb-2 text-xl font-semibold">AI Summary</h2>
              <p className="text-muted-foreground">{bill.aiSummary}</p>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {bill.introducedDate && (
              <div>
                <h3 className="mb-1 font-semibold">Introduced Date</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(bill.introducedDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {bill.lastActionDate && (
              <div>
                <h3 className="mb-1 font-semibold">Last Action Date</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(bill.lastActionDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {bill.primarySponsor && (
              <div>
                <h3 className="mb-1 font-semibold">Primary Sponsor</h3>
                <p className="text-sm text-muted-foreground">
                  {bill.primarySponsor}
                </p>
              </div>
            )}
            {bill.session && (
              <div>
                <h3 className="mb-1 font-semibold">Session</h3>
                <p className="text-sm text-muted-foreground">{bill.session}</p>
              </div>
            )}
          </div>
          {bill.sponsors.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">Sponsors</h3>
              <div className="flex flex-wrap gap-2">
                {bill.sponsors.map((sponsor, index) => (
                  <Badge key={index} variant="secondary">
                    {sponsor}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {bill.committees.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">Committees</h3>
              <div className="flex flex-wrap gap-2">
                {bill.committees.map((committee, index) => (
                  <Badge key={index} variant="outline">
                    {committee}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {bill.topics.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {bill.topics.map((topic, index) => (
                  <Badge key={index} variant="outline">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {bill.documentUrl && (
            <div>
              <h3 className="mb-2 font-semibold">Document</h3>
              <a
                href={bill.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Document →
              </a>
            </div>
          )}
          {bill.lastAction && (
            <div>
              <h3 className="mb-2 font-semibold">Last Action</h3>
              <p className="text-muted-foreground">{bill.lastAction}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

