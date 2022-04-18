import {
  Avatar,
  AvatarGroup,
  Divider,
  Heading,
  ListItem,
  OrderedList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Column, usePagination, useSortBy, useTable } from "react-table";
import Article from "../../../interface/article.model";
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
                {/* {Object.keys(groupedArticles).map((key) => (
                  <>
                    <Heading>{key}</Heading>
                    {groupedArticles[key]
                      .filter((article) => article.visible)
                      .map((article) => (
                        <ArticleCard {...{ article }} />
                      ))}
                  </>
                ))} */}
                {/* <BigContainer {...getTableBodyProps()}>
                  {
                    // Loop over the table rows
                    rows.map((row) => {
                      // Prepare the row for display
                      prepareRow(row);
                      return <ArticleCard article={row.original} mb={4} />;
                    })
                  }
                </BigContainer> */}
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
