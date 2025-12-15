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
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code").optional(),
  order: z.number().int().default(0),
})

type CategoryInput = z.infer<typeof categorySchema>

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  order: number
}

interface CreateCategoryDialogProps {
  sessionId: string
  category?: Category
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateCategoryDialog({
  sessionId,
  category,
  children,
  open: controlledOpen,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      color: category?.color || "#3b82f6",
      order: category?.order || 0,
    },
  })

  // Auto-generate slug from name
  const watchName = form.watch("name")
  useEffect(() => {
    if (!category && watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      form.setValue("slug", slug)
    }
  }, [watchName, category, form])

  const onSubmit = async (data: CategoryInput) => {
    setIsSubmitting(true)

    try {
      const url = category
        ? `/api/sessions/${sessionId}/categories/${category.id}`
        : `/api/sessions/${sessionId}/categories`
      const method = category ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save category")
      }

      setIsOpen(false)
      form.reset()
      router.refresh()
    } catch (error) {
      console.error("Error saving category:", error)
      alert(error instanceof Error ? error.message : "Failed to save category")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Create Category"}</DialogTitle>
          <DialogDescription>
            {category
              ? "Update the category details below."
              : "Categories help organize bills by topic. Create a category with a name, optional description, and color for visual identification."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Healthcare, Education" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear, descriptive name for this category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., healthcare, education"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    URL-friendly identifier (lowercase, hyphens only)
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
                      placeholder="Optional description of what bills belong in this category..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input type="color" {...field} className="w-20 h-10" />
                    </FormControl>
                    <Input
                      type="text"
                      placeholder="#3b82f6"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <FormDescription>
                    Color used to identify this category throughout the interface
                  </FormDescription>
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
                ) : category ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

