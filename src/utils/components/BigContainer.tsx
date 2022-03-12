import { Container, ContainerProps } from "@chakra-ui/react";
import { FC } from "react";

const BigContainer: FC<ContainerProps> = (props) => {
  return <Container maxW="8xl" py={14} {...props} />;
};

export default BigContainer;
