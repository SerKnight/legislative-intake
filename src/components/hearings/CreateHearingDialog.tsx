"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const hearingSchema = z.object({
  title: z.string().min(1, "Hearing title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "POSTPONED"]),
})

type HearingInput = z.infer<typeof hearingSchema>

interface Hearing {
  id: string
  title: string
  date: Date
  location: string | null
  description: string | null
  status: string
}

interface CreateHearingDialogProps {
  sessionId: string
  hearing?: Hearing
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateHearingDialog({
  sessionId,
  hearing,
  children,
  open: controlledOpen,
  onOpenChange,
}: CreateHearingDialogProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  // Format date and time for form
  const hearingDate = hearing ? new Date(hearing.date) : new Date()
  const dateStr = hearingDate.toISOString().split("T")[0]
  const timeStr = hearingDate.toTimeString().slice(0, 5)

  const form = useForm<HearingInput>({
    resolver: zodResolver(hearingSchema),
    defaultValues: {
      title: hearing?.title || "",
      date: dateStr,
      time: timeStr,
      location: hearing?.location || "",
      description: hearing?.description || "",
      status: (hearing?.status as any) || "SCHEDULED",
    },
  })

  const onSubmit = async (data: HearingInput) => {
    setIsSubmitting(true)

    try {
      // Combine date and time
      const dateTime = data.time
        ? new Date(`${data.date}T${data.time}`)
        : new Date(data.date)

      const url = hearing
        ? `/api/sessions/${sessionId}/hearings/${hearing.id}`
        : `/api/sessions/${sessionId}/hearings`
      const method = hearing ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          date: dateTime.toISOString(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save hearing")
      }

      setIsOpen(false)
      form.reset()
      router.refresh()
    } catch (error) {
      console.error("Error saving hearing:", error)
      alert(error instanceof Error ? error.message : "Failed to save hearing")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{hearing ? "Edit Hearing" : "Schedule Hearing"}</DialogTitle>
          <DialogDescription>
            {hearing
              ? "Update the hearing details below."
              : "Schedule a new hearing and link bills to create an agenda. Hearings help coordinate committee work and track legislative events."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hearing Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Committee on Health and Human Services"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear title describing the hearing or committee meeting
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Optional start time</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Room 101, State Capitol" {...field} />
                  </FormControl>
                  <FormDescription>Where the hearing will take place</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="POSTPONED">Postponed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description or agenda notes..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : hearing ? (
                  "Update Hearing"
                ) : (
                  "Schedule Hearing"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

