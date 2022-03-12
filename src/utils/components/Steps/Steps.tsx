import { Box, BoxProps } from "@chakra-ui/react";
import React, { FC, useMemo } from "react";
import StepConnector from "./StepConnector";
import { StepContext } from "./StepContext";

export interface StepsProps {
  setStep?: (step: number) => void;
  activeStep: number;
  children?: React.ReactNode;
}

const Steps: FC<StepsProps> = (props) => {
  const { activeStep, children, setStep } = props;
  const steps = useMemo(
    () =>
      React.Children.toArray(children).map((step, i, arr) => (
        <StepContext.Provider
          key={i}
          value={{
            isActive: activeStep === i,
            isCompleted: activeStep > i,
            isLastStep: arr.length !== i + 1,
            isFirstStep: i == 0,
            step: i + 1,
            setStep: setStep ? () => setStep(i) : undefined,
          }}
        >
          {step}
          {arr.length !== i + 1 && <StepConnector />}
        </StepContext.Provider>
      )),
    [activeStep, children]
  );
  return <Box h="fit-content">{steps}</Box>;
};
export default Steps;
