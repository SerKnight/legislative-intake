"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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
import { Loader2, Save } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const userSettingsSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum([
    "USER",
    "ADMIN",
    "LEGISLATOR",
    "STAFF_DIRECTOR",
    "POLICY_ANALYST",
    "LEGISLATIVE_AIDE",
    "COMMITTEE_STAFF",
    "BUDGET_ANALYST",
    "CONSTITUENT_SERVICES",
    "RESEARCHER",
  ]),
  defaultJurisdictionId: z.string().optional().nullable(),
  title: z.string().optional(),
  office: z.string().optional(),
  bio: z.string().optional(),
})

type UserSettingsInput = z.infer<typeof userSettingsSchema>

interface Jurisdiction {
  id: string
  name: string
  code: string
  type: string
}

interface User {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  defaultJurisdictionId: string | null
  title: string | null
  office: string | null
  bio: string | null
  defaultJurisdiction: {
    id: string
    name: string
    code: string
  } | null
}

interface UserSettingsFormProps {
  user: User
  jurisdictions: Jurisdiction[]
}

const roleDescriptions: Record<string, string> = {
  USER: "Basic user access",
  ADMIN: "Full system administration access",
  LEGISLATOR: "Elected official or representative",
  STAFF_DIRECTOR: "Senior staff member with management responsibilities",
  POLICY_ANALYST: "Policy research, analysis, and development",
  LEGISLATIVE_AIDE: "Support staff for legislators",
  COMMITTEE_STAFF: "Staff assigned to specific committees",
  BUDGET_ANALYST: "Budget and fiscal analysis",
  CONSTITUENT_SERVICES: "Public-facing constituent services",
  RESEARCHER: "Legislative research and information services",
}

export function UserSettingsForm({ user, jurisdictions }: UserSettingsFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const form = useForm<UserSettingsInput>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email,
      phone: user.phone || "",
      role: user.role as any,
      defaultJurisdictionId: user.defaultJurisdictionId || null,
      title: user.title || "",
      office: user.office || "",
      bio: user.bio || "",
    },
  })

  const onSubmit = async (data: UserSettingsInput) => {
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update settings")
      }

      setSaveSuccess(true)
      router.refresh()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Error updating settings:", error)
      alert(error instanceof Error ? error.message : "Failed to update settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" disabled {...field} />
                      </FormControl>
                      <FormDescription>
                        Email cannot be changed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="ADMIN">Administrator</SelectItem>
                            <SelectItem value="LEGISLATOR">Legislator</SelectItem>
                            <SelectItem value="STAFF_DIRECTOR">Staff Director</SelectItem>
                            <SelectItem value="POLICY_ANALYST">Policy Analyst</SelectItem>
                            <SelectItem value="LEGISLATIVE_AIDE">Legislative Aide</SelectItem>
                            <SelectItem value="COMMITTEE_STAFF">Committee Staff</SelectItem>
                            <SelectItem value="BUDGET_ANALYST">Budget Analyst</SelectItem>
                            <SelectItem value="CONSTITUENT_SERVICES">Constituent Services</SelectItem>
                            <SelectItem value="RESEARCHER">Researcher</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {roleDescriptions[field.value] || "Select your role in the legislative body"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultJurisdictionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Legislative Body</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                          value={field.value || "none"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select default jurisdiction" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {jurisdictions.map((jurisdiction) => (
                              <SelectItem key={jurisdiction.id} value={jurisdiction.id}>
                                {jurisdiction.name} ({jurisdiction.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Your default legislative body for new sessions and bills
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Senior Policy Analyst"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Your professional title or position
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="office"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Office</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Office of Representative Smith"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Office or department you work in
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of your role and responsibilities..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional brief description of your role
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
    </div>
  )
}

