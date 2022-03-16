import React, { useContext } from "react";
import {
  MessageInput,
  MessageList,
  Thread,
  useChannelActionContext,
  Window,
} from "stream-chat-react";
import { CustomMessageInput, GiphyContext } from "./index";

const ChannelInner = (props: { theme: string }) => {
  const { theme } = props;

  const { sendMessage } = useChannelActionContext();

  const actions = ["delete", "edit", "flag", "mute", "react", "reply"];

  return (
    <>
      <Window>
        {/* <MessagingChannelHeader theme={theme} toggleMobile={toggleMobile} /> */}
        <MessageList messageActions={actions} />
        <MessageInput focus />
      </Window>
      <Thread Input={CustomMessageInput} />
    </>
  );
};

export default ChannelInner;
