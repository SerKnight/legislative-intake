"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, FileText } from "lucide-react"

interface DocumentViewerProps {
  billId: string
}

export function DocumentViewer({ billId }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleViewDocument = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/bills/${billId}/document`)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to load document")
      }

      const { url } = await response.json()
      
      // Open the signed URL in a new tab
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load document")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleViewDocument}
        disabled={isLoading}
        variant="outline"
        className="gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            View Document
            <ExternalLink className="h-3 w-3" />
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

