"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Loader2, Save } from "lucide-react"
import { useState } from "react"

const sessionSettingsSchema = z.object({
  name: z.string().min(1, "Session name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "CLOSED", "ARCHIVED"]),
  description: z.string().optional(),
})

type SessionSettingsInput = z.infer<typeof sessionSettingsSchema>

interface Session {
  id: string
  name: string
  startDate: Date
  endDate: Date | null
  status: string
  description: string | null
}

interface SessionSettingsFormProps {
  session: Session
}

export function SessionSettingsForm({ session }: SessionSettingsFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const form = useForm<SessionSettingsInput>({
    resolver: zodResolver(sessionSettingsSchema),
    defaultValues: {
      name: session.name,
      startDate: new Date(session.startDate).toISOString().split("T")[0],
      endDate: session.endDate
        ? new Date(session.endDate).toISOString().split("T")[0]
        : "",
      status: session.status as any,
      description: session.description || "",
    },
  })

  const onSubmit = async (data: SessionSettingsInput) => {
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const response = await fetch(`/api/sessions/${session.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          startDate: new Date(data.startDate).toISOString(),
          endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update session")
      }

      setSaveSuccess(true)
      router.refresh()

      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Error updating session:", error)
      alert(error instanceof Error ? error.message : "Failed to update session")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Details</CardTitle>
        <CardDescription>
          Update the session name, dates, status, and description. These details help identify and
          organize the legislative session.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2025 Regular Session" {...field} />
                  </FormControl>
                  <FormDescription>
                    The display name for this legislative session
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Optional end date for the session</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Active sessions are currently in progress. Closed sessions have ended but remain
                    accessible. Archived sessions are read-only.
                  </FormDescription>
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
                      placeholder="Optional description of this session..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                {saveSuccess && (
                  <p className="text-sm text-green-600">Settings saved successfully!</p>
                )}
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

