import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Heading,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { FC } from "react";
import { useGetUserQuery } from "../../../features/user";
import Article, { ReviewRoundObject } from "../../../interface/article.model";
import { ReviewStatus } from "../../../types";
import {
  getReviewResultType,
  toResultRecommendationString,
} from "../../../utils";
import { FileDisplayButton } from "../../../utils/components";

const ReviewSubmittedDetailModal: FC<{
  article?: Article;
  reviewRound: ReviewRoundObject;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirm: boolean) => void;
  isLoading: boolean;
}> = ({ article, reviewRound, isOpen, onClose, onConfirm, isLoading }) => {
  const reviewer = useGetUserQuery(reviewRound.reviewer).data;
  const result = reviewRound.result;
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{article?.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Heading size="md">
              Phản biện: {reviewer?.displayName}
              <Text as="span" color="gray" fontWeight="normal">
                {" "}
                - {reviewer?.email}
              </Text>
            </Heading>
            <Text color="gray">
              Sau khi xem xét xong đánh giá, hãy nhấn nút "Xác nhận" để cho biết
              rằng quá trình đánh giá có thể tiếp tục. Sau đó tác giả có thể
              thấy được đánh giá của phản biện.
            </Text>
            {result?.submittedAt && (
              <Alert status="info" variant={"left-accent"}>
                <AlertIcon />
                <AlertTitle>Thời gian nộp đánh giá: </AlertTitle>
                <AlertDescription>
                  {new Date(result?.submittedAt)?.toLocaleString()}
                </AlertDescription>
              </Alert>
            )}
            {result?.recommendations && (
              <Alert
                status={getReviewResultType(result.recommendations)}
                variant={"left-accent"}
              >
                <AlertIcon />
                <AlertTitle>Đề xuất: </AlertTitle>
                <AlertDescription>
                  {toResultRecommendationString(result.recommendations)}
                </AlertDescription>
              </Alert>
            )}
            <Heading size="sm">Bình luận của phản biện</Heading>
            <UnorderedList stylePosition="inside">
              {result?.commentForEveryone && (
                <Box>
                  <ListItem fontWeight="bold">
                    Dành cho tác giả và biên tập viên
                  </ListItem>
                  <Text opacity={0.8}>{result?.commentForEveryone}</Text>
                </Box>
              )}
              {result?.commentForEditors && (
                <Box>
                  <ListItem fontWeight="bold">Dành cho biên tập viên</ListItem>
                  <Text opacity={0.8}>{result?.commentForEditors}</Text>
                </Box>
              )}
              <Box>
                <ListItem fontWeight="bold">Tài liệu</ListItem>
                <Stack mt={2} spacing={3}>
                  {result?.files?.length ? (
                    result?.files.map((file) => (
                      <Link href={file.downloadUri} isExternal>
                        <FileDisplayButton file={file} />
                      </Link>
                    ))
                  ) : (
                    <Center color="gray">
                      Không có tệp tin nào được tải lên!
                    </Center>
                  )}
                </Stack>
              </Box>
            </UnorderedList>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3} isLoading={isLoading}>
            Đóng
          </Button>
          {reviewRound.status === ReviewStatus.reviewSubmitted && (
            <>
              <Button
                onClick={() => onConfirm(false)}
                colorScheme="red"
                isLoading={isLoading}
                mr={3}
              >
                Từ chối
              </Button>
              <Button
                onClick={() => onConfirm(true)}
                colorScheme="green"
                isLoading={isLoading}
              >
                Xác nhận
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReviewSubmittedDetailModal;
