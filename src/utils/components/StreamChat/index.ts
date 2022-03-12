import { createContext } from "react";
import { LiteralStringForUnion } from "stream-chat";

export { default as CustomMessage } from "./CustomMessage";
export { default as CustomMessageInput } from "./CustomeMessageInput";
export { default as ChannelInner } from "./ChannelInner";
export { default as ChatInner } from "./ChatInner";

export const GiphyContext = createContext(
  {} as {
    giphyState: boolean;
    setGiphyState: React.Dispatch<React.SetStateAction<boolean>>;
  }
);
export type AttachmentType = {};
export type ChannelType = { demo?: string };
export type CommandType = LiteralStringForUnion;
export type EventType = {};
export type MessageType = {};
export type ReactionType = {};
export type UserType = { image?: string };
