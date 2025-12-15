import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Upload, FileText } from "lucide-react"

interface Bill {
  id: string
  billNumber: string
  title: string
  summary: string | null
  status: string
  priority?: string
  assignedTo?: string | null
  jurisdiction: {
    name: string
    code: string
  }
  legislativeSession?: {
    id: string
    name: string
  } | null
  categories?: Array<{
    category: {
      id: string
      name: string
      color: string | null
    }
  }>
  createdAt: Date
}

export function BillList({
  bills,
  showSession = true,
}: {
  bills: Bill[]
  showSession?: boolean
}) {
  if (bills.length === 0) {
    return (
      <Card className="py-12">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No bills found</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get started by uploading your first bill. Our wizard will guide you through the process.
          </p>
          <p className="text-sm text-muted-foreground">
            No bills match your current filters. Try adjusting your search or filters.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bills.map((bill) => (
        <Link key={bill.id} href={`/bills/${bill.id}`}>
          <Card className="h-full transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{bill.billNumber}</CardTitle>
                <div className="flex gap-1">
                  {bill.priority && (
                    <Badge
                      variant={
                        bill.priority === "URGENT"
                          ? "destructive"
                          : bill.priority === "HIGH"
                            ? "default"
                            : "outline"
                      }
                    >
                      {bill.priority}
                    </Badge>
                  )}
                  <Badge variant="outline">{bill.status}</Badge>
                </div>
              </div>
              <CardDescription>
                {bill.jurisdiction.name}
                {showSession && bill.legislativeSession && (
                  <> • {bill.legislativeSession.name}</>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="mb-2 font-semibold line-clamp-2">{bill.title}</h3>
              {bill.summary && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {bill.summary}
                </p>
              )}
              {bill.categories && bill.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {bill.categories.map((bc) => (
                    <Badge
                      key={bc.category.id}
                      variant="outline"
                      className="text-xs"
                      style={
                        bc.category.color
                          ? {
                              borderColor: bc.category.color,
                              color: bc.category.color,
                            }
                          : undefined
                      }
                    >
                      {bc.category.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

