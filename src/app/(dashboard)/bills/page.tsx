import { prisma } from "@/lib/db"
import { BillList } from "@/components/bills/BillList"
import { BillSearch } from "@/components/bills/BillSearch"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Upload } from "lucide-react"

export default async function BillsPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const searchQuery = searchParams?.search || ""

  const bills = await prisma.bill.findMany({
    where: searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { billNumber: { contains: searchQuery, mode: "insensitive" } },
            { summary: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      jurisdiction: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bills</h1>
        <Link href="/bills/upload">
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload New Bill
          </Button>
        </Link>
      </div>
      <BillSearch initialQuery={searchQuery} />
      <BillList bills={bills} />
    </div>
  )
}

