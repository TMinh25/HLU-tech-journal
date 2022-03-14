import {
  Avatar,
  AvatarGroup,
  BoxProps,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC } from "react";
import Article from "../../interface/article.model";
import { FileDisplayButton, TagsComponent } from "./";
import Card from "./Card";

const ArticlePreview: FC<
  {
    article: Article;
    size: "lg" | "md";
  } & BoxProps
> = ({ article, size, ...props }) => {
  // const [showMore, setShowMore] = useState(false);
  return (
    <Card
      maxW={size == "lg" ? "100%" : "445px"}
      w={"full"}
      bg={useColorModeValue("white", "gray.900")}
      boxShadow={"2xl"}
      rounded={"md"}
      p={6}
      overflow={"hidden"}
      textAlign="left"
      {...props}
    >
      <Stack>
        {article?.tags && <TagsComponent tags={article.tags} />}
        <Text color={"gray.500"}>{article?.journalGroup?.name}</Text>
        <Heading
          color={useColorModeValue("gray.700", "white")}
          fontSize={"2xl"}
          fontFamily={"body"}
          margin={0}
        >
          {article?.title}
        </Heading>
        <Text
          margin={0}
          color={"gray.500"}
          // noOfLines={showMore ? undefined : 3}
        >
          {article?.abstract}
        </Text>
        {/* <Text
            as="a"
            fontWeight="bold"
            cursor="pointer"
            _hover={{ textDecor: "underline" }}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Ẩn" : "Xem thêm"}
          </Text> */}
      </Stack>
      <HStack mt={4} spacing={4} align={"center"}>
        <AvatarGroup max={3}>
          <Avatar src={article?.authors.main.photoURL} />
          {article?.authors?.sub?.map((author) => (
            <Avatar name={author?.displayName} src={(author as any).photoURL} />
          ))}
        </AvatarGroup>
        <Stack direction={"column"} spacing={0} fontSize={"sm"}>
          <Text fontWeight={600}>
            {article?.authors.main.displayName}
            {Boolean(article?.authors.sub?.length) &&
              ` và ${article?.authors.sub?.length} người khác`}
          </Text>
        </Stack>
      </HStack>
      <Stack mt={4}>
        {Boolean(article.detail?.submission.file) && (
          <>
            <Heading size="xs">File bản thảo</Heading>
            <Link
              href={article.detail?.submission.file?.downloadUri}
              isExternal
            >
              <FileDisplayButton file={article.detail?.submission.file} />
            </Link>
          </>
        )}
        {Boolean(article.detail?.submission.helperFiles?.length) && (
          <>
            <Heading size="xs">File hỗ trợ</Heading>
            {article.detail?.submission.helperFiles?.map((file) => (
              <Link href={file.downloadUri}>
                <FileDisplayButton file={file} />
              </Link>
            ))}
          </>
        )}
      </Stack>
    </Card>
  );
};
export default ArticlePreview;
