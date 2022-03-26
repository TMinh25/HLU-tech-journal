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

const CopyEditorArticleCard: FC<{
  article: Article;
  copyeditingFile?: boolean;
}> = ({ article, copyeditingFile = true }) => (
  <LinkBox as="article">
    <Card py={4} isTruncated>
      <HStack>
        <LinkOverlay as={Link} to={`/copyeditor/article/${article._id}`}>
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
        {copyeditingFile && article.detail?.copyediting.draftFiles && (
          <Tooltip
            label={`${article.detail?.copyediting.draftFiles?.title
              .split(".")
              [
                article.detail?.copyediting.draftFiles?.title.split(".")
                  .length - 1
              ].toUpperCase()} | ${
              article.detail?.copyediting.draftFiles?.title
            }`}
          >
            <Link
              to={`/view/${article.detail?.copyediting.draftFiles?._id}`}
              target="_blank"
            >
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

export default CopyEditorArticleCard;
