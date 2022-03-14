import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Circle,
  Collapse,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useStep } from "./hooks";

export interface StepProps extends BoxProps {
  title?: string;
  helperTitle?: string;
}

const Step = (props: StepProps) => {
  const { title, helperTitle, children, ...boxProps } = props;
  const { isActive, isCompleted, step, isFirstStep, setStep } = useStep();

  const accentColor = useColorModeValue("green.500", "green.300");
  const mutedColor = useColorModeValue("gray.600", "whiteAlpha.800");
  const activeColor = useColorModeValue("white", "black");

  return (
    <Box {...boxProps}>
      <HStack cursor="pointer" spacing="4">
        {isFirstStep ? (
          <Circle
            size="8"
            fontWeight="bold"
            color={isActive ? "red.400" : mutedColor}
            bg={"transparent"}
            borderColor={mutedColor}
            borderWidth={"1px"}
          >
            <Icon as={CloseIcon} />
          </Circle>
        ) : (
          <Circle
            size="8"
            fontWeight="bold"
            color={
              isActive ? activeColor : isCompleted ? accentColor : mutedColor
            }
            bg={isActive ? accentColor : "transparent"}
            borderColor={isCompleted ? accentColor : "inherit"}
            borderWidth={isActive ? "0px" : "1px"}
            onClick={setStep}
          >
            {isCompleted ? <Icon as={CheckIcon} /> : step}
          </Circle>
        )}
        <Heading
          fontSize="lg"
          fontWeight="semibold"
          color={isActive || isCompleted ? "inherit" : mutedColor}
          onClick={setStep}
        >
          {title}{" "}
          {helperTitle && (
            <Text
              ps="4"
              as="span"
              color={useColorModeValue("gray.600", "gray.400")}
              fontSize="sm"
            >
              {helperTitle}
            </Text>
          )}
        </Heading>
      </HStack>
      <Collapse endingHeight="fit-content" in={isActive}>
        {children}
      </Collapse>
    </Box>
  );
};
export default Step;
