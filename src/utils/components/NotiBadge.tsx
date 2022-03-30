import { Badge, BadgeProps } from "@chakra-ui/react";
import { FC } from "react";

const NotiBadge: FC<BadgeProps> = (props) => {
  return (
    <Badge
      as={"span"}
      color={"white"}
      // position={"absolute"}
      // bottom={"-20px"}
      // left={"-24px"}
      fontSize={"xs"}
      bgColor={"red.600"}
      borderRadius={"full"}
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      h={4}
      w={4}
      {...props}
    />
  );
};

export default NotiBadge;
