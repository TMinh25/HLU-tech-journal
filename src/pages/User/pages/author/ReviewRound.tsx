import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  Stack,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Channel } from "stream-chat";
import "stream-chat-react/dist/css/index.css";
import {
  useConfirmSubmittedResultMutation,
  useGetArticleQuery,
  useUnassignedReviewerMutation,
} from "../../../../features/article";
import { useGetUserQuery } from "../../../../features/user";
import { useAppState } from "../../../../hooks/useAppState";
import { useAuth } from "../../../../hooks/useAuth";
import { ReviewRoundObject } from "../../../../interface/article.model";
import IFile from "../../../../interface/file";
import { StreamChatContext } from "../../../../main";
import { ReviewStatus } from "../../../../types";
import {
  getReviewStatusType,
  toResultRecommendationString,
  toReviewStatusString,
} from "../../../../utils";
import {
  Card,
  CircularProgressInderterminate,
  FileDisplayButton,
} from "../../../../utils/components";
import GetStreamChat from "../../../../utils/components/StreamChat/GetStreamChat";
import AuthorViewReviewSubmittedModal from "./AuthorViewReviewSubmittedModal";

const UserBox = ({ author, role }: any) => (
  <Flex
    align="center"
    minW={150}
    borderRadius={4}
    border="1px solid"
    borderColor="gray.700"
    py={4}
    px={2}
    boxShadow="lg"
  >
    <Box pr={4} pl={2}>
      <Avatar size="lg" src={author.photoURL} />
    </Box>
    <Box>
      <Text fontWeight="bold">{author.displayName}</Text>
      <Text>{author.email}</Text>
      <Tag>{role}</Tag>
    </Box>
  </Flex>
);

interface ReviewRoundProps {
  reviewRound: ReviewRoundObject;
}

const ReviewRound: FC<ReviewRoundProps> = ({ reviewRound }) => {
  const { articleId } = useParams();
  const reviewer = useGetUserQuery(reviewRound.reviewer);
  const article = useGetArticleQuery(articleId);
  const [confirmSubmittedResult, confirmSubmittedResultData] =
    useConfirmSubmittedResultMutation();
  const reviewRoundDetailModal = useDisclosure();
  const { toast } = useAppState();
  const { currentUser } = useAuth();

  if (!articleId || !reviewRound) return <CircularProgressInderterminate />;

  return (
    <>
      <Stack spacing={6}>
        <Alert
          borderRadius={2}
          status={getReviewStatusType(reviewRound.status)}
        >
          <AlertIcon />
          <Stack spacing={0}>
            <Text fontWeight={"bold"}>Trạng thái</Text>
            <Text>{toReviewStatusString(reviewRound.status)}</Text>
          </Stack>
        </Alert>
        <Box>
          <Accordion allowMultiple allowToggle>
            <Stack spacing={4}>
              <Card p={4}>
                <AccordionItem border="none">
                  <AccordionButton borderRadius={2} py={4}>
                    <Heading size="sm">Tài liệu phản biện</Heading>
                    <Spacer />
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel py={4}>
                    <Stack spacing={2}>
                      {Boolean(
                        reviewRound.displayFile || reviewRound.files?.length
                      ) ? (
                        <>
                          {reviewRound.displayFile && (
                            <FileDisplayButton
                              key="display-file"
                              file={reviewRound.displayFile}
                            />
                          )}
                          {Boolean(reviewRound.files?.length) && (
                            <>
                              <Heading size="xs">Tài liệu hỗ trợ</Heading>
                              {reviewRound.files?.map((file: IFile, index) => (
                                <FileDisplayButton
                                  key={`helper-file-${index}`}
                                  file={file}
                                />
                              ))}
                            </>
                          )}
                        </>
                      ) : (
                        <Text textAlign={"center"}>
                          Không có tệp tin nào được gửi
                        </Text>
                      )}
                    </Stack>
                  </AccordionPanel>
                </AccordionItem>
              </Card>
              {(reviewRound.status === ReviewStatus.reviewSubmitted ||
                reviewRound.status === ReviewStatus.confirmed) && (
                <>
                  <Alert
                    borderRadius={2}
                    status="success"
                    variant="left-accent"
                  >
                    <AlertIcon />
                    <Stack spacing={0}>
                      <AlertTitle mr={2}>
                        {toReviewStatusString(reviewRound.status)}
                      </AlertTitle>
                      <AlertDescription>
                        Đề xuất:{" "}
                        {toResultRecommendationString(
                          reviewRound.result?.recommendations
                        )}
                      </AlertDescription>
                    </Stack>
                    <Spacer />
                    <Button
                      colorScheme={"green"}
                      onClick={reviewRoundDetailModal.onOpen}
                    >
                      Xem đánh giá
                    </Button>
                  </Alert>
                </>
              )}
            </Stack>
          </Accordion>
        </Box>
      </Stack>
      <AuthorViewReviewSubmittedModal
        {...{ ...reviewRoundDetailModal, reviewRound }}
        article={article.data}
        isLoading={confirmSubmittedResultData.isLoading}
      />
    </>
  );
};

export default ReviewRound;
