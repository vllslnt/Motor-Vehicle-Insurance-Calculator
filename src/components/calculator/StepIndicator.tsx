import React from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, label: "Data Kendaraan" },
  { id: 2, label: "Pertanggungan" },
  { id: 3, label: "Data Pemegang Polis" },
  { id: 4, label: "Kalkulasi Premi" },
  { id: 5, label: "Penerbitan" },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full py-4 md:py-6">
      <div className="flex items-start w-full">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center rounded-full border-2 transition-all duration-300",
                    "h-8 w-8 text-sm md:h-10 md:w-10 md:text-base",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-background border-primary text-primary ring-4 ring-primary/10"
                      : "bg-background border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    step.id
                  )}
                </div>

                <span
                  className={cn(
                    "mt-2 md:mt-3 text-center font-medium leading-tight transition-colors duration-300",
                    "w-14 text-[10px] sm:w-20 sm:text-[11px] md:w-28 md:text-xs",
                    "break-words",
                    isCompleted || isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector */}
              {index !== STEPS.length - 1 && (
                <div className="flex-1 mt-4 mx-2 sm:mx-3 md:mx-4 md:mt-5">
                  <div className="relative h-[3px] overflow-hidden rounded-full bg-border">
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-full bg-primary transition-all duration-300",
                        currentStep > step.id ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}