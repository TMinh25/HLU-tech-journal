import React, { useContext } from "react";
import { Attachment, logChatPromiseExecution, UserResponse } from "stream-chat";
import {
  MessageList,
  MessageInput,
  Window,
  StreamMessage,
  useChannelActionContext,
  Thread,
} from "stream-chat-react";

import { CustomMessageInput } from "./index";

import {
  AttachmentType,
  ChannelType,
  CommandType,
  EventType,
  GiphyContext,
  MessageType,
  ReactionType,
  UserType,
} from "./index";

export type ChannelInnerProps = {
  // toggleMobile: () => void;
  theme: string;
};

const ChannelInner: React.FC<ChannelInnerProps> = (props) => {
  const { theme } = props;
  const { giphyState, setGiphyState } = useContext(GiphyContext);

  const { sendMessage } = useChannelActionContext<
    AttachmentType,
    ChannelType,
    CommandType,
    EventType,
    MessageType,
    ReactionType,
    UserType
  >();

  // const overrideSubmitHandler = (message: {
  //   attachments: Attachment[];
  //   mentioned_users: UserResponse[];
  //   text: string;
  //   parent?: StreamMessage;
  // }) => {
  //   let updatedMessage;

  //   if (sendMessage) {
  //     const newMessage = message;

  //     logChatPromiseExecution(sendMessage(message), "send message");
  //   }

  //   setGiphyState(false);
  // };

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
