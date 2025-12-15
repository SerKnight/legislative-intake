"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { billUploadSchema, type BillUploadInput } from "@/lib/validations"
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
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle2, Loader2, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

interface Jurisdiction {
  id: string
  name: string
  code: string
  type: string
}

interface Session {
  id: string
  name: string
  identifier: string
}

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

interface BillUploadWizardProps {
  jurisdictions: Jurisdiction[]
  session: Session
  categories: Category[]
  users: User[]
  defaultJurisdictionId?: string
}

const steps = [
  { id: "basic", label: "Basic Information", description: "Bill details" },
  { id: "document", label: "Upload Document", description: "Upload bill file" },
  { id: "details", label: "Additional Details", description: "Optional information" },
]

export function BillUploadWizard({ jurisdictions, session, categories, users, defaultJurisdictionId }: BillUploadWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const form = useForm<BillUploadInput>({
    resolver: zodResolver(billUploadSchema),
    defaultValues: {
      sessionId: session.id,
      jurisdictionId: defaultJurisdictionId || "",
      status: "INTRODUCED",
      priority: "NORMAL",
    },
    mode: "onChange",
  })

  const watchFile = form.watch("file")

  React.useEffect(() => {
    if (watchFile) {
      setSelectedFile(watchFile)
    }
  }, [watchFile])

  const nextStep = async () => {
    let fieldsToValidate: (keyof BillUploadInput)[] = []

    if (currentStep === 0) {
      fieldsToValidate = ["sessionId", "jurisdictionId", "billNumber", "title"]
    } else if (currentStep === 1) {
      fieldsToValidate = ["file"]
    }

    const isValid = await form.trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const onSubmit = async (data: BillUploadInput) => {
    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", data.file)
      formData.append("sessionId", data.sessionId)
      formData.append("jurisdictionId", data.jurisdictionId)
      formData.append("billNumber", data.billNumber)
      formData.append("title", data.title)
      formData.append("introducedDate", data.introducedDate || "")
      formData.append("summary", data.summary || "")
      formData.append("primarySponsor", data.primarySponsor || "")
      formData.append("sponsors", data.sponsors || "")
      formData.append("committees", data.committees || "")
      formData.append("topics", data.topics || "")
      formData.append("status", data.status)
      formData.append("priority", data.priority || "NORMAL")
      if (data.assignedTo) {
        formData.append("assignedTo", data.assignedTo)
      }
      if (data.categoryIds && data.categoryIds.length > 0) {
        formData.append("categoryIds", JSON.stringify(data.categoryIds))
      }
      if (data.relatedBillIds && data.relatedBillIds.length > 0) {
        formData.append("relatedBillIds", JSON.stringify(data.relatedBillIds))
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/api/bills/create", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create bill")
      }

      const result = await response.json()
      
      // Show success toast notification
      toast.success("Bill Created Successfully!", {
        description: `${result.bill.billNumber}: ${result.bill.title}`,
        action: {
          label: "View Bill",
          onClick: () => router.push(`/bills/${result.bill.id}`),
        },
        duration: 5000,
      })
      
      // Don't reset the form immediately - let user see what was submitted
      // They can manually reset or navigate away
      setIsSubmitting(false)
      setUploadProgress(0)
      
      // Optionally navigate to bills list after a short delay
      // Or let them stay on the form to review
    } catch (error) {
      console.error("Error creating bill:", error)
      toast.error("Failed to create bill", {
        description: error instanceof Error ? error.message : "Please try again.",
        duration: 5000,
      })
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add Bill to Session</h1>
        <p className="text-muted-foreground">
          Add a new bill to {session.name}. Follow the steps below to upload and process the bill.
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
              {/* Step 1: Basic Information */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium">Session</p>
                    <p className="text-sm text-muted-foreground">{session.name}</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="sessionId"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
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
                              <SelectItem key={jurisdiction.id} value={jurisdiction.id}>
                                {jurisdiction.name} ({jurisdiction.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the jurisdiction where this bill was introduced
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bill Number *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., AB 1234, SB 567, HR 1"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the official bill number or identifier
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bill Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the full title of the bill"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The official title of the bill
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="session"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 2023-2024"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="introducedDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Introduced Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Document Upload */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Bill Document *</FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="file-upload"
                              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {selectedFile ? (
                                  <>
                                    <FileText className="w-12 h-12 text-primary mb-4" />
                                    <p className="mb-2 text-sm font-semibold">
                                      {selectedFile.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                                    <p className="mb-2 text-sm text-muted-foreground">
                                      <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      PDF or DOCX (MAX. 10MB)
                                    </p>
                                  </>
                                )}
                              </div>
                              <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    onChange(file)
                                    setSelectedFile(file)
                                  }
                                }}
                                {...field}
                              />
                            </label>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload the official bill document (PDF or DOCX format)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Additional Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a brief summary of the bill..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief summary of what this bill does
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primarySponsor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Sponsor</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Assemblymember Jane Doe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sponsors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Sponsors</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Comma-separated list of sponsors"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Separate multiple sponsors with commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="committees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Committees</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Comma-separated list of committees"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Committees reviewing this bill
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="topics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topics/Keywords</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., privacy, healthcare, education"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Comma-separated keywords or topics related to this bill
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="LOW">Low</SelectItem>
                              <SelectItem value="NORMAL">Normal</SelectItem>
                              <SelectItem value="HIGH">High</SelectItem>
                              <SelectItem value="URGENT">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                    {users.length > 0 && (
                    <FormField
                      control={form.control}
                      name="assignedTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assign To</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value === "unassigned" ? undefined : value)}
                            value={field.value || "unassigned"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a staff member (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name || user.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Assign this bill to a staff member for review
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {categories.length > 0 && (
                    <FormField
                      control={form.control}
                      name="categoryIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categories</FormLabel>
                          <div className="space-y-2">
                            {categories.map((category) => (
                              <div key={category.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`category-${category.id}`}
                                  checked={field.value?.includes(category.id) || false}
                                  onChange={(e) => {
                                    const current = field.value || []
                                    if (e.target.checked) {
                                      field.onChange([...current, category.id])
                                    } else {
                                      field.onChange(current.filter((id) => id !== category.id))
                                    }
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <label
                                  htmlFor={`category-${category.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  style={category.color ? { color: category.color } : undefined}
                                >
                                  {category.name}
                                </label>
                              </div>
                            ))}
                          </div>
                          <FormDescription>
                            Select one or more categories for this bill
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}

              {/* Progress indicator during submission */}
              {isSubmitting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading and processing...</span>
                    <span className="text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {/* Navigation Buttons */}
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
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Bill...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Create Bill
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        form.reset()
                        setCurrentStep(0)
                        setSelectedFile(null)
                        setUploadProgress(0)
                      }}
                      disabled={isSubmitting}
                    >
                      Start Over
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

