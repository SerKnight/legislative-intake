"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useState } from "react"

interface Category {
  id: string
  name: string
  slug: string
  color: string | null
}

interface User {
  id: string
  name: string | null
  email: string
}

interface BillFiltersProps {
  sessionId: string
  categories: Category[]
  users: User[]
  currentFilters: {
    search?: string
    category?: string
    status?: string
    priority?: string
    assignedTo?: string
    sortBy?: string
  }
}

export function BillFilters({
  sessionId,
  categories,
  users,
  currentFilters,
}: BillFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentFilters.search || "")

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/sessions/${sessionId}/bills?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(`/sessions/${sessionId}/bills`)
  }

  const hasActiveFilters =
    currentFilters.category ||
    currentFilters.status ||
    currentFilters.priority ||
    currentFilters.assignedTo ||
    currentFilters.sortBy ||
    currentFilters.search

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="text-xs font-medium mb-1 block">Search</label>
          <Input
            type="search"
            placeholder="Search bills..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              updateFilter("search", e.target.value)
            }}
          />
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block">Category</label>
          <Select
            value={currentFilters.category || "all"}
            onValueChange={(value) => updateFilter("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
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
              <SelectItem value="INTRODUCED">Introduced</SelectItem>
              <SelectItem value="IN_COMMITTEE">In Committee</SelectItem>
              <SelectItem value="PASSED_COMMITTEE">Passed Committee</SelectItem>
              <SelectItem value="ON_FLOOR">On Floor</SelectItem>
              <SelectItem value="PASSED">Passed</SelectItem>
              <SelectItem value="VETOED">Vetoed</SelectItem>
              <SelectItem value="ENACTED">Enacted</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block">Priority</label>
          <Select
            value={currentFilters.priority || "all"}
            onValueChange={(value) => updateFilter("priority", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block">Assigned To</label>
          <Select
            value={currentFilters.assignedTo || "all"}
            onValueChange={(value) => updateFilter("assignedTo", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block">Sort By</label>
          <Select
            value={currentFilters.sortBy || "updated"}
            onValueChange={(value) => updateFilter("sortBy", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="date">Introduction Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="number">Bill Number</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

