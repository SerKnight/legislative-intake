import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex min-h-[400px] flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Bill Not Found</h1>
      <p className="mb-8 text-muted-foreground">
        The bill you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/bills">
        <Button>Back to Bills</Button>
      </Link>
    </div>
  )
}

