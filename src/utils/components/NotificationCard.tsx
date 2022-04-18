import React, { FC } from "react";
import {
  Stack,
  Text,
  Button,
  StackProps,
  useColorModeValue,
  Box,
  BoxProps,
  Heading,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { FcLock } from "react-icons/fc";
import INotification from "../../interface/notification";
import { Link } from "react-router-dom";

const NotificationCard: FC<BoxProps & INotification> = ({
  title,
  content,
  createdAt,
  _id,
  ...props
}) => {
  return (
    // <Link >
    <LinkBox
      p="4"
      boxShadow="lg"
      mb="4"
      borderRadius="md"
      borderWidth={0.2}
      borderColor={useColorModeValue("gray.200", "gray.700")}
      {...props}
    >
      <Heading isTruncated size="md" mb={2} textAlign="start">
        <LinkOverlay as={Link} to={`/notifications/${_id}`}>
          🔔 {title}
        </LinkOverlay>
      </Heading>
      <Stack
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
      >
        <Text fontSize={{ base: "sm" }} textAlign={"left"} maxW={"4xl"}>
          {content}
        </Text>
      </Stack>
      <Text textAlign="end" color="gray">
        {new Date(createdAt).toLocaleDateString("vi")}
      </Text>
    </LinkBox>
    // </Link>
  );
};
export default NotificationCard;
