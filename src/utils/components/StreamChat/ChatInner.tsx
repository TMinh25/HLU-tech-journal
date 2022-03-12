import { Box, useColorModeValue } from "@chakra-ui/react";
import {
  ChannelHeader,
  MessageInput,
  VirtualizedMessageList,
} from "stream-chat-react";
import { CustomMessage } from ".";
import Card from "../Card";

export default function ChatInner() {
  return (
    <Card
      p={0}
      h={600}
      overflowY="hidden"
      border={"none"}
      position="relative"
      bg={useColorModeValue("white", "gray.800")}
      color={useColorModeValue("gray.900", "white")}
    >
      <Box h={"100%"} pb={14}>
        <VirtualizedMessageList
          Message={CustomMessage}
          defaultItemHeight={100}
        />
      </Box>
      <MessageInput />
    </Card>
  );
}
