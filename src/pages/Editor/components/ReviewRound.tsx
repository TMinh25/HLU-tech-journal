import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  SimpleGrid,
  Spacer,
  Stack,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { BsDash, BsDashLg, BsThreeDots } from "react-icons/bs";
import { FaUserSlash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Channel } from "stream-chat";
import "stream-chat-react/dist/css/index.css";
import {
  useConfirmSubmittedResultMutation,
  useGetArticleQuery,
  useUnassignedReviewerMutation,
} from "../../../features/article";
import { useGetUserQuery } from "../../../features/user";
import { useAppState } from "../../../hooks/useAppState";
import { useAuth } from "../../../hooks/useAuth";
import { ReviewRoundObject } from "../../../interface/article.model";
import IFile from "../../../interface/file";
import { StreamChatContext } from "../../../main";
import { ReviewStatus, Role } from "../../../types";
import {
  getReviewStatusType,
  toResultRecommendationString,
  toReviewStatusString,
} from "../../../utils";
import {
  FileDisplayButton,
  Card,
  CircularProgressInderterminate,
} from "../../../utils/components";
import GetStreamChat from "../../../utils/components/StreamChat/GetStreamChat";
import ReviewSubmittedDetailModal from "./ReviewSubmittedDetailModal";

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
  const [isChatLoading, setIsChatLoading] = useState({
    reviewer: false,
    author: false,
  });
  const { articleId } = useParams();
  const reviewer = useGetUserQuery(reviewRound.reviewer);
  const { currentUser, role } = useAuth();
  const article = useGetArticleQuery(articleId);
  const [confirmSubmittedResult, confirmSubmittedResultData] =
    useConfirmSubmittedResultMutation();
  const [unassignReviewer, unassignReviewerData] =
    useUnassignedReviewerMutation();
  const streamChatClient = useContext(StreamChatContext);
  const reviewRoundDetailModal = useDisclosure();
  const unassignReviewerDialog = useDisclosure();
  const { toast } = useAppState();
  const [reviewerChatChannel, setReviewerChatChannel] = useState<Channel>();
  const [authorChatChannel, setAuthorChatChannel] = useState<Channel>();

  if (!articleId || !reviewRound) return <CircularProgressInderterminate />;

  const getChannelForReviewer = async () => {
    setIsChatLoading({ ...isChatLoading, reviewer: true });
    if (currentUser && reviewer.data && !reviewerChatChannel) {
      const chatChannel = streamChatClient.channel("messaging", {
        members: [currentUser._id, reviewer.data._id],
      });
      await chatChannel.watch();
      setReviewerChatChannel(chatChannel);
    }
    setIsChatLoading({ ...isChatLoading, reviewer: false });
  };

  const getChannelForAuthor = async () => {
    setIsChatLoading({ ...isChatLoading, author: true });
    if (currentUser && article.data?.authors.main && !authorChatChannel) {
      const chatChannel = streamChatClient.channel("messaging", {
        members: [currentUser._id, article.data.authors.main._id],
      });
      await chatChannel.watch();
      setAuthorChatChannel(chatChannel);
    }
    setIsChatLoading({ ...isChatLoading, author: false });
  };

  useEffect(() => {
    (async () => {
      if (role === Role.editors) {
        getChannelForReviewer();
        getChannelForAuthor();
      }
    })();

    return function cleanup() {
      setIsChatLoading({ reviewer: true, author: true });
      reviewerChatChannel?.stopWatching();
      authorChatChannel?.stopWatching();
      setIsChatLoading({ reviewer: false, author: false });
    };
  }, [article.data, currentUser]);

  const handleUnassignReviewer = useCallback(async () => {
    try {
      if (articleId) {
        const result = await unassignReviewer({
          _id: articleId,
          _roundId: reviewRound._id,
        }).unwrap();
        toast({ status: "success", title: result.message });
        unassignReviewerDialog.onClose();
        article.refetch();
      }
    } catch (error: any) {
      toast({ status: "error", title: error.data.message });
    }
  }, [articleId, reviewRound]);

  async function onConfirm(data: boolean) {
    try {
      const confirm = data ? 1 : 0;
      console.log(confirm);
      const result = await confirmSubmittedResult({
        _id: articleId,
        _roundId: reviewRound._id,
        confirm,
      }).unwrap();
      article.refetch();
      toast({
        status: "success",
        title: "Thành công",
        description: result.message,
      });
      reviewRoundDetailModal.onClose();
    } catch (error: any) {
      toast({
        status: "error",
        title: "Đã có lỗi xảy ra!",
        description: error.data.message || undefined,
      });
    }
  }

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
          <Spacer />
          <Menu placement="bottom-end">
            <MenuButton
              as={IconButton}
              aria-label="review-round-action"
              icon={<Icon as={BsThreeDots} />}
            />
            <Portal>
              <MenuList>
                <MenuItem
                  icon={<Icon as={FaUserSlash} />}
                  onClick={unassignReviewerDialog.onOpen}
                >
                  Gỡ phản biện
                </MenuItem>
                {/* <MenuItem icon={<EditIcon />} command="⌘O">
                  Open File...
                </MenuItem> */}
              </MenuList>
            </Portal>
          </Menu>
        </Alert>
        <Box>
          <Accordion allowMultiple allowToggle defaultIndex={[0]}>
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
              <Card p={4}>
                <AccordionItem border="none">
                  <AccordionButton borderRadius={2} py={4}>
                    <Heading size="sm">Thành viên</Heading>
                    <Spacer />
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel py={4}>
                    <SimpleGrid columns={[1, null, 2, 3]} spacing={6}>
                      {reviewer.data && (
                        <UserBox author={reviewer.data} role="Phản biện" />
                      )}
                      {article.data && (
                        <>
                          <UserBox
                            author={article.data.authors.main}
                            role="Tác giả chính"
                          />
                          {article.data?.authors.sub?.map((author) => (
                            <UserBox
                              author={author}
                              role="Tác giả phụ & người đóng góp"
                            />
                          ))}
                        </>
                      )}
                    </SimpleGrid>
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
              {role === Role.editors && (
                <>
                  <Card p={4}>
                    <AccordionItem border="none">
                      <AccordionButton
                        borderRadius={2}
                        py={4}
                        onClick={getChannelForReviewer}
                      >
                        <Heading size="sm">
                          Thảo luận
                          <Text as="span"> - </Text>
                          <Text
                            as="span"
                            color={useColorModeValue("gray.600", "gray.400")}
                          >
                            phản biện
                          </Text>
                        </Heading>
                        <Spacer />
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel py={4} px={0} position="relative">
                        <GetStreamChat
                          isLoading={isChatLoading.reviewer}
                          streamChatClient={streamChatClient}
                          channel={reviewerChatChannel}
                        />
                      </AccordionPanel>
                    </AccordionItem>
                  </Card>

                  {currentUser?._id !== article.data?.authors.main._id && (
                    <Card p={4}>
                      <AccordionItem border="none">
                        <AccordionButton
                          borderRadius={2}
                          py={4}
                          onClick={getChannelForAuthor}
                        >
                          <Heading size="sm">
                            Thảo luận
                            <Text as="span"> - </Text>
                            <Text
                              as="span"
                              color={useColorModeValue("gray.600", "gray.400")}
                            >
                              tác giả
                            </Text>
                          </Heading>
                          <Spacer />
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel py={4} px={0} position="relative">
                          <GetStreamChat
                            isLoading={isChatLoading.author}
                            streamChatClient={streamChatClient}
                            channel={authorChatChannel}
                          />
                        </AccordionPanel>
                      </AccordionItem>
                    </Card>
                  )}
                </>
              )}
            </Stack>
          </Accordion>
        </Box>
      </Stack>
      <ReviewSubmittedDetailModal
        {...{ ...reviewRoundDetailModal, reviewRound, onConfirm }}
        article={article.data}
        isLoading={confirmSubmittedResultData.isLoading}
      />
      <UnassignReviewRoundDialog
        {...unassignReviewerDialog}
        isLoading={unassignReviewerData.isLoading}
        onSubmit={handleUnassignReviewer}
      />
    </>
  );
};

const UnassignReviewRoundDialog: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const cancelRef = useRef(null);
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Gỡ phản biện khỏi vòng này?
          </AlertDialogHeader>

          <AlertDialogBody>
            Hãy chắc chắn rằng bạn muốn gỡ phản biện khỏi vòng phản biện này. Họ
            có thể thấy rằng họ đã bị gỡ khỏi vòng phản biện.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} isLoading={isLoading} onClick={onClose}>
              Hủy
            </Button>
            <Button
              colorScheme="red"
              isLoading={isLoading}
              onClick={onSubmit}
              ml={3}
            >
              Gỡ phản biện
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ReviewRound;
