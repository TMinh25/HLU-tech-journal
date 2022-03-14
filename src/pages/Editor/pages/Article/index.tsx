import { ChevronDownIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  Textarea,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { MdOutlineNavigateNext } from "react-icons/md";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  useEditorResponseMutation,
  useGetArticleQuery,
} from "../../../../features/article";
import { useAppState } from "../../../../hooks/useAppState";
import { useAuth } from "../../../../hooks/useAuth";
import { ArticleStatus, ReviewStatus, Role } from "../../../../types";
import { getArticleStatusType, toArticleStatusString } from "../../../../utils";
import { BigContainer } from "../../../../utils/components";
import NotFound from "../../../404";
import CompletedStage from "./CompletedStage";
import PublishingStage from "./PublishingStage";
import ReviewStage from "./ReviewStage";
import SendToPublishingModal from "./SendToPublishingModal";
import SubmissionStage from "./SubmissionStage";

const steps = [
  // { status: ArticleStatus.submission, label: "Nộp bản thảo" },
  { status: ArticleStatus.submission, label: "Nhận bản thảo" },
  { status: ArticleStatus.review, label: "Đánh giá bản thảo" },
  { status: ArticleStatus.publishing, label: "Hoàn thiện bài báo" },
];

const indexArticleStatus = (articleStatus: string | undefined) => {
  switch (articleStatus) {
    case ArticleStatus.submission:
    case ArticleStatus.reject:
      return 0;
    case ArticleStatus.review:
      return 1;
    case ArticleStatus.publishing:
      return 2;
    case ArticleStatus.completed:
      return 3;
    default:
      return -1;
  }
};

const EditorArticle = (props: any) => {
  const { articleId } = useParams();
  const article = useGetArticleQuery(articleId);
  const { role } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setTabIndex(indexArticleStatus(article?.data?.status));
  }, [article.data?.status]);

  const publishingModal = useDisclosure();
  const confirmCompleteAlert = useDisclosure();
  const confirmPublishingModal = useDisclosure();
  const cancelRef = useRef(null);
  const rejectArticleModal = useDisclosure();
  const [rejectArticle, rejectArticleData] = useEditorResponseMutation();
  const { toast } = useAppState();

  async function handleRejectArticle() {
    if (reason) {
      try {
        await rejectArticle({
          _id: articleId || "",
          accept: 0,
          reason,
          notes,
        }).unwrap();
        toast({
          status: "warning",
          title: "Không chấp nhận bản thảo",
          description: "Bài báo vẫn được lưu trữ",
        });
        rejectArticleModal.onClose();
      } catch (error: any) {
        toast({
          status: "error",
          title: error.message,
        });
      }
      article.refetch();
    }
  }

  if (article.isError) return <NotFound />;
  const roleHref = role === 1 ? "admin" : "editor";

  return (
    <>
      <BigContainer>
        <Skeleton h={800} isLoaded={!article.isLoading}>
          <Flex mb={2} align="center">
            <Box>
              <Breadcrumb>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    as={Link}
                    to={`/${roleHref}/journal-group/${article.data?.journalGroup._id}`}
                  >
                    {article.data?.journalGroup.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    as={Link}
                    to={`/${roleHref}/journal/${article.data?.journal._id}`}
                  >
                    {article.data?.journal.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              {/* <Heading
                size="sm"
                color={useColorModeValue("gray.600", "gray.400")}
              ></Heading> */}
              <Heading as="h3" size="md" lineHeight={1.5}>
                {article.data?.title}
                <Tag
                  ml={3}
                  mt={1}
                  colorScheme={
                    getArticleStatusType(article.data?.status) === "error"
                      ? "red"
                      : getArticleStatusType(article.data?.status) === "warning"
                      ? "yellow"
                      : "green"
                  }
                >
                  {toArticleStatusString(article.data?.status)}
                </Tag>
              </Heading>
              <Text as="span" color="gray" fontSize="md">
                {article.data?.authors.main.displayName}
              </Text>
            </Box>
            <Spacer />
            {article.data?.status !== ArticleStatus.completed &&
              article.data?.status !== ArticleStatus.reject &&
              role === Role.editors && (
                <Menu placement="bottom-end" isLazy>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Hành Động
                  </MenuButton>
                  <MenuList>
                    <MenuGroup title="Yêu cầu">
                      <MenuItem>Chỉnh sửa</MenuItem>
                      {article.data?.status === ArticleStatus.review && (
                        <MenuItem>Gửi lại bản thảo & Đánh giá</MenuItem>
                      )}
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup title="Hành động">
                      {article.data?.status === ArticleStatus.review && (
                        <MenuItem
                          icon={<Icon as={BsCheckLg} />}
                          iconSpacing={4}
                          onClick={
                            article.data?.detail?.review?.some(
                              (r) =>
                                r.status === ReviewStatus.reviewing ||
                                r.status === ReviewStatus.request
                            ) || article.data?.detail?.review?.length == 0
                              ? confirmPublishingModal.onOpen
                              : publishingModal.onOpen
                          }
                          bgColor={useColorModeValue(
                            "green.100",
                            "rgba(154, 255, 180, 0.4)"
                          )}
                          _hover={{
                            bgColor: useColorModeValue(
                              "green.300",
                              "rgba(154, 255, 180, 0.6)"
                            ),
                          }}
                        >
                          Chuyển tiếp tới hoàn thiện bài báo
                        </MenuItem>
                      )}
                      {article.data?.status === ArticleStatus.publishing && (
                        <MenuItem
                          icon={<Icon as={BsCheckLg} />}
                          iconSpacing={4}
                          onClick={confirmCompleteAlert.onOpen}
                          bgColor={useColorModeValue(
                            "green.100",
                            "rgba(154, 255, 180, 0.4)"
                          )}
                          _hover={{
                            bgColor: useColorModeValue(
                              "green.300",
                              "rgba(154, 255, 180, 0.6)"
                            ),
                          }}
                        >
                          Xuất bản bài báo
                        </MenuItem>
                      )}
                      {article.data?.status !== ArticleStatus.completed && (
                        <MenuItem
                          icon={<SmallCloseIcon />}
                          iconSpacing={4}
                          bgColor={useColorModeValue(
                            "red.100",
                            "rgba(254, 150, 150, 0.4)"
                          )}
                          _hover={{
                            bgColor: useColorModeValue(
                              "red.300",
                              "rgba(254, 150, 150, 0.6)"
                            ),
                          }}
                          onClick={rejectArticleModal.onOpen}
                        >
                          Từ chối bản thảo
                        </MenuItem>
                      )}
                    </MenuGroup>
                  </MenuList>
                </Menu>
              )}
          </Flex>
          <Box>
            <Tabs
              isFitted
              isLazy
              lazyBehavior="keepMounted"
              index={tabIndex}
              onChange={(index) => setTabIndex(index)}
              variant="soft-rounded"
              colorScheme={"green"}
            >
              <TabList>
                {steps.map((step, index) => (
                  <Tab
                    isDisabled={
                      role === Role.admin
                        ? false
                        : index > indexArticleStatus(article?.data?.status)
                    }
                    border="2px"
                    borderRadius={4}
                    borderColor={
                      index <= indexArticleStatus(article?.data?.status) ||
                      article.data?.status == ArticleStatus.completed
                        ? "green.600"
                        : role === Role.admin
                        ? "green.600"
                        : "yellow.600"
                    }
                    key={"tab-" + index}
                    mx={1}
                    fontSize="lg"
                  >
                    {step.label}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SubmissionStage />
                </TabPanel>
                <TabPanel>
                  <ReviewStage />
                </TabPanel>
                <TabPanel>
                  <PublishingStage
                    confirmCompleteAlert={confirmCompleteAlert}
                  />
                </TabPanel>
                <TabPanel>
                  <CompletedStage />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Skeleton>
      </BigContainer>
      <SendToPublishingModal {...publishingModal} articleId={articleId} />

      <AlertDialog
        isCentered
        isOpen={confirmPublishingModal.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={confirmPublishingModal.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Chắc chắn chuyển tiếp sang bước xuất bản?
            </AlertDialogHeader>

            <AlertDialogBody color={useColorModeValue("gray.600", "gray.400")}>
              <Stack>
                <Text>
                  Bạn chưa hoàn thành một đánh giá của phản biện hoặc có một số
                  đánh giá chưa hoàn thành, bạn chắc chắn muốn tiếp tục chứ?
                </Text>
                <Text>Nếu tiếp tục, các đánh giá đó sẽ bị gỡ</Text>
              </Stack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={confirmPublishingModal.onClose}>
                Hủy
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  confirmPublishingModal.onClose();
                  publishingModal.onOpen();
                }}
                ml={3}
              >
                Tiếp tục
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal
        isCentered
        isOpen={rejectArticleModal.isOpen}
        onClose={rejectArticleModal.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Từ chối bản thảo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Lí do</FormLabel>
              <Input
                value={reason}
                onChange={({ target }) => setReason(target.value)}
                placeholder="Lí do"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Ghi chú</FormLabel>
              <Textarea
                value={notes}
                onChange={({ target }) => setNotes(target.value)}
                placeholder="Ghi chú"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={rejectArticleModal.onClose}
              mr={3}
              isLoading={rejectArticleData.isLoading}
            >
              Hủy
            </Button>
            <Button
              isDisabled={!reason}
              onClick={handleRejectArticle}
              colorScheme="red"
              isLoading={rejectArticleData.isLoading}
            >
              Từ chối bản thảo
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditorArticle;
