"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"

interface BillSearchSessionProps {
  sessionId: string
  initialQuery?: string
}

export function BillSearchSession({ sessionId, initialQuery }: BillSearchSessionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery || "")
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedQuery) {
      params.set("search", debouncedQuery)
    } else {
      params.delete("search")
    }
    router.push(`/sessions/${sessionId}/bills?${params.toString()}`)
  }, [debouncedQuery, router, searchParams, sessionId])

  return (
    <div className="mb-6">
      <Input
        type="search"
        placeholder="Search bills by title, number, or summary..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />
    </div>
  )
}

