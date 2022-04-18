import {
  Avatar,
  Box,
  CloseButton,
  Heading,
  HStack,
  ScaleFade,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/system";
import { useContext, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAppState } from "../../hooks/useAppState";
import { StreamChatContext } from "../../main";
import { Footer } from "./Footer";
import Header from "./Header";

export default function LandingPage() {
  const location = useLocation();
  const { toast } = useAppState();
  const streamChatClient = useContext(StreamChatContext);

  useEffect(() => {
    const unreadCountListener = streamChatClient.on((event) => {
      if (event.total_unread_count && event.unread_channels) {
        const { message } = event;
        console.log(message);
        toast({
          render: ({ onClose }) => (
            <Box
              p={3}
              boxShadow={"2xl"}
              rounded={"lg"}
              border=".2px solid"
              color="black"
              borderColor={useColorModeValue("gray.200", "gray.600")}
              bg={useColorModeValue("white", "gray.700")}
              // onClick={() => navigate(`/message/${message?.id}`)}
            >
              <HStack>
                <Avatar src={message?.user?.image as string} />
                <Stack>
                  <Heading size="sm">{message?.user?.name}</Heading>
                  <Text>{message?.text}</Text>
                </Stack>
                <Spacer />
                <CloseButton onClick={onClose} />
              </HStack>
            </Box>
          ),
        });
      }
    });

    return () => {
      unreadCountListener.unsubscribe();
    };
  }, []);

  return (
    <Box>
      <Header />
      <ScaleFade key={location.pathname} initialScale={0.95} in={true}>
        <Box __css={{ minH: "calc(100vh - 60px)" }}>
          <Outlet />
        </Box>
      </ScaleFade>
      <Footer />
    </Box>
  );
}
