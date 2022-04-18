import {
  HStack,
  Icon,
  Link,
  LinkProps,
  useColorModeValue as mode,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

interface SideNavLinkProps extends LinkProps {
  isActive?: boolean;
  label: string;
  icon: any;
  to: string;
}

export const SideNavLink = (props: SideNavLinkProps) => {
  const { icon, isActive, label, to, ...rest } = props;
  return (
    <Link
      as={RouterLink}
      display="block"
      py={2}
      px={3}
      borderRadius="md"
      transition="all 0.3s"
      fontWeight="medium"
      lineHeight="1.5rem"
      aria-current={isActive ? "page" : undefined}
      color={mode("blackAlpha.800", "whiteAlpha.800")}
      _hover={{
        bg: mode("gray.100", "gray.700"),
        color: mode("black", "white"),
      }}
      _activeLink={{
        bg: mode("blue.500", "blue.300"),
        color: mode("white", "black"),
      }}
      {...rest}
    >
      <HStack spacing={4}>
        <Icon as={icon} boxSize="20px" />
        <Text as="span">{label}</Text>
      </HStack>
    </Link>
  );
};
