import { Box, useColorModeValue } from "@chakra-ui/react";
import {
  ChannelHeader,
  MessageInput,
  MessageList,
  useShouldForceScrollToBottom,
  VirtualizedMessageList,
} from "stream-chat-react";
import { CustomMessage } from "./index";
import Card from "../Card";

export default function ChatInner() {
  // useShouldForceScrollToBottom();

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
      <ChannelHeader />
      <Box h={"100%"} pb={150} overflowY="auto">
        {/* <MessageList Message={CustomMessage} /> */}
        <VirtualizedMessageList
          Message={CustomMessage}
          defaultItemHeight={100}
        />
      </Box>
      <MessageInput focus />
    </Card>
  );
}
