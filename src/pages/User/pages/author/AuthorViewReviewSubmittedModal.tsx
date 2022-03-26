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
import { useGetUserQuery } from "../../../../features/user";
import Article, {
  ReviewRoundObject,
} from "../../../../interface/article.model";
import {
  getReviewResultType,
  toResultRecommendationString,
} from "../../../../utils";
import { Card, FileDisplayButton } from "../../../../utils/components";

const AuthorViewReviewSubmittedModal: FC<{
  article?: Article;
  reviewRound: ReviewRoundObject;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}> = ({ article, reviewRound, isOpen, onClose, isLoading }) => {
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
            {result?.submittedAt && (
              <Alert status="info" variant={"left-accent"}>
                <AlertIcon />
                <AlertTitle>Thời gian đánh giá: </AlertTitle>
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
            <Stack>
              {result?.commentForEveryone && (
                <Card>
                  <Text fontWeight="bold">Đánh giá của phản biện</Text>
                  <Text opacity={0.8}>{result?.commentForEveryone}</Text>
                </Card>
              )}
              <Card>
                <Text fontWeight="bold">Tài liệu của phản biện</Text>
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
              </Card>
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3} isLoading={isLoading}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AuthorViewReviewSubmittedModal;
