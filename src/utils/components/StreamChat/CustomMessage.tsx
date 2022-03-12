import {
  Avatar as FallBackAvatar,
  Box,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";
import { FC } from "react";
import {
  Attachment,
  Avatar,
  FixedHeightMessageProps,
  MessageTimestamp,
  useMessageContext,
} from "stream-chat-react";
import Card from "../Card";
import { formatRelative } from "date-fns";
import { vi } from "date-fns/locale";

const CustomMessage: FC<FixedHeightMessageProps> = (props) => {
  const { message: propMessage } = props;
  const { message: contextMessage, isMyMessage } = useMessageContext();
  const message = propMessage || contextMessage;

  if (isMyMessage()) {
    return (
      <>
        <Box display="flex" justifyContent={"flex-end"} key={message.id}>
          <Card
            display={"flex"}
            width="fit-content"
            boxShadow="lg"
            borderRadius="md"
            overflow="hidden"
            bg={useColorModeValue("white", "gray.700")}
            px={2}
            py={2}
            mb={2}
          >
            <Stack px={4}>
              {message.attachments && (
                <Attachment attachments={message.attachments} />
              )}
              {message.text && (
                <Text fontSize="md" css={{ whiteSpace: "pre" }}>
                  {message?.text}
                </Text>
              )}
              {message.created_at && (
                <Text
                  fontSize="xs"
                  css={{ whiteSpace: "pre" }}
                  color={useColorModeValue("gray.400", "gray.400")}
                >
                  {formatRelative(new Date(message.created_at), new Date(), {
                    locale: vi,
                  })}
                </Text>
              )}
            </Stack>
            {message.user.image ? (
              <Avatar
                image={message.user.image}
                name={message.user.name || message.user.id}
                shape="circle"
                size={38}
                user={message.user}
              />
            ) : (
              <FallBackAvatar h={38} w={38} />
            )}
          </Card>
        </Box>
      </>
    );
  }
  return (
    <>
      <Box display="flex" justifyContent={"flex-start"} key={message.id}>
        <Card
          display={"flex"}
          width="fit-content"
          boxShadow="lg"
          borderRadius="md"
          overflow="hidden"
          bg={useColorModeValue("white", "gray.700")}
          px={2}
          py={2}
          mb={2}
        >
          {message.user.image ? (
            <Avatar
              image={message.user.image}
              name={message.user.name || message.user.id}
              shape="circle"
              size={38}
              user={message.user}
            />
          ) : (
            <FallBackAvatar h={38} w={38} />
          )}

          <Stack px={4}>
            {message.attachments && (
              <Attachment attachments={message.attachments} />
            )}
            {message.text && (
              <Text fontSize="md" css={{ whiteSpace: "pre" }}>
                {message?.text}
              </Text>
            )}
            {message.created_at && (
              <Text
                fontSize="xs"
                css={{ whiteSpace: "pre" }}
                color={useColorModeValue("gray.400", "gray.400")}
              >
                {formatRelative(new Date(message.created_at), new Date(), {
                  locale: vi,
                })}
              </Text>
            )}
          </Stack>
        </Card>
      </Box>
    </>
  );
};

export default CustomMessage;
