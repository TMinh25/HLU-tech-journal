import {
  Box,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";
import Article from "../../../interface/article.model";
import { AuthorBox } from "../../../utils/components";
import { TagsComponent } from "../../../utils/components";

const ArticleDetailModal: FC<{
  article: Article | undefined;
  isOpen: boolean;
  onClose: () => void;
}> = ({ article, isOpen, onClose }) => {
  const { authors } = { ...article };

  return (
    <>
      <Modal isCentered size={"3xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chi tiết bản thảo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <Heading size="md">
                <Text as="span" textDecor={"underline"}>
                  Chuyên san:
                </Text>{" "}
                {article?.journalGroup.name}
              </Heading>
              <Heading size="md">
                <Text as="span" textDecor={"underline"}>
                  Tạp chí:
                </Text>{" "}
                {article?.journal.name}
              </Heading>
              <Heading size="md">
                <Text as="span" textDecor={"underline"}>
                  Tiêu đề:
                </Text>{" "}
                {article?.title}
              </Heading>
              <Box>
                <TagsComponent tags={article?.tags} />
              </Box>
              <Text color="gray.500">{article?.abstract}</Text>
              <Box>
                <Heading size="sm" mb={2}>
                  Các tác giả
                </Heading>
                <Stack>
                  {authors?.main && <AuthorBox author={authors.main} />}
                  {authors?.sub?.length &&
                    authors?.sub.map((a) => <AuthorBox author={a} />)}
                </Stack>
              </Box>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ArticleDetailModal;
