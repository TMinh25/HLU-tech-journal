import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spacer,
  Stack,
  Tag,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Channel } from "stream-chat";
import { useGetArticleQuery } from "../../../../features/article";
import { useAuth } from "../../../../hooks/useAuth";
import IFile from "../../../../interface/file";
import { StreamChatContext } from "../../../../main";
import { ArticleStatus } from "../../../../types";
import {
  BigContainer,
  Card,
  FileDisplayButton,
  TagsComponent,
} from "../../../../utils/components";
import { useSteps } from "../../../../utils/components/Steps";
import Step from "../../../../utils/components/Steps/Step";
import StepContent from "../../../../utils/components/Steps/StepContent";
import Steps from "../../../../utils/components/Steps/Steps";
import GetStreamChat from "../../../../utils/components/StreamChat/GetStreamChat";
import { ResponseRevisionModal } from "./ResponseRevisionModal";
import ReviewStage from "./ReviewStage";

const AuthorArticleDetail: FC = () => {
  const { articleId } = useParams();
  const article = useGetArticleQuery(articleId);
  const { currentUser, authenticated } = useAuth();
  const [channel, setChannel] = useState<Channel>();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentRevision, setCurrentRevision] = useState<{
    _id?: string;
    text?: string;
    files: IFile[];
    responseFile?: IFile;
  }>();
  const [chatChannel, setChatChannel] = useState<Channel>();
  const streamChatClient = useContext(StreamChatContext);
  const responseRevisionModal = useDisclosure();

  const getChannelForAuthor = async () => {
    setIsChatLoading(true);
    if (currentUser && article.data && !chatChannel) {
      const chatChannel = streamChatClient.channel("messaging", {
        members: [
          currentUser._id,
          ...[
            ...new Set(article.data.detail?.review?.map((r) => r.editor) || []),
          ],
        ],
      });

      await chatChannel.watch();
      setChatChannel(chatChannel);
    }
    setIsChatLoading(false);
  };

  useEffect(() => {
    return function cleanup() {
      if (chatChannel) {
        setIsChatLoading(true);
        chatChannel.stopWatching();
        setIsChatLoading(false);
      }
    };
  }, []);

  const Revisions = () => (
    <Stack>
      {article.data?.detail?.publishing.request.map((r) => (
        <Card>
          <Stack>
            <Text>{r.text}</Text>
            <Stack>
              <Heading size="sm">Tài liệu</Heading>
              <Stack>
                {r.files.map((f) => (
                  <FileDisplayButton file={f} />
                ))}
              </Stack>
            </Stack>
            <Stack>
              <Heading size="sm">Tài liệu hoàn thiện của tác giả</Heading>
              {r?.responseFile ? (
                <FileDisplayButton
                  colorScheme={"green"}
                  file={r.responseFile}
                />
              ) : (
                <Tag w="fit-content" colorScheme={"red"}>
                  Chưa trả lời
                </Tag>
              )}
              {!r.responseFile && (
                <Button
                  colorScheme={"yellow"}
                  onClick={() => {
                    setCurrentRevision(r);
                    responseRevisionModal.onOpen();
                  }}
                >
                  Nộp tài liệu đã hoàn thiện
                </Button>
              )}
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  );

  const Rejects = () => (
    <Stack>
      <Stack>
        {article.data?.detail?.reject?.reason && (
          <Stack>
            <Heading size="sm">Lí do</Heading>
            <Input
              isDisabled
              defaultValue={article.data?.detail?.reject?.reason}
            />
          </Stack>
        )}
        {article.data?.detail?.reject?.notes && (
          <Stack>
            <Heading size="sm">Ghi chú</Heading>
            <Textarea
              isDisabled
              h="fit-content"
              defaultValue={article.data?.detail?.reject?.notes}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );

  const steps = [
    {
      title: "Bản thảo bị từ chối",
      description:
        article.data?.status === "reject"
          ? "Bản thảo của bạn đã bị từ chối và sẽ không được xuất bản"
          : "",
      colorScheme: "red",
      children: <Rejects />,
    },
    {
      status: ArticleStatus.submission,
      helperTitle: article.data?.status === "reject" ? "Không đồng ý" : "",
      title: "Nộp bản thảo",
      colorScheme: "yellow",
      description:
        "Đây là giai đoạn bạn vừa nộp bản thảo và đang đợi ban biên tập số chấp nhận bản thảo để đánh giá.",
    },
    {
      status: ArticleStatus.review,
      title: "Phản biện đánh giá",
      colorScheme: "yellow",
      description:
        "Ban biên tập và phản biện thực hiện quá trình đánh giá bản thảo.",
      children: <ReviewStage />,
    },
    {
      status: ArticleStatus.publishing,
      title: "Hoàn thiện bài báo",
      colorScheme: "yellow",
      description:
        "Ban biên tập sẽ bắt đầu xuất bản số lên số mà bạn đã chọn nộp bản thảo. Một số chỉnh sửa sẽ cần thiết trong bước này",
      children: <Revisions />,
    },
    {
      title: "Xuất bản",
      colorScheme: "green",
      description:
        "Bản thảo của bạn đã được xuất bản và hiển thị trên trang web",
    },
  ];

  const { activeStep, setStep } = useSteps({
    initialStep: 1,
  });

  useEffect(() => {
    if (!article.isLoading) {
      const step =
        article.data?.status === ArticleStatus.reject
          ? 0
          : steps.findIndex((s) => s.status === article.data?.status) != -1
          ? steps.findIndex((s) => s.status === article.data?.status)
          : article.data?.visible === true
          ? 3
          : 2;
      setCurrentStep(step);
      setStep(step);
    }
  }, [article.isLoading]);

  if (
    !article.isLoading &&
    authenticated &&
    article.data?.authors.main._id !== currentUser?._id
  )
    return (
      <BigContainer>
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
            Bạn không phải tác giả của bài báo này!
          </Heading>
          <Text color={"gray.500"}>
            Vui lòng không truy cập vào những bài báo bạn không phải tác giả.
            Hãy quay trở lại
          </Text>
          <Button
            mt={6}
            colorScheme="teal"
            bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
            color="white"
            variant="solid"
            as={Link}
            to="/"
          >
            Trang chủ
          </Button>
        </Box>
      </BigContainer>
    );

  return (
    <>
      <BigContainer>
        <Stack spacing={4}>
          <Flex align="center">
<<<<<<< HEAD
            <Heading size="lg" >
              {article.data?.title}
              <Tag ml={4} colorScheme={steps[currentStep].colorScheme}>
                {steps[currentStep].title}
              </Tag>
            </Heading>
=======
            <Heading size="lg">{article.data?.title}</Heading>
            <Tag ml={4} colorScheme={steps[currentStep].colorScheme}>
              {steps[currentStep].title}
            </Tag>
>>>>>>> 165182b955d19798f8d3fd92cb4876eb916f0780
          </Flex>

          {article.data?.tags?.length && (
            <Stack>
              <Heading size="sm">Chỉ mục</Heading>
              <TagsComponent tags={article.data?.tags} />
            </Stack>
          )}

          <Box>
            <Text color={useColorModeValue("gray.600", "gray.400")}>
              {article.data?.abstract}
            </Text>
          </Box>

          <Card py={{ base: "3", md: "4" }}>
            <Heading size="md" mb={4}>
              Trạng thái
            </Heading>
            <Steps setStep={setStep} activeStep={activeStep}>
              {steps.map((step) => (
                <Step title={step.title} helperTitle={step?.helperTitle}>
                  <StepContent>
                    <Stack>
                      <Text>{step.description}</Text>
                      {step.children && step.children}
                    </Stack>
                  </StepContent>
                </Step>
              ))}
            </Steps>
          </Card>

          <Card>
            <Stack spacing={2}>
              <Heading size="sm">Tài liệu phản biện</Heading>
              {Boolean(article.data?.files) ? (
                <>
                  {article.data?.currentFile && (
                    <FileDisplayButton
                      key="display-file"
                      file={article.data?.currentFile}
                      displayId
                    />
                  )}
                  {Boolean(article.data?.files) && (
                    <>
                      <Heading size="xs">Tài liệu hỗ trợ</Heading>
                      {/* remove duplicate files */}
                      {Array.from<IFile>(article.data?.files || []).map(
                        (file, index) => (
                          <FileDisplayButton
                            key={`helper-file-${index}`}
                            file={file}
                            displayId
                          />
                        )
                      )}
                    </>
                  )}
                </>
              ) : (
                <Text textAlign={"center"}>Không có tệp tin nào được gửi</Text>
              )}
            </Stack>
          </Card>

          {(article.data?.status === ArticleStatus.review ||
            article.data?.status === ArticleStatus.publishing) && (
            <Card p={4}>
              <Stack spacing={4}>
                <Flex align="center">
                  <Heading size="sm">
                    Thảo luận<Text as="span"> - </Text>
                    <Text
                      as="span"
                      color={useColorModeValue("gray.600", "gray.400")}
                    >
                      phản biện
                    </Text>
                  </Heading>
                  <Spacer />
                  <Button
                    rounded={"full"}
                    aria-label="load chat"
                    // icon={<RepeatIcon />}
                    onClick={getChannelForAuthor}
                    isLoading={isChatLoading}
                    isDisabled={Boolean(channel !== undefined)}
                  >
                    Kết nối
                  </Button>
                </Flex>
                {chatChannel && (
                  <>
                    <GetStreamChat
                      isLoading={isChatLoading}
                      streamChatClient={streamChatClient}
                      channel={chatChannel}
                    />
                  </>
                )}
              </Stack>
            </Card>
          )}
        </Stack>
      </BigContainer>
      <ResponseRevisionModal
        {...responseRevisionModal}
        {...{ articleId, currentRevision }}
      />
    </>
  );
};

export default AuthorArticleDetail;
