"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, FileText, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { CreateHearingDialog } from "./CreateHearingDialog"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface Hearing {
  id: string
  title: string
  date: Date
  location: string | null
  description: string | null
  status: string
  bills: Array<{
    bill: {
      id: string
      billNumber: string
      title: string
    }
  }>
}

interface HearingListProps {
  sessionId: string
  hearings: Hearing[]
  canManage: boolean
  currentFilters: {
    status?: string
    dateFrom?: string
    dateTo?: string
  }
}

export function HearingList({
  sessionId,
  hearings,
  canManage,
  currentFilters,
}: HearingListProps) {
  const router = useRouter()
  const [editingHearing, setEditingHearing] = useState<Hearing | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (currentFilters.status) params.set("status", currentFilters.status)
    if (currentFilters.dateFrom) params.set("dateFrom", currentFilters.dateFrom)
    if (currentFilters.dateTo) params.set("dateTo", currentFilters.dateTo)

    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/sessions/${sessionId}/hearings?${params.toString()}`)
  }

  if (hearings.length === 0) {
    return (
      <Card className="py-12">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hearings scheduled</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Schedule hearings to track committee meetings, floor debates, and other legislative
            events. Link bills to hearings to manage agendas and coordinate staff work.
          </p>
          {canManage && (
            <CreateHearingDialog
              sessionId={sessionId}
              open={isCreateOpen}
              onOpenChange={setIsCreateOpen}
            >
              <Button className="gap-2">
                <Calendar className="h-4 w-4" />
                Schedule First Hearing
              </Button>
            </CreateHearingDialog>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-xs font-medium mb-1 block">Status</label>
          <Select
            value={currentFilters.status || "all"}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="POSTPONED">Postponed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium mb-1 block">From Date</label>
          <Input
            type="date"
            value={currentFilters.dateFrom || ""}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium mb-1 block">To Date</label>
          <Input
            type="date"
            value={currentFilters.dateTo || ""}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
          />
        </div>
      </div>

      {/* Hearings List */}
      <div className="space-y-4">
        {hearings.map((hearing) => (
          <Card key={hearing.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {hearing.title}
                    <Badge
                      variant={
                        hearing.status === "COMPLETED"
                          ? "secondary"
                          : hearing.status === "CANCELLED"
                            ? "outline"
                            : "default"
                      }
                    >
                      {hearing.status.replace(/_/g, " ")}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(hearing.date), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                    {hearing.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {hearing.location}
                      </span>
                    )}
                  </CardDescription>
                </div>
                {canManage && (
                  <div className="flex gap-1">
                    <CreateHearingDialog
                      sessionId={sessionId}
                      hearing={hearing}
                      open={editingHearing?.id === hearing.id}
                      onOpenChange={(open) => setEditingHearing(open ? hearing : null)}
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </CreateHearingDialog>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {hearing.description && (
                <p className="text-sm text-muted-foreground mb-4">{hearing.description}</p>
              )}
              {hearing.bills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {hearing.bills.length} bill{hearing.bills.length !== 1 ? "s" : ""} on agenda
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hearing.bills.map((hb) => (
                      <Link
                        key={hb.bill.id}
                        href={`/bills/${hb.bill.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {hb.bill.billNumber}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {hearing.bills.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No bills linked to this hearing yet
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

