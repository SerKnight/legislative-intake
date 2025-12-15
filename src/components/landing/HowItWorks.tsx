"use client"

import { useState, useEffect, useCallback } from "react"
import { Steps } from "@/components/ui/steps"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    id: "1",
    label: "Upload or Track Bills",
    description: "Connect to legislative feeds or upload documents",
  },
  {
    id: "2",
    label: "AI Processes & Organizes",
    description: "Automatic summarization and classification",
  },
  {
    id: "3",
    label: "Get Instant Alerts",
    description: "Real-time notifications for changes",
  },
  {
    id: "4",
    label: "Take Action",
    description: "Access insights and make decisions",
  },
]

const stepDetails = [
  {
    title: "Upload or Track Bills",
    description:
      "Connect to real-time legislative feeds from state and federal sources, or upload bill documents directly. Our system automatically monitors for new bills, amendments, and status changes.",
    imageAlt:
      "Upload bill documents or connect to legislative feeds showing integration options",
  },
  {
    title: "AI Processes & Organizes",
    description:
      "Our AI reads through every bill, extracting key provisions, identifying topics, and creating structured summaries. Bills are automatically classified into 1,200+ categories and tagged for relevance.",
    imageAlt:
      "AI processing visualization showing bill text being analyzed and organized into structured data",
  },
  {
    title: "Get Instant Alerts",
    description:
      "Receive sub-minute alerts when bills matching your criteria are introduced, amended, or move through the legislative process. Never miss a critical update.",
    imageAlt:
      "Dashboard showing real-time notifications and alerts for bill changes and updates",
  },
  {
    title: "Take Action",
    description:
      "Access AI-generated summaries, search semantically, find similar bills across jurisdictions, and organize bills into projects. Everything you need to make informed decisions.",
    imageAlt:
      "Bill detail view showing AI summary, related bills, search results, and project management options",
  },
]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  const nextStep = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % steps.length)
  }, [])

  const handleStepClick = useCallback((index: number) => {
    setActiveStep(index)
  }, [])

  // Auto-advance every 7 seconds
  useEffect(() => {
    const interval = setInterval(nextStep, 7000)
    return () => clearInterval(interval)
  }, [nextStep])

  return (
    <section id="how-it-works" className="container py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          How It Works
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Get started in minutes, not months. Here's how we transform legislative tracking.
        </p>
      </div>

      <div className="mb-16">
        <Steps steps={steps} currentStep={activeStep} onStepClick={handleStepClick} />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeStep * 100}%)` }}
          >
            {stepDetails.map((step, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0"
              >
                <Card className="overflow-hidden cursor-pointer" onClick={nextStep}>
                  <div className="relative aspect-video bg-muted flex items-center justify-center">
                    <div className="text-center p-8">
                      <p className="text-sm text-muted-foreground mb-2">
                        Step {index + 1} Screenshot
                      </p>
                      <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                        {step.imageAlt}
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

