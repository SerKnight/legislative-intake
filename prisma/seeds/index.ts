import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Seed Jurisdictions
  const jurisdictions = [
    {
      name: "California",
      type: "STATE" as const,
      code: "CA",
      website: "https://leginfo.legislature.ca.gov",
    },
    {
      name: "New York",
      type: "STATE" as const,
      code: "NY",
      website: "https://www.nysenate.gov",
    },
    {
      name: "Federal",
      type: "FEDERAL" as const,
      code: "US",
      website: "https://www.congress.gov",
    },
  ]

  for (const jurisdiction of jurisdictions) {
    await prisma.jurisdiction.upsert({
      where: { code: jurisdiction.code },
      update: {},
      create: jurisdiction,
    })
  }

  console.log("✓ Jurisdictions seeded")

  // Get jurisdiction IDs
  const caJurisdiction = await prisma.jurisdiction.findUnique({
    where: { code: "CA" },
  })
  const usJurisdiction = await prisma.jurisdiction.findUnique({
    where: { code: "US" },
  })

  if (!caJurisdiction || !usJurisdiction) {
    throw new Error("Jurisdictions not found")
  }

  // Seed Sample Bills
  const sampleBills = [
    {
      billNumber: "AB 1234",
      title: "California Consumer Privacy Act Amendments",
      summary:
        "Amends the California Consumer Privacy Act to strengthen data protection requirements and expand consumer rights regarding personal information collection and use.",
      status: "IN_COMMITTEE" as const,
      jurisdictionId: caJurisdiction.id,
      introducedDate: new Date("2024-01-15"),
      primarySponsor: "Assemblymember Jane Doe",
      sponsors: ["Assemblymember Jane Doe", "Senator John Smith"],
      committees: ["Privacy and Consumer Protection"],
      topics: ["privacy", "data protection", "consumer rights"],
      documentUrl: "https://example.com/bills/CA/AB-1234.pdf",
    },
    {
      billNumber: "SB 567",
      title: "Artificial Intelligence Transparency Act",
      summary:
        "Requires AI systems to disclose when content is AI-generated and establishes transparency requirements for automated decision-making systems.",
      status: "PASSED_COMMITTEE" as const,
      jurisdictionId: caJurisdiction.id,
      introducedDate: new Date("2024-02-01"),
      primarySponsor: "Senator John Smith",
      sponsors: ["Senator John Smith"],
      committees: ["Technology and Innovation"],
      topics: ["AI", "transparency", "technology"],
    },
    {
      billNumber: "HR 1",
      title: "Federal Data Privacy Protection Act",
      summary:
        "Establishes comprehensive federal data privacy framework to protect consumer data and harmonize state privacy laws across the United States.",
      status: "INTRODUCED" as const,
      jurisdictionId: usJurisdiction.id,
      introducedDate: new Date("2024-01-10"),
      primarySponsor: "Rep. Jane Representative",
      sponsors: ["Rep. Jane Representative"],
      committees: ["House Committee on Energy and Commerce"],
      topics: ["privacy", "federal", "data protection"],
    },
  ]

  for (const bill of sampleBills) {
    const existing = await prisma.bill.findFirst({
      where: {
        billNumber: bill.billNumber,
        jurisdictionId: bill.jurisdictionId,
      },
    })

    if (!existing) {
      await prisma.bill.create({
        data: bill,
      })
    }
  }

  console.log("✓ Sample bills seeded")
  console.log("Database seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

