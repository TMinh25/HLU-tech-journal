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
import { isEmptyObject } from "../../../../utils";
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
              <Heading size="sm">T??i li???u</Heading>
              <Stack>
                {r.files.map((f) => (
                  <FileDisplayButton file={f} />
                ))}
              </Stack>
            </Stack>
            <Stack>
              <Heading size="sm">T??i li???u ho??n thi???n c???a t??c gi???</Heading>
              {r?.responseFile ? (
                <FileDisplayButton
                  colorScheme={"green"}
                  file={r.responseFile}
                />
              ) : (
                <Tag w="fit-content" colorScheme={"red"}>
                  Ch??a tr??? l???i
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
                  N???p t??i li???u ???? ho??n thi???n
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
            <Heading size="sm">L?? do</Heading>
            <Input
              isDisabled
              defaultValue={article.data?.detail?.reject?.reason}
            />
          </Stack>
        )}
        {article.data?.detail?.reject?.notes && (
          <Stack>
            <Heading size="sm">Ghi ch??</Heading>
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
      title: "B???n th???o b??? t??? ch???i",
      description:
        article.data?.status === "reject"
          ? "B???n th???o c???a b???n ???? b??? t??? ch???i v?? s??? kh??ng ???????c xu???t b???n"
          : "",
      colorScheme: "red",
      children: <Rejects />,
    },
    {
      status: ArticleStatus.submission,
      helperTitle: article.data?.status === "reject" ? "Kh??ng ?????ng ??" : "",
      title: "N???p b???n th???o",
      colorScheme: "yellow",
      description:
        "????y l?? giai ??o???n b???n v???a n???p b???n th???o v?? ??ang ?????i ban bi??n t???p s??? ch???p nh???n b???n th???o ????? ????nh gi??.",
    },
    {
      status: ArticleStatus.review,
      title: "Ph???n bi???n ????nh gi??",
      colorScheme: "yellow",
      description:
        "Ban bi??n t???p v?? ph???n bi???n th???c hi???n qu?? tr??nh ????nh gi?? b???n th???o.",
      children: <ReviewStage />,
    },
    {
      status: ArticleStatus.publishing,
      title: "Ho??n thi???n b??i b??o",
      colorScheme: "yellow",
      description:
        "Ban bi??n t???p s??? b???t ?????u xu???t b???n s??? l??n s??? m?? b???n ???? ch???n n???p b???n th???o. M???t s??? ch???nh s???a s??? c???n thi???t trong b?????c n??y",
      children: <Revisions />,
    },
    {
      title: "Xu???t b???n",
      colorScheme: "green",
      description:
        "B???n th???o c???a b???n ???? ???????c xu???t b???n v?? hi???n th??? tr??n trang web",
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
            B???n kh??ng ph???i t??c gi??? c???a b??i b??o n??y!
          </Heading>
          <Text color={"gray.500"}>
            Vui l??ng kh??ng truy c???p v??o nh???ng b??i b??o b???n kh??ng ph???i t??c gi???.
            H??y quay tr??? l???i
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
            Trang ch???
          </Button>
        </Box>
      </BigContainer>
    );

  return (
    <>
      <BigContainer>
        <Stack spacing={4}>
          <Flex align="center">
            <Heading size="lg">
              {article.data?.title}
              <Tag ml={4} colorScheme={steps[currentStep].colorScheme}>
                {steps[currentStep].title}
              </Tag>
            </Heading>
          </Flex>

          {article.data?.tags?.length && (
            <Stack>
              <Heading size="sm">Ch??? m???c</Heading>
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
              Tr???ng th??i
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
              <Heading size="sm">T??i li???u ph???n bi???n</Heading>
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
                      <Heading size="xs">T??i li???u h??? tr???</Heading>
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
                  {isEmptyObject(article.data?.publishedFile) && (
                    <>
                      <Heading size="xs">T??i li???u xu???t b???n</Heading>
                      {/* remove duplicate files */}
                      <FileDisplayButton
                        key={`published-file`}
                        file={article.data?.publishedFile}
                        displayId
                      />
                    </>
                  )}
                </>
              ) : (
                <Text textAlign={"center"}>Kh??ng c?? t???p tin n??o ???????c g???i</Text>
              )}
            </Stack>
          </Card>

          {(article.data?.status === ArticleStatus.review ||
            article.data?.status === ArticleStatus.publishing) && (
            <Card p={4}>
              <Stack spacing={4}>
                <Flex align="center">
                  <Heading size="sm">
                    Th???o lu???n<Text as="span"> - </Text>
                    <Text
                      as="span"
                      color={useColorModeValue("gray.600", "gray.400")}
                    >
                      ph???n bi???n
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
                    K???t n???i
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
