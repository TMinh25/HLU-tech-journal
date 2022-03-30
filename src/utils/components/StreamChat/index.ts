import { createContext } from "react";
import { LiteralStringForUnion } from "stream-chat";

export { default as CustomMessage } from "./CustomMessage";
export { default as CustomMessageInput } from "./CustomeMessageInput";
export { default as ChannelInner } from "./ChannelInner";
export { default as ChatInner } from "./ChatInner";

export const GiphyContext = createContext({});
