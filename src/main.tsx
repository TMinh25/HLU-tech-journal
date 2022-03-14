import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
  CloseButton,
} from "@chakra-ui/react";
import { createContext } from "react";
import { StreamChat } from "stream-chat";
import config from "./config";
import stream from "getstream";

console.log(config);

const customTheme = extendTheme(
  {
    components: {
      CloseButton: {
        defaultProps: {
          colorScheme: "red",
        },
        colorScheme: "red",
      },
    },
  },
  withDefaultColorScheme({
    colorScheme: "red",
    components: ["CloseButton"],
  })
);

const client = StreamChat.getInstance(config.streamChat.key);

export const StreamChatContext = createContext(client);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <StreamChatContext.Provider value={client}>
        <ChakraProvider theme={customTheme}>
          <App />
        </ChakraProvider>
      </StreamChatContext.Provider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
