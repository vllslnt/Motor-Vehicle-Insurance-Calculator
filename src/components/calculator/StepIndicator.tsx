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
    <div className="w-full py-6">
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
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-background border-primary text-primary ring-4 ring-primary/10"
                      : "bg-background border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>

                <span
                  className={cn(
                    "mt-3 w-28 text-center text-xs font-medium leading-tight transition-colors duration-300",
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
                <div className="flex-1 mt-5 mx-4">
                  <div className="relative h-[3px] rounded-full bg-border overflow-hidden">
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