import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useGetArticleQuery } from "../../features/article";
import {
  AuthorBox,
  BigContainer,
  FileDisplayButton,
  TagsComponent,
} from "../../utils/components";

const ArticlePage: FC = (props) => {
  const { articleId } = useParams();
  const { data, isLoading } = useGetArticleQuery(articleId);
  return (
    <BigContainer>
      <Skeleton isLoaded={!isLoading} h="xl">
        {data && (
          <>
            <Stack spacing={4}>
              <Heading size="lg">{data?.title}</Heading>
              <Stack>
                <Heading size="md">Thông tin bài báo</Heading>
                <SimpleGrid
                  columns={[1, 3, 3]}
                  color={useColorModeValue("gray.600", "gray.400")}
                >
                  <Text>
                    Ngày nhận bài:{" "}
                    {new Date(data.createdAt).toLocaleDateString()}
                  </Text>
                  {data.publishedAt && (
                    <Text>
                      Ngày hoàn thiện:{" "}
                      {new Date(data.publishedAt).toLocaleDateString()}
                    </Text>
                  )}
                </SimpleGrid>
              </Stack>
              <Stack>
                <Heading size="md">Các tác giả</Heading>
                <SimpleGrid
                  columns={{ base: 1, md: 1, lg: 2, xl: 3 }}
                  spacing={8}
                >
                  <Link to={`/user/${data.authors.main._id}`}>
                    <AuthorBox author={data.authors.main} />
                  </Link>
                  {data.authors.sub?.map((author: any) => (
                    <AuthorBox author={author} />
                  ))}
                </SimpleGrid>
              </Stack>
              <Stack>
                <Heading size="md">Tóm tắt</Heading>
                <Text color={useColorModeValue("gray.600", "gray.400")}>
                  {data.abstract}
                </Text>
              </Stack>
              <Stack>
                <Heading size="md">Từ khóa</Heading>
                <TagsComponent tags={data.tags} />
              </Stack>
              {data.currentFile && (
                <Stack>
                  <Heading size="md">Toàn văn</Heading>
                  <Link to={`/view/${data.currentFile._id}`} target="_blank">
                    <FileDisplayButton file={data.currentFile} />
                  </Link>
                </Stack>
              )}
            </Stack>

            {/* <Text>{JSON.stringify(data)}</Text> */}
          </>
        )}
      </Skeleton>
    </BigContainer>
  );
};

export default ArticlePage;
