import {
  Divider,
  Heading,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import {
  useGetArticleOfJournalQuery,
  useGetJournalByIdQuery,
} from "../../../features/journal";
import { BigContainer } from "../../../utils/components";
import { ArticleCard } from "../../../utils/components";

export default function JournalPage(props: any) {
  const { journalId } = useParams();

  const { data, isLoading, isFetching } = useGetJournalByIdQuery(journalId);
  const articles = useGetArticleOfJournalQuery(journalId);

  return (
    <>
      <BigContainer>
        <Skeleton isLoaded={!isLoading || !isFetching}>
          <Stack p={30} w="100%">
            <Heading>{data?.name}</Heading>
            <Heading size="md">{data?.journalGroup.name}</Heading>
            {data?.publishedAt && (
              <Text color="gray.500">
                Xuất bản ngày{" "}
                {new Date(data?.publishedAt).toLocaleDateString("vi")}
              </Text>
            )}
            <Divider />
            <Stack spacing={6}>
              <Heading size="md">Các bài báo</Heading>
              <Stack spacing={4}>
                {articles.data?.length &&
                  articles.data
                    .filter((article) => article.visible)
                    .map((article) => <ArticleCard {...{ article }} />)}
              </Stack>
            </Stack>
          </Stack>
        </Skeleton>
      </BigContainer>
    </>
  );
}


