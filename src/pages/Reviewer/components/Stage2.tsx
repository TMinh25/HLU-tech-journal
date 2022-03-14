import {
  Box,
  Button,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Channel } from "stream-chat";
import { Channel as ChatChannel, Chat } from "stream-chat-react";
import { useGetArticleQuery } from "../../../features/article";
import { useAuth } from "../../../hooks/useAuth";
import { StreamChatContext } from "../../../main";
import { Card } from "../../../utils/components";
import {
  ChatInner,
  CustomMessageInput,
} from "../../../utils/components/StreamChat";
import GetStreamChat from "../../../utils/components/StreamChat/GetStreamChat";
import NotFound from "../../404";

const StageTwo: FC<{
  toStage: (stage: number) => void;
}> = ({ toStage }) => {
  const nextStage = 2;
  const prevStage = 0;
  const { articleId, roundId } = useParams();
  const article = useGetArticleQuery(articleId);

  const reviewRound = useMemo(() => {
    if (article.data?.detail?.review && roundId) {
      const roundIndex = article.data?.detail?.review?.findIndex(
        (r) => r._id === roundId
      );
      return article.data?.detail?.review![roundIndex];
    }
  }, [article.data?.detail?.review]);

  if (!roundId || !articleId || !reviewRound) return <NotFound />;
  const { currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const streamChatClient = useContext(StreamChatContext);
  const [channel, setChannel] = useState<Channel>();

  const getChannelForCurrentRound = async () => {
    setIsLoading(true);
    if (currentUser && reviewRound?.editor) {
      const chatChannel = streamChatClient.channel("messaging", {
        members: [currentUser._id, reviewRound.editor],
      });
      await chatChannel.watch();
      setChannel(chatChannel);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => getChannelForCurrentRound())();

    return function cleanup() {
      if (channel) {
        setIsLoading(true);
        channel.stopWatching();
        setIsLoading(false);
      }
    };
  }, []);

  return (
    <Stack spacing={4}>
      <Box>
        <Heading size="lg" mb={4}>
          Hướng dẫn
        </Heading>
        {!!reviewRound?.guideLines ? (
          <Text>{reviewRound?.guideLines}</Text>
        ) : (
          <Text color="gray">
            Ban biên tập không có hướng dẫn nào dành cho phản biện
          </Text>
        )}
      </Box>
      <GetStreamChat
        isLoading={isLoading}
        streamChatClient={streamChatClient}
        channel={channel}
      />
      <HStack py={8} spacing={4} justify="end">
        <Button onClick={() => toStage(prevStage)}>Quay lại</Button>
        <Button colorScheme="green" onClick={() => toStage(nextStage)}>
          Bước tiếp theo
        </Button>
      </HStack>
    </Stack>
  );
};

export default StageTwo;
