import { Icon, Skeleton } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Channel, StreamChat } from "stream-chat";
import {
  Channel as ChatChannel,
  Chat,
  usePrependedMessagesCount,
  useScrollLocationLogic,
} from "stream-chat-react";
import { useAuth } from "../../../hooks/useAuth";
import Card from "../Card";
import { CustomMessageInput, ChatInner } from "./index";

const GetStreamChat: FC<{
  isLoading: boolean;
  streamChatClient: StreamChat;
  channel?: Channel;
}> = ({ isLoading, streamChatClient, channel }) => {
  const theme = localStorage.getItem("chakra-ui-color-mode");

  const { currentUser } = useAuth();

  const { scrollToBottom } = useScrollLocationLogic({
    currentUserId: currentUser?._id,
    scrolledUpThreshold: 2000,
  });

  useEffect(() => scrollToBottom(), [channel]);

  return (
    <Skeleton
      isLoaded={!isLoading || !Boolean(streamChatClient && channel)}
      h={600}
    >
      <Card shadow="none" p={0} maxH={600} overflowY="hidden">
        <Chat client={streamChatClient} theme={`messaging ${theme}`}>
          <ChatChannel
            channel={channel}
            Input={CustomMessageInput}
            multipleUploads={true}
            maxNumberOfFiles={5}
            TypingIndicator={() => <Icon as={BsThreeDots} />}
          >
            <ChatInner />
          </ChatChannel>
        </Chat>
      </Card>
    </Skeleton>
  );
};
export default GetStreamChat;
