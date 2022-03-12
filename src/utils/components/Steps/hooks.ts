import { useState } from "react";
import { useContext } from "react";
import { StepContext } from "./StepContext";

interface Options {
  initialStep: number;
}

export const useSteps = (options: Options) => {
  const { initialStep } = options;
  const [activeStep, setActiveStep] = useState(initialStep);

  const nextStep = () => setActiveStep(activeStep + 1);
  const prevStep = () => setActiveStep(activeStep - 1);
  const setStep = (i: number) => setActiveStep(i);
  const reset = () => setActiveStep(0);

  return { nextStep, prevStep, reset, setStep, activeStep, initialStep };
};

export const useStep = () => {
  const context = useContext(StepContext);
  if (!context) {
    throw Error("Wrap your step with `<Steps />`");
  } else {
    return context;
  }
};
