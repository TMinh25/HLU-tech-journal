import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";

const Card: FC<BoxProps> = ({ ...props }: any) => {
  return (
    <Box
      border={".5px solid"}
      borderColor={useColorModeValue("gray.300", "gray.500")}
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"2xl"}
      rounded={"lg"}
      w="100%"
      p={6}
      {...props}
    />
  );
};
export default Card;
