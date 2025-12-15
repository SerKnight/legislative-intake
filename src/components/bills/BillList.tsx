import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Bill {
  id: string
  billNumber: string
  title: string
  summary: string | null
  status: string
  jurisdiction: {
    name: string
    code: string
  }
  createdAt: Date
}

export function BillList({ bills }: { bills: Bill[] }) {
  if (bills.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No bills found.</p>
      </div>
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
                <Badge variant="outline">{bill.status}</Badge>
              </div>
              <CardDescription>{bill.jurisdiction.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="mb-2 font-semibold line-clamp-2">{bill.title}</h3>
              {bill.summary && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {bill.summary}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

