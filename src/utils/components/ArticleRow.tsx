import {
  Heading,
  HStack,
  Icon,
  IconButton,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FC } from "react";
import { MdOutlineArticle, MdOutlinePictureAsPdf } from "react-icons/md";
import { Link } from "react-router-dom";
import Article from "../../interface/article.model";
import { Card } from ".";

const ArticleCard: FC<{
  article: Article;
  publishedFile?: boolean;
}> = ({ article, publishedFile = true }) => (
  <LinkBox as="article">
    <Card py={4} isTruncated>
      <HStack>
        <Tooltip label={article.title} openDelay={500}>
          <LinkOverlay as={Link} to={`/article/${article._id}`} w={"90%"}>
            <HStack spacing={5}>
              <Icon as={MdOutlineArticle} />
              <Stack spacing={0} w={"full"}>
                <Heading size="sm" isTruncated>
                  {article.title}
                </Heading>
                <Text color="gray.500">
                  {[...article.authors.sub, article.authors.main]
                    .map((author) => author.displayName)
                    .join(", ")}
                </Text>
              </Stack>
            </HStack>
          </LinkOverlay>
        </Tooltip>
        <Spacer />
        {article.publishedFile && (
          <Tooltip
            label={`${article.publishedFile?.title
              ?.split(".")
              [
                article.publishedFile?.title.split(".").length - 1
              ].toUpperCase()} | ${article.publishedFile?.title}`}
          >
            <Link to={`/view/${article.publishedFile?._id}`} target="_blank">
              <IconButton
                aria-label="article-file"
                icon={<Icon as={MdOutlinePictureAsPdf} />}
              />
            </Link>
          </Tooltip>
        )}
      </HStack>
    </Card>
  </LinkBox>
);

export default ArticleCard;
