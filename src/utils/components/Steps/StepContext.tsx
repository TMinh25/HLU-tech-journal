import * as React from "react";

export interface StepContext {
  step: number;
  setStep?: () => void;
  isActive: boolean;
  isCompleted: boolean;
  isLastStep: boolean;
  isFirstStep: boolean;
}

export const StepContext = React.createContext<StepContext | null>(null);
