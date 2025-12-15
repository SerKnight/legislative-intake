"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  id: string
  label: string
  description?: string
}

interface StepsProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
  className?: string
}

export function Steps({ steps, currentStep, onStepClick, className }: StepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                className="flex flex-col items-center flex-1 cursor-pointer group"
              >
                <div className="flex flex-col items-center flex-1 w-full">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                      "group-hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      isCompleted &&
                        "bg-primary border-primary text-primary-foreground",
                      isCurrent &&
                        "bg-primary border-primary text-primary-foreground",
                      isUpcoming &&
                        "bg-background border-muted-foreground/30 text-muted-foreground group-hover:border-muted-foreground/50"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-center w-full">
                    <div
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isCurrent && "text-foreground",
                        !isCurrent && "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {step.label}
                    </div>
                    {step.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-4 transition-colors",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

