"use client";

import { Check } from "lucide-react";
import { cn } from "@hackhyre/ui/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={label} className="flex items-center">
            {/* Step dot */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300",
                  isCompleted &&
                    "bg-primary text-primary-foreground",
                  isCurrent &&
                    "border-primary bg-primary/10 text-primary border-2 shadow-[0_0_12px_oklch(0.82_0.22_155/0.3)]",
                  !isCompleted &&
                    !isCurrent &&
                    "border-border text-muted-foreground border-2"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "text-[0.65rem] font-medium transition-colors",
                  isCurrent
                    ? "text-foreground"
                    : "text-muted-foreground",
                  "hidden sm:block"
                )}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-8 transition-colors duration-300 sm:w-12",
                  index < currentStep ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
