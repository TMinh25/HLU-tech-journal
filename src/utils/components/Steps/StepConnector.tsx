import { Box, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { useStep } from "./hooks";

const StepConnector = () => {
  const { isCompleted, isActive } = useStep();
  const accentColor = useColorModeValue("green.500", "green.300");

  return (
    <Box
      borderStartWidth="1px"
      borderStartColor={isCompleted ? accentColor : "inherit"}
      height="6"
      mt={isActive ? "0" : "2"}
      mb="2"
      ms="4"
      ps="4"
    />
  );
};
export default StepConnector;
