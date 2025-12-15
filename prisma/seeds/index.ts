import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// All 50 US States
const US_STATES = [
  { name: "Alabama", code: "AL" },
  { name: "Alaska", code: "AK" },
  { name: "Arizona", code: "AZ" },
  { name: "Arkansas", code: "AR" },
  { name: "California", code: "CA" },
  { name: "Colorado", code: "CO" },
  { name: "Connecticut", code: "CT" },
  { name: "Delaware", code: "DE" },
  { name: "Florida", code: "FL" },
  { name: "Georgia", code: "GA" },
  { name: "Hawaii", code: "HI" },
  { name: "Idaho", code: "ID" },
  { name: "Illinois", code: "IL" },
  { name: "Indiana", code: "IN" },
  { name: "Iowa", code: "IA" },
  { name: "Kansas", code: "KS" },
  { name: "Kentucky", code: "KY" },
  { name: "Louisiana", code: "LA" },
  { name: "Maine", code: "ME" },
  { name: "Maryland", code: "MD" },
  { name: "Massachusetts", code: "MA" },
  { name: "Michigan", code: "MI" },
  { name: "Minnesota", code: "MN" },
  { name: "Mississippi", code: "MS" },
  { name: "Missouri", code: "MO" },
  { name: "Montana", code: "MT" },
  { name: "Nebraska", code: "NE" },
  { name: "Nevada", code: "NV" },
  { name: "New Hampshire", code: "NH" },
  { name: "New Jersey", code: "NJ" },
  { name: "New Mexico", code: "NM" },
  { name: "New York", code: "NY" },
  { name: "North Carolina", code: "NC" },
  { name: "North Dakota", code: "ND" },
  { name: "Ohio", code: "OH" },
  { name: "Oklahoma", code: "OK" },
  { name: "Oregon", code: "OR" },
  { name: "Pennsylvania", code: "PA" },
  { name: "Rhode Island", code: "RI" },
  { name: "South Carolina", code: "SC" },
  { name: "South Dakota", code: "SD" },
  { name: "Tennessee", code: "TN" },
  { name: "Texas", code: "TX" },
  { name: "Utah", code: "UT" },
  { name: "Vermont", code: "VT" },
  { name: "Virginia", code: "VA" },
  { name: "Washington", code: "WA" },
  { name: "West Virginia", code: "WV" },
  { name: "Wisconsin", code: "WI" },
  { name: "Wyoming", code: "WY" },
]

async function main() {
  console.log("Seeding database...")

  // Seed all 50 states
  console.log("Seeding jurisdictions...")
  for (const state of US_STATES) {
    await prisma.jurisdiction.upsert({
      where: { code: state.code },
      update: {},
      create: {
        name: state.name,
        type: "STATE",
        code: state.code,
        website: `https://www.${state.code.toLowerCase()}.gov/legislature`,
      },
    })
  }

  // Seed Federal jurisdiction
  await prisma.jurisdiction.upsert({
    where: { code: "US" },
    update: {},
    create: {
      name: "Federal",
      type: "FEDERAL",
      code: "US",
      website: "https://www.congress.gov",
    },
  })

  console.log("✓ Jurisdictions seeded")

  // Get some key jurisdictions for sessions
  const caJurisdiction = await prisma.jurisdiction.findUnique({
    where: { code: "CA" },
  })
  const nyJurisdiction = await prisma.jurisdiction.findUnique({
    where: { code: "NY" },
  })
  const txJurisdiction = await prisma.jurisdiction.findUnique({
    where: { code: "TX" },
  })
  const flJurisdiction = await prisma.jurisdiction.findUnique({
    where: { code: "FL" },
  })
  const coJurisdiction = await prisma.jurisdiction.findUnique({
    where: { code: "CO" },
  })
  const usJurisdiction = await prisma.jurisdiction.findUnique({
    where: { code: "US" },
  })

  if (!caJurisdiction || !nyJurisdiction || !txJurisdiction || !flJurisdiction || !coJurisdiction || !usJurisdiction) {
    throw new Error("Key jurisdictions not found")
  }

  // Create realistic sessions for 2024 and 2025
  console.log("Creating legislative sessions...")

  // California Sessions
  const ca2024Session = await prisma.legislativeSession.upsert({
    where: { identifier: "CA-2024" },
    update: {},
    create: {
      name: "2023-2024 Regular Session",
      identifier: "CA-2024",
      jurisdictionId: caJurisdiction.id,
      startDate: new Date("2023-12-04"),
      endDate: new Date("2024-11-30"),
      status: "CLOSED",
      description: "California 2023-2024 Regular Legislative Session",
    },
  })

  const ca2025Session = await prisma.legislativeSession.upsert({
    where: { identifier: "CA-2025" },
    update: {},
    create: {
      name: "2025-2026 Regular Session",
      identifier: "CA-2025",
      jurisdictionId: caJurisdiction.id,
      startDate: new Date("2024-12-02"),
      endDate: new Date("2025-11-30"),
      status: "ACTIVE",
      description: "California 2025-2026 Regular Legislative Session",
    },
  })

  // New York Sessions
  const ny2024Session = await prisma.legislativeSession.upsert({
    where: { identifier: "NY-2024" },
    update: {},
    create: {
      name: "2024 Legislative Session",
      identifier: "NY-2024",
      jurisdictionId: nyJurisdiction.id,
      startDate: new Date("2024-01-03"),
      endDate: new Date("2024-06-06"),
      status: "CLOSED",
      description: "New York 2024 Regular Legislative Session",
    },
  })

  const ny2025Session = await prisma.legislativeSession.upsert({
    where: { identifier: "NY-2025" },
    update: {},
    create: {
      name: "2025 Legislative Session",
      identifier: "NY-2025",
      jurisdictionId: nyJurisdiction.id,
      startDate: new Date("2025-01-08"),
      endDate: new Date("2025-06-05"),
      status: "ACTIVE",
      description: "New York 2025 Regular Legislative Session",
    },
  })

  // Texas Sessions (biennial)
  const tx2024Session = await prisma.legislativeSession.upsert({
    where: { identifier: "TX-2024" },
    update: {},
    create: {
      name: "88th Legislature, 4th Called Session",
      identifier: "TX-2024",
      jurisdictionId: txJurisdiction.id,
      startDate: new Date("2024-11-12"),
      endDate: new Date("2024-12-09"),
      status: "CLOSED",
      description: "Texas 88th Legislature, 4th Called Session 2024",
    },
  })

  const tx2025Session = await prisma.legislativeSession.upsert({
    where: { identifier: "TX-2025" },
    update: {},
    create: {
      name: "89th Legislature, Regular Session",
      identifier: "TX-2025",
      jurisdictionId: txJurisdiction.id,
      startDate: new Date("2025-01-14"),
      endDate: new Date("2025-05-31"),
      status: "ACTIVE",
      description: "Texas 89th Legislature, Regular Session 2025",
    },
  })

  // Florida Sessions
  const fl2024Session = await prisma.legislativeSession.upsert({
    where: { identifier: "FL-2024" },
    update: {},
    create: {
      name: "2024 Regular Session",
      identifier: "FL-2024",
      jurisdictionId: flJurisdiction.id,
      startDate: new Date("2024-01-09"),
      endDate: new Date("2024-03-08"),
      status: "CLOSED",
      description: "Florida 2024 Regular Legislative Session",
    },
  })

  const fl2025Session = await prisma.legislativeSession.upsert({
    where: { identifier: "FL-2025" },
    update: {},
    create: {
      name: "2025 Regular Session",
      identifier: "FL-2025",
      jurisdictionId: flJurisdiction.id,
      startDate: new Date("2025-01-14"),
      endDate: new Date("2025-03-07"),
      status: "ACTIVE",
      description: "Florida 2025 Regular Legislative Session",
    },
  })

  // Federal Sessions (Congress)
  const us2024Session = await prisma.legislativeSession.upsert({
    where: { identifier: "US-2024" },
    update: {},
    create: {
      name: "118th Congress, 2nd Session",
      identifier: "US-2024",
      jurisdictionId: usJurisdiction.id,
      startDate: new Date("2024-01-03"),
      endDate: new Date("2024-12-31"),
      status: "CLOSED",
      description: "118th United States Congress, 2nd Session (2024)",
    },
  })

  const us2025Session = await prisma.legislativeSession.upsert({
    where: { identifier: "US-2025" },
    update: {},
    create: {
      name: "119th Congress, 1st Session",
      identifier: "US-2025",
      jurisdictionId: usJurisdiction.id,
      startDate: new Date("2025-01-03"),
      endDate: new Date("2025-12-31"),
      status: "ACTIVE",
      description: "119th United States Congress, 1st Session (2025)",
    },
  })

  // Colorado Sessions (runs January to May)
  const co2024Session = await prisma.legislativeSession.upsert({
    where: { identifier: "CO-2024" },
    update: {},
    create: {
      name: "74th General Assembly, First Regular Session",
      identifier: "CO-2024",
      jurisdictionId: coJurisdiction.id,
      startDate: new Date("2024-01-10"),
      endDate: new Date("2024-05-08"),
      status: "CLOSED",
      description: "Colorado 74th General Assembly, First Regular Session 2024",
    },
  })

  const co2025Session = await prisma.legislativeSession.upsert({
    where: { identifier: "CO-2025" },
    update: {},
    create: {
      name: "75th General Assembly, First Regular Session",
      identifier: "CO-2025",
      jurisdictionId: coJurisdiction.id,
      startDate: new Date("2025-01-08"),
      endDate: new Date("2025-05-07"),
      status: "ACTIVE",
      description: "Colorado 75th General Assembly, First Regular Session 2025",
    },
  })

  console.log("✓ Legislative sessions created")

  // Create default categories for active sessions
  const defaultCategories = [
    { name: "Healthcare", slug: "healthcare", color: "#ef4444", order: 1 },
    { name: "Education", slug: "education", color: "#3b82f6", order: 2 },
    { name: "Budget & Finance", slug: "budget-finance", color: "#10b981", order: 3 },
    { name: "Public Safety", slug: "public-safety", color: "#f59e0b", order: 4 },
    { name: "Environment", slug: "environment", color: "#22c55e", order: 5 },
    { name: "Technology", slug: "technology", color: "#8b5cf6", order: 6 },
    { name: "Housing", slug: "housing", color: "#ec4899", order: 7 },
    { name: "Transportation", slug: "transportation", color: "#06b6d4", order: 8 },
  ]

  // Colorado-specific categories
  const coloradoCategories = [
    { name: "Water & Natural Resources", slug: "water-natural-resources", color: "#0ea5e9", order: 1 },
    { name: "Energy & Environment", slug: "energy-environment", color: "#22c55e", order: 2 },
    { name: "Recreation & Tourism", slug: "recreation-tourism", color: "#f59e0b", order: 3 },
    { name: "Housing Affordability", slug: "housing-affordability", color: "#ec4899", order: 4 },
    { name: "Transportation", slug: "transportation", color: "#06b6d4", order: 5 },
    { name: "Education", slug: "education", color: "#3b82f6", order: 6 },
    { name: "Healthcare", slug: "healthcare", color: "#ef4444", order: 7 },
    { name: "Public Safety", slug: "public-safety", color: "#8b5cf6", order: 8 },
    { name: "Cannabis Regulation", slug: "cannabis-regulation", color: "#10b981", order: 9 },
    { name: "Budget & Finance", slug: "budget-finance", color: "#6366f1", order: 10 },
  ]

  const activeSessions = [
    ca2025Session,
    ny2025Session,
    tx2025Session,
    fl2025Session,
    co2025Session,
    us2025Session,
  ]

  // Add Colorado-specific categories
  for (const category of coloradoCategories) {
    await prisma.sessionCategory.upsert({
      where: {
        sessionId_slug: {
          sessionId: co2025Session.id,
          slug: category.slug,
        },
      },
      update: {},
      create: {
        sessionId: co2025Session.id,
        name: category.name,
        slug: category.slug,
        color: category.color,
        order: category.order,
      },
    })
  }

  for (const session of activeSessions) {
    for (const category of defaultCategories) {
      await prisma.sessionCategory.upsert({
        where: {
          sessionId_slug: {
            sessionId: session.id,
            slug: category.slug,
          },
        },
        update: {},
        create: {
          sessionId: session.id,
          name: category.name,
          slug: category.slug,
          color: category.color,
          order: category.order,
        },
      })
    }
  }

  console.log("✓ Default categories created for active sessions")

  // Create sample bills for active sessions
  console.log("Creating sample bills...")

  const sampleBills = [
    // Colorado Bills
    {
      billNumber: "HB 24-1001",
      title: "Colorado River Water Conservation and Management Act",
      summary:
        "Establishes comprehensive water conservation measures for Colorado River usage, including mandatory water efficiency standards for agricultural and municipal users, and creates a state water conservation fund.",
      status: "IN_COMMITTEE" as const,
      sessionId: co2025Session.id,
      jurisdictionId: coJurisdiction.id,
      introducedDate: new Date("2025-01-15"),
      primarySponsor: "Rep. Sarah Martinez",
      sponsors: ["Rep. Sarah Martinez", "Rep. James Wilson", "Sen. Maria Garcia"],
      committees: ["Agriculture, Water & Natural Resources"],
      topics: ["water rights", "conservation", "Colorado River", "agriculture"],
      priority: "URGENT" as const,
      fiscalNote: "Estimated cost: $15M over 5 years for conservation incentives and infrastructure",
      costAnalysis: "Costs include $10M for agricultural efficiency grants, $3M for municipal water system upgrades, and $2M for administrative oversight.",
    },
    {
      billNumber: "SB 24-1002",
      title: "Renewable Energy Standard Enhancement Act",
      summary:
        "Increases Colorado's renewable energy standard to 100% by 2040, accelerates closure of coal-fired power plants, and provides transition assistance for affected communities and workers.",
      status: "PASSED_COMMITTEE" as const,
      sessionId: co2025Session.id,
      jurisdictionId: coJurisdiction.id,
      introducedDate: new Date("2025-01-20"),
      primarySponsor: "Sen. David Chen",
      sponsors: ["Sen. David Chen", "Rep. Lisa Anderson"],
      committees: ["Transportation & Energy"],
      topics: ["renewable energy", "climate", "coal transition", "clean energy"],
      priority: "HIGH" as const,
      fiscalNote: "Estimated cost: $50M for transition assistance programs",
    },
    {
      billNumber: "HB 24-1003",
      title: "Affordable Housing Development Incentive Program",
      summary:
        "Creates tax incentives and streamlined permitting for affordable housing development, establishes a state affordable housing trust fund, and requires inclusionary zoning in high-cost areas.",
      status: "IN_COMMITTEE" as const,
      sessionId: co2025Session.id,
      jurisdictionId: coJurisdiction.id,
      introducedDate: new Date("2025-01-25"),
      primarySponsor: "Rep. Michael Thompson",
      sponsors: ["Rep. Michael Thompson", "Sen. Jennifer Lee"],
      committees: ["Local Government & Housing"],
      topics: ["affordable housing", "zoning", "development", "housing crisis"],
      priority: "HIGH" as const,
      fiscalNote: "Estimated cost: $200M over 10 years in tax credits and trust fund contributions",
    },
    {
      billNumber: "SB 24-1004",
      title: "Outdoor Recreation Industry Support Act",
      summary:
        "Establishes state support programs for outdoor recreation businesses, creates outdoor recreation infrastructure grants, and designates new state recreation areas to boost tourism and local economies.",
      status: "INTRODUCED" as const,
      sessionId: co2025Session.id,
      jurisdictionId: coJurisdiction.id,
      introducedDate: new Date("2025-02-01"),
      primarySponsor: "Sen. Robert Taylor",
      sponsors: ["Sen. Robert Taylor", "Rep. Amanda Rodriguez"],
      committees: ["Business, Labor & Technology"],
      topics: ["outdoor recreation", "tourism", "economic development", "public lands"],
      priority: "NORMAL" as const,
    },
    {
      billNumber: "HB 24-1005",
      title: "Cannabis Industry Tax Revenue Allocation Act",
      summary:
        "Reallocates cannabis tax revenue to fund education, public health programs, and substance abuse treatment, with specific allocations for rural communities disproportionately affected by substance use.",
      status: "IN_COMMITTEE" as const,
      sessionId: co2025Session.id,
      jurisdictionId: coJurisdiction.id,
      introducedDate: new Date("2025-02-05"),
      primarySponsor: "Rep. Patricia Johnson",
      sponsors: ["Rep. Patricia Johnson", "Sen. Christopher Brown"],
      committees: ["Finance"],
      topics: ["cannabis", "tax revenue", "education funding", "public health"],
      priority: "NORMAL" as const,
    },
    {
      billNumber: "SB 24-1006",
      title: "Wildfire Prevention and Mitigation Fund",
      summary:
        "Creates dedicated state fund for wildfire prevention, forest management, and community resilience programs. Establishes mandatory defensible space requirements and funds community evacuation planning.",
      status: "PASSED_COMMITTEE" as const,
      sessionId: co2025Session.id,
      jurisdictionId: coJurisdiction.id,
      introducedDate: new Date("2025-02-10"),
      primarySponsor: "Sen. Linda Martinez",
      sponsors: ["Sen. Linda Martinez", "Rep. Daniel Kim"],
      committees: ["Agriculture, Water & Natural Resources"],
      topics: ["wildfire", "forest management", "disaster preparedness", "climate resilience"],
      priority: "URGENT" as const,
      fiscalNote: "Estimated cost: $100M annually for prevention and mitigation programs",
    },
    {
      billNumber: "HB 24-1007",
      title: "Public School Funding Formula Modernization",
      summary:
        "Updates Colorado's school funding formula to account for cost of living variations, student needs, and rural school challenges. Increases base per-pupil funding and provides additional support for at-risk students.",
      status: "IN_COMMITTEE" as const,
      sessionId: co2025Session.id,
      jurisdictionId: coJurisdiction.id,
      introducedDate: new Date("2025-02-15"),
      primarySponsor: "Rep. Elizabeth White",
      sponsors: ["Rep. Elizabeth White", "Sen. Mark Davis"],
      committees: ["Education"],
      topics: ["education funding", "school finance", "rural schools", "equity"],
      priority: "HIGH" as const,
      fiscalNote: "Estimated cost: $500M annually in additional education funding",
    },
    {
      billNumber: "SB 24-1008",
      title: "Electric Vehicle Infrastructure Expansion Act",
      summary:
        "Requires installation of EV charging stations at state facilities, provides grants for private charging infrastructure, and establishes EV adoption goals for state vehicle fleets.",
      status: "INTRODUCED" as const,
      sessionId: co2025Session.id,
      jurisdictionId: coJurisdiction.id,
      introducedDate: new Date("2025-02-20"),
      primarySponsor: "Sen. Kevin Park",
      sponsors: ["Sen. Kevin Park", "Rep. Nicole Adams"],
      committees: ["Transportation & Energy"],
      topics: ["electric vehicles", "infrastructure", "transportation", "clean energy"],
      priority: "NORMAL" as const,
    },
    {
      billNumber: "HB 24-1009",
      title: "Mental Health Services Expansion for Rural Communities",
      summary:
        "Expands telehealth mental health services, provides loan forgiveness for mental health professionals working in rural areas, and creates mobile mental health units for underserved communities.",
      status: "IN_COMMITTEE" as const,
      sessionId: co2025Session.id,
      jurisdictionId: coJurisdiction.id,
      introducedDate: new Date("2025-02-25"),
      primarySponsor: "Rep. Thomas Wright",
      sponsors: ["Rep. Thomas Wright", "Sen. Rachel Green"],
      committees: ["Health & Human Services"],
      topics: ["mental health", "rural healthcare", "telehealth", "healthcare access"],
      priority: "HIGH" as const,
      fiscalNote: "Estimated cost: $75M over 5 years for program expansion and incentives",
    },
    {
      billNumber: "SB 24-1010",
      title: "Mountain Pass Transportation Safety Improvement Act",
      summary:
        "Funds improvements to mountain pass infrastructure, including avalanche mitigation, winter road maintenance, and emergency response capabilities. Addresses safety concerns on I-70 and other critical mountain routes.",
      status: "ON_FLOOR" as const,
      sessionId: co2025Session.id,
      jurisdictionId: coJurisdiction.id,
      introducedDate: new Date("2025-03-01"),
      primarySponsor: "Sen. William Jackson",
      sponsors: ["Sen. William Jackson", "Rep. Michelle Clark"],
      committees: ["Transportation & Energy"],
      topics: ["transportation", "infrastructure", "safety", "mountain passes", "I-70"],
      priority: "URGENT" as const,
      fiscalNote: "Estimated cost: $250M for infrastructure improvements over 10 years",
    },
    {
      billNumber: "HB 24-1011",
      title: "Agricultural Land Preservation and Conservation Easement Enhancement",
      summary:
        "Expands conservation easement programs to protect agricultural land from development, provides tax incentives for farmers maintaining agricultural use, and creates agricultural land trust fund.",
      status: "INTRODUCED" as const,
      sessionId: co2025Session.id,
      jurisdictionId: coJurisdiction.id,
      introducedDate: new Date("2025-03-05"),
      primarySponsor: "Rep. Steven Miller",
      sponsors: ["Rep. Steven Miller", "Sen. Karen Lewis"],
      committees: ["Agriculture, Water & Natural Resources"],
      topics: ["agriculture", "land conservation", "farmland preservation", "rural development"],
      priority: "NORMAL" as const,
    },
    {
      billNumber: "SB 24-1012",
      title: "State Employee Remote Work Policy Standardization",
      summary:
        "Establishes standardized remote work policies for state employees, requires state agencies to develop remote work plans, and provides funding for remote work infrastructure and training.",
      status: "IN_COMMITTEE" as const,
      sessionId: co2025Session.id,
      jurisdictionId: coJurisdiction.id,
      introducedDate: new Date("2025-03-10"),
      primarySponsor: "Sen. Brian Harris",
      sponsors: ["Sen. Brian Harris", "Rep. Stephanie Moore"],
      committees: ["State, Veterans & Military Affairs"],
      topics: ["remote work", "state employees", "workplace policy", "technology"],
      priority: "LOW" as const,
    },
    // Existing bills from other states
    {
      billNumber: "AB 1234",
      title: "California Consumer Privacy Act Amendments",
      summary:
        "Amends the California Consumer Privacy Act to strengthen data protection requirements and expand consumer rights regarding personal information collection and use.",
      status: "IN_COMMITTEE" as const,
      sessionId: ca2025Session.id,
      jurisdictionId: caJurisdiction.id,
      introducedDate: new Date("2025-01-15"),
      primarySponsor: "Assemblymember Jane Doe",
      sponsors: ["Assemblymember Jane Doe", "Senator John Smith"],
      committees: ["Privacy and Consumer Protection"],
      topics: ["privacy", "data protection", "consumer rights"],
      priority: "HIGH" as const,
    },
    {
      billNumber: "SB 567",
      title: "Artificial Intelligence Transparency Act",
      summary:
        "Requires AI systems to disclose when content is AI-generated and establishes transparency requirements for automated decision-making systems.",
      status: "PASSED_COMMITTEE" as const,
      sessionId: ca2025Session.id,
      jurisdictionId: caJurisdiction.id,
      introducedDate: new Date("2025-02-01"),
      primarySponsor: "Senator John Smith",
      sponsors: ["Senator John Smith"],
      committees: ["Technology and Innovation"],
      topics: ["AI", "transparency", "technology"],
      priority: "NORMAL" as const,
    },
    {
      billNumber: "A 1234",
      title: "New York Data Privacy Protection Act",
      summary:
        "Establishes comprehensive data privacy framework for New York residents, requiring businesses to disclose data collection practices and provide opt-out mechanisms.",
      status: "INTRODUCED" as const,
      sessionId: ny2025Session.id,
      jurisdictionId: nyJurisdiction.id,
      introducedDate: new Date("2025-01-10"),
      primarySponsor: "Assemblymember Jane Representative",
      sponsors: ["Assemblymember Jane Representative"],
      committees: ["Consumer Affairs and Protection"],
      topics: ["privacy", "data protection"],
      priority: "HIGH" as const,
    },
    {
      billNumber: "HB 1234",
      title: "Texas Energy Grid Modernization Act",
      summary:
        "Provides funding and regulatory framework for modernization of the Texas electrical grid to improve reliability and resilience.",
      status: "IN_COMMITTEE" as const,
      sessionId: tx2025Session.id,
      jurisdictionId: txJurisdiction.id,
      introducedDate: new Date("2025-01-20"),
      primarySponsor: "Representative John Smith",
      sponsors: ["Representative John Smith"],
      committees: ["State Affairs"],
      topics: ["energy", "infrastructure", "grid"],
      priority: "URGENT" as const,
    },
    {
      billNumber: "HR 1",
      title: "Federal Data Privacy Protection Act",
      summary:
        "Establishes comprehensive federal data privacy framework to protect consumer data and harmonize state privacy laws across the United States.",
      status: "INTRODUCED" as const,
      sessionId: us2025Session.id,
      jurisdictionId: usJurisdiction.id,
      introducedDate: new Date("2025-01-10"),
      primarySponsor: "Rep. Jane Representative",
      sponsors: ["Rep. Jane Representative"],
      committees: ["House Committee on Energy and Commerce"],
      topics: ["privacy", "federal", "data protection"],
      priority: "HIGH" as const,
    },
  ]

  // Assign Colorado bills to categories
  console.log("Assigning Colorado bills to categories...")
  
  const coWaterCategory = await prisma.sessionCategory.findFirst({
    where: { sessionId: co2025Session.id, slug: "water-natural-resources" },
  })
  const coEnergyCategory = await prisma.sessionCategory.findFirst({
    where: { sessionId: co2025Session.id, slug: "energy-environment" },
  })
  const coHousingCategory = await prisma.sessionCategory.findFirst({
    where: { sessionId: co2025Session.id, slug: "housing-affordability" },
  })
  const coRecreationCategory = await prisma.sessionCategory.findFirst({
    where: { sessionId: co2025Session.id, slug: "recreation-tourism" },
  })
  const coCannabisCategory = await prisma.sessionCategory.findFirst({
    where: { sessionId: co2025Session.id, slug: "cannabis-regulation" },
  })
  const coEducationCategory = await prisma.sessionCategory.findFirst({
    where: { sessionId: co2025Session.id, slug: "education" },
  })
  const coTransportationCategory = await prisma.sessionCategory.findFirst({
    where: { sessionId: co2025Session.id, slug: "transportation" },
  })
  const coHealthcareCategory = await prisma.sessionCategory.findFirst({
    where: { sessionId: co2025Session.id, slug: "healthcare" },
  })

  // Create bills and assign to categories
  for (const bill of sampleBills) {
    if (bill.sessionId === co2025Session.id) {
      const existing = await prisma.bill.findFirst({
        where: {
          billNumber: bill.billNumber,
          sessionId: bill.sessionId,
        },
      })

      if (!existing) {
        const createdBill = await prisma.bill.create({
          data: bill,
        })

        // Assign to appropriate categories
        let categoryId: string | null = null
        
        if (bill.billNumber === "HB 24-1001" && coWaterCategory) {
          categoryId = coWaterCategory.id
        } else if (bill.billNumber === "SB 24-1002" && coEnergyCategory) {
          categoryId = coEnergyCategory.id
        } else if (bill.billNumber === "HB 24-1003" && coHousingCategory) {
          categoryId = coHousingCategory.id
        } else if (bill.billNumber === "SB 24-1004" && coRecreationCategory) {
          categoryId = coRecreationCategory.id
        } else if (bill.billNumber === "HB 24-1005" && coCannabisCategory) {
          categoryId = coCannabisCategory.id
        } else if (bill.billNumber === "SB 24-1006" && coEnergyCategory) {
          categoryId = coEnergyCategory.id
        } else if (bill.billNumber === "HB 24-1007" && coEducationCategory) {
          categoryId = coEducationCategory.id
        } else if (bill.billNumber === "SB 24-1008" && coTransportationCategory) {
          categoryId = coTransportationCategory.id
        } else if (bill.billNumber === "HB 24-1009" && coHealthcareCategory) {
          categoryId = coHealthcareCategory.id
        } else if (bill.billNumber === "SB 24-1010" && coTransportationCategory) {
          categoryId = coTransportationCategory.id
        } else if (bill.billNumber === "HB 24-1011" && coWaterCategory) {
          categoryId = coWaterCategory.id
        }

        if (categoryId) {
          await prisma.billCategory.create({
            data: {
              billId: createdBill.id,
              categoryId: categoryId,
            },
          })
        }

        // Some bills belong to multiple categories
        if (bill.billNumber === "SB 24-1006" && coWaterCategory) {
          await prisma.billCategory.create({
            data: {
              billId: createdBill.id,
              categoryId: coWaterCategory.id,
            },
          }).catch(() => {}) // Ignore if already exists
        }
      }
    } else {
      // Handle other states' bills (existing logic)
      const existing = await prisma.bill.findFirst({
        where: {
          billNumber: bill.billNumber,
          sessionId: bill.sessionId,
        },
      })

      if (!existing) {
        await prisma.bill.create({
          data: bill,
        })
      }
    }
  }

  console.log("✓ Sample bills created")

  // Assign California bills to categories (existing logic)
  const healthcareCategory = await prisma.sessionCategory.findFirst({
    where: {
      sessionId: ca2025Session.id,
      slug: "healthcare",
    },
  })

  const techCategory = await prisma.sessionCategory.findFirst({
    where: {
      sessionId: ca2025Session.id,
      slug: "technology",
    },
  })

  if (healthcareCategory && techCategory) {
    const aiBill = await prisma.bill.findFirst({
      where: {
        billNumber: "SB 567",
        sessionId: ca2025Session.id,
      },
    })

    if (aiBill) {
      await prisma.billCategory.upsert({
        where: {
          billId_categoryId: {
            billId: aiBill.id,
            categoryId: techCategory.id,
          },
        },
        update: {},
        create: {
          billId: aiBill.id,
          categoryId: techCategory.id,
        },
      })
    }
  }

  console.log("✓ Bill categories assigned")

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
