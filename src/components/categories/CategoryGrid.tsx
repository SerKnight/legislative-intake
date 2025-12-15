"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateCategoryDialog } from "./CreateCategoryDialog"
import { useState } from "react"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  order: number
  _count: {
    bills: number
  }
}

interface CategoryGridProps {
  sessionId: string
  categories: Category[]
  canManage: boolean
}

export function CategoryGrid({ sessionId, categories, canManage }: CategoryGridProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  if (categories.length === 0) {
    return (
      <Card className="py-12">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Categories help organize bills by topic. Create your first category to get started.
            Common categories include Healthcare, Education, Budget, and Public Safety.
          </p>
          {canManage && (
            <CreateCategoryDialog
              sessionId={sessionId}
              open={isCreateOpen}
              onOpenChange={setIsCreateOpen}
            >
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                Create First Category
              </Button>
            </CreateCategoryDialog>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="transition-shadow hover:shadow-lg"
            style={
              category.color
                ? {
                    borderColor: category.color + "40",
                  }
                : undefined
            }
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color || "#6b7280" }}
                    />
                    {category.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {category.description || "No description"}
                  </CardDescription>
                </div>
                {canManage && (
                  <div className="flex gap-1">
                    <CreateCategoryDialog
                      sessionId={sessionId}
                      category={category}
                      open={editingCategory?.id === category.id}
                      onOpenChange={(open) =>
                        setEditingCategory(open ? category : null)
                      }
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </CreateCategoryDialog>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{category._count.bills}</p>
                  <p className="text-xs text-muted-foreground">
                    bill{category._count.bills !== 1 ? "s" : ""}
                  </p>
                </div>
                <Link href={`/sessions/${sessionId}/categories/${category.id}`}>
                  <Button variant="outline" size="sm">
                    View Bills
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {canManage && (
        <div className="flex justify-center">
          <CreateCategoryDialog
            sessionId={sessionId}
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
          >
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Add Another Category
            </Button>
          </CreateCategoryDialog>
        </div>
      )}
    </div>
  )
}

