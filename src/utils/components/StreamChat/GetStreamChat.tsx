import { Icon, Skeleton } from "@chakra-ui/react";
import { FC } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Channel, StreamChat } from "stream-chat";
import { Channel as ChatChannel, Chat } from "stream-chat-react";
import { ChatInner, CustomMessageInput } from ".";
import Card from "../Card";

const GetStreamChat: FC<{
  isLoading: boolean;
  streamChatClient: StreamChat;
  channel?: Channel;
}> = ({ isLoading, streamChatClient, channel }): JSX.Element => {
  const theme = localStorage.getItem("chakra-ui-color-mode");

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
