"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { FileText, Calendar, Vote } from "lucide-react"

interface ActivityItem {
  id: string
  type: "bill_update" | "hearing" | "vote"
  title: string
  description?: string
  date: string
  link?: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>No recent activity</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "bill_update":
        return <FileText className="h-4 w-4" />
      case "hearing":
        return <Calendar className="h-4 w-4" />
      case "vote":
        return <Vote className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates in this session</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const content = (
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcon(activity.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.date), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>
            )

            return activity.link ? (
              <Link
                key={activity.id}
                href={activity.link}
                className="block rounded-md p-2 hover:bg-accent transition-colors"
              >
                {content}
              </Link>
            ) : (
              <div key={activity.id} className="rounded-md p-2">
                {content}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

