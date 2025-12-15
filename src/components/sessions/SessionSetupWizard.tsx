"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Steps } from "@/components/ui/steps"
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
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const sessionSetupSchema = z.object({
  name: z.string().min(1, "Session name is required"),
  identifier: z
    .string()
    .min(1, "Identifier is required")
    .regex(/^[A-Z0-9-]+$/, "Identifier must be uppercase letters, numbers, and hyphens only"),
  jurisdictionId: z.string().min(1, "Please select a jurisdiction"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
})

type SessionSetupInput = z.infer<typeof sessionSetupSchema>

interface Jurisdiction {
  id: string
  name: string
  code: string
  type: string
}

interface SessionSetupWizardProps {
  jurisdictions: Jurisdiction[]
  defaultJurisdictionId?: string
}

const steps = [
  { id: "basic", label: "Basic Information", description: "Session details" },
  { id: "categories", label: "Categories", description: "Optional categories" },
]

export function SessionSetupWizard({ jurisdictions, defaultJurisdictionId }: SessionSetupWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SessionSetupInput>({
    resolver: zodResolver(sessionSetupSchema),
    defaultValues: {
      identifier: "",
      jurisdictionId: defaultJurisdictionId || "",
    },
    mode: "onChange",
  })

  const watchIdentifier = form.watch("identifier")
  const watchJurisdiction = form.watch("jurisdictionId")

  // Auto-generate identifier from jurisdiction and year
  React.useEffect(() => {
    if (watchJurisdiction && !watchIdentifier) {
      const jurisdiction = jurisdictions.find((j) => j.id === watchJurisdiction)
      if (jurisdiction) {
        const year = new Date().getFullYear()
        const suggested = `${jurisdiction.code}-${year}`
        form.setValue("identifier", suggested)
      }
    }
  }, [watchJurisdiction, watchIdentifier, jurisdictions, form])

  const nextStep = async () => {
    let fieldsToValidate: (keyof SessionSetupInput)[] = []

    if (currentStep === 0) {
      fieldsToValidate = ["name", "identifier", "jurisdictionId", "startDate"]
    }

    const isValid = await form.trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const onSubmit = async (data: SessionSetupInput) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          identifier: data.identifier.toUpperCase(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        const errorMessage = error.details
          ? `${error.error}: ${JSON.stringify(error.details)}`
          : error.error || "Failed to create session"
        throw new Error(errorMessage)
      }

      const result = await response.json()
      router.push(`/sessions/${result.session.id}`)
    } catch (error) {
      console.error("Error creating session:", error)
      alert(
        error instanceof Error ? error.message : "Failed to create session. Please try again."
      )
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Session</h1>
        <p className="text-muted-foreground">
          Set up a new legislative session to organize and track bills
        </p>
      </div>

      <div className="mb-8">
        <Steps steps={steps} currentStep={currentStep} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].label}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 2025 Regular Session"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The display name for this legislative session
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Identifier *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., CA-2025"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value.toUpperCase())
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Unique identifier (uppercase letters, numbers, hyphens only)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jurisdictionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jurisdiction *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a jurisdiction" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jurisdictions.map((jurisdiction) => (
                              <SelectItem
                                key={jurisdiction.id}
                                value={jurisdiction.id}
                              >
                                {jurisdiction.name} ({jurisdiction.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The jurisdiction for this session
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
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
                            <Input
                              type="date"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>Optional end date</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Categories can be added after session creation. You can organize bills by
                    categories like "Healthcare", "Education", "Budget", etc.
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isSubmitting}
                >
                  Previous
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep} disabled={isSubmitting}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Session...
                      </>
                    ) : (
                      "Create Session"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

