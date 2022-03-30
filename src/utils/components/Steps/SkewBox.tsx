import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";

const properties = {
  top: {
    transform: "skew(var(--arrow-skew))",
    borderToOmit: "borderBottom",
  },
  bottom: {
    transform: "skew(calc(var(--arrow-skew) * -1))",
    borderToOmit: "borderTop",
  },
};

export interface SkewBoxProps extends BoxProps {
  placement: "top" | "bottom";
  isCurrent?: boolean;
}

const SkewBox = (props: SkewBoxProps) => {
  const { placement, isCurrent, ...rest } = props;

  const defaultColor = useColorModeValue("white", "gray.800");
  const accentColor = useColorModeValue("green.500", "green.300");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  const { borderToOmit, transform } = properties[placement];
  const placementProps = {
    [placement]: 0,
    transform,
    [borderToOmit]: "0",
    borderColor: isCurrent ? accentColor : undefined,
  };

  return (
    <Box
      aria-hidden
      bg={isCurrent ? accentColor : defaultColor}
      borderWidth="1px"
      position="absolute"
      height="full"
      _groupHover={{
        bg: !isCurrent ? hoverBgColor : undefined,
      }}
      _groupFocus={{
        border: "2px solid",
        borderColor: useColorModeValue("green.200", "green.300"),
        [borderToOmit]: "0",
      }}
      width="full"
      {...placementProps}
      {...rest}
    />
  );
};
export default SkewBox;
