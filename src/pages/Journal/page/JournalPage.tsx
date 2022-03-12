import {
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Spacer,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FC } from "react";
import { MdOutlineArticle, MdOutlinePictureAsPdf } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import {
  useGetArticleOfJournalQuery,
  useGetJournalByIdQuery,
} from "../../../features/journal";
import Article from "../../../interface/article.model";
import { BigContainer, Card } from "../../../utils/components";

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

const ArticleCard: FC<{
  article: Article;
}> = ({ article }) => (
  <LinkBox as="article">
    <Card py={4} isTruncated>
      <HStack>
        <LinkOverlay as={Link} to={`/article/${article._id}`}>
          <HStack spacing={5}>
            <Icon as={MdOutlineArticle} />
            <Stack spacing={0}>
              <Heading size="sm">{article.title}</Heading>
              <Text color="gray.500">
                {[...article.authors.sub, article.authors.main]
                  .map((author) => author.displayName)
                  .join(", ")}
              </Text>
            </Stack>
          </HStack>
        </LinkOverlay>
        <Spacer />
        <Tooltip
          label={`${article.currentFile?.title
            .split(".")
            [
              article.currentFile?.title.split(".").length - 1
            ].toUpperCase()} | ${article.currentFile?.title}`}
        >
          <Link to={`/view/${article.currentFile?._id}`} target="_blank">
            <IconButton
              aria-label="article-file"
              icon={<Icon as={MdOutlinePictureAsPdf} />}
            />
          </Link>
        </Tooltip>
      </HStack>
    </Card>
  </LinkBox>
);
