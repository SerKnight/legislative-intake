import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"

export default async function DashboardPage() {
  const billCount = await prisma.bill.count()
  const recentBills = await prisma.bill.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      jurisdiction: true,
    },
  })

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Bills</CardTitle>
            <CardDescription>Bills in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{billCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Tracking</CardTitle>
            <CardDescription>Bills you're monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Recent Bills</h2>
        <div className="space-y-4">
          {recentBills.map((bill) => (
            <Card key={bill.id}>
              <CardHeader>
                <CardTitle className="text-lg">{bill.billNumber}</CardTitle>
                <CardDescription>{bill.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {bill.jurisdiction.name} • {bill.status}
                  </span>
                  <a
                    href={`/bills/${bill.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Details →
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

