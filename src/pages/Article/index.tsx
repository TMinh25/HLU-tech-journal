import { CloseIcon } from "@chakra-ui/icons";
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
  const { data, isLoading, isError, error } = useGetArticleQuery(articleId);
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
              {data.tags?.length && (
                <Stack>
                  <Heading size="md">Từ khóa</Heading>
                  <TagsComponent tags={data.tags} />
                </Stack>
              )}
              {data.publishedFile && (
                <Stack>
                  <Heading size="md">Toàn văn</Heading>
                  {/* <Link to={`/view/${data.publishedFile._id}`} target="_blank"> */}
                  <FileDisplayButton file={data.publishedFile} />
                  {/* </Link> */}
                </Stack>
              )}
            </Stack>

            {/* <Text>{JSON.stringify(data)}</Text> */}
          </>
        )}
        {isError && (
          <Box textAlign="center" py={10} px={6}>
            <Box display="inline-block">
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                bg={"red.500"}
                rounded={"50px"}
                w={"55px"}
                h={"55px"}
                textAlign="center"
              >
                <CloseIcon boxSize={"20px"} color={"white"} />
              </Flex>
            </Box>
            <Heading as="h2" size="xl" mt={6} mb={2}>
              Không thể truy cập
            </Heading>
            <Text color={"gray.500"}>{(error as any)?.data.message}</Text>
          </Box>
        )}
      </Skeleton>
    </BigContainer>
  );
};

export default ArticlePage;
