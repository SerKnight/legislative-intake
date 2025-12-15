"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, FileText, Calendar, AlertCircle, User } from "lucide-react"

interface Metrics {
  totalBills: number
  totalHearings: number
  upcomingHearings: number
  recentActivity: number
  myBills: number
  highPriorityBills: number
  billsByStatus: Array<{ status: string; count: number }>
  billsByPriority: Array<{ priority: string; count: number }>
  billsByCategory: Array<{
    categoryId: string
    categoryName: string
    categorySlug: string
    categoryColor: string | null
    count: number
  }>
}

interface SessionMetricsProps {
  metrics: Metrics
}

export function SessionMetrics({ metrics }: SessionMetricsProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBills}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.recentActivity} updated this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Hearings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcomingHearings}</div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Bills</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.myBills}</div>
            <p className="text-xs text-muted-foreground">
              Assigned to me
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.highPriorityBills}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bills by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Bills by Status</CardTitle>
          <CardDescription>Distribution of bills across different statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {metrics.billsByStatus.map((item) => (
              <Badge key={item.status} variant="outline" className="gap-2">
                <span className="font-medium">{item.status.replace(/_/g, " ")}</span>
                <span className="text-muted-foreground">{item.count}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bills by Category */}
      {metrics.billsByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bills by Category</CardTitle>
            <CardDescription>Bills organized by session categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {metrics.billsByCategory.map((item) => (
                <Badge
                  key={item.categoryId}
                  variant="outline"
                  className="gap-2"
                  style={
                    item.categoryColor
                      ? {
                          borderColor: item.categoryColor,
                          color: item.categoryColor,
                        }
                      : undefined
                  }
                >
                  <span className="font-medium">{item.categoryName}</span>
                  <span className="text-muted-foreground">{item.count}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bills by Priority */}
      <Card>
        <CardHeader>
          <CardTitle>Bills by Priority</CardTitle>
          <CardDescription>Priority distribution of bills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {metrics.billsByPriority.map((item) => (
              <Badge
                key={item.priority}
                variant={
                  item.priority === "URGENT"
                    ? "destructive"
                    : item.priority === "HIGH"
                      ? "default"
                      : "outline"
                }
                className="gap-2"
              >
                <span className="font-medium">{item.priority}</span>
                <span>{item.count}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

