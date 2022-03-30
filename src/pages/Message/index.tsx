import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Channel } from "stream-chat";
import { StreamChatContext } from "../../main";
import GetStreamChat from "../../utils/components/StreamChat/GetStreamChat";

const MessagePage: FC = (props) => {
  const { channelId } = useParams();
  const streamChatClient = useContext(StreamChatContext);
  const [chatChannel, setChatChannel] = useState<Channel>();
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (channelId && !chatChannel) {
        const filter = { id: { $eq: channelId }, type: "messaging" };
        const options = { limit: 1 };

        const channel = await streamChatClient.queryChannels(
          filter,
          [],
          options
        );

        await channel[0].watch();
        setChatChannel(channel[0]);
      }
    })();

    return () => {
      if (chatChannel) {
        setIsChatLoading(true);
        chatChannel.stopWatching();
        setIsChatLoading(false);
      }
    };
  }, []);

  return (
    <GetStreamChat
      streamChatClient={streamChatClient}
      channel={chatChannel}
      isLoading={isChatLoading}
    />
  );
};
export default MessagePage;
