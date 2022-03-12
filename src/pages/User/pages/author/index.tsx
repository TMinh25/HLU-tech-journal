import {
  Box,
  Flex,
  Heading,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "../../../../utils/components";
import { useSteps } from "../../../../utils/components/Steps";
import Step from "../../../../utils/components/Steps/Step";
import StepContent from "../../../../utils/components/Steps/StepContent";
import Steps from "../../../../utils/components/Steps/Steps";
import GetStreamChat from "../../../../utils/components/StreamChat/GetStreamChat";
import ReviewStage from "./ReviewStage";

const AuthorArticleDetail: FC = () => {
  const { articleId } = useParams();
  const article = useGetArticleQuery(articleId);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const streamChatClient = useContext(StreamChatContext);
  const [channel, setChannel] = useState<Channel>();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      title: "Bản thảo bị từ chối",
      description: "Bản thảo của bạn đã bị từ chối và sẽ không được xuất bản",
      children: (
        <Stack>
          <Stack>
            <Heading>Lí do</Heading>
            {article.data?.detail?.reject?.reason && (
              <Text>{article.data?.detail?.reject?.reason}</Text>
            )}
          </Stack>
        </Stack>
      ),
    },
    {
      status: ArticleStatus.submission,
      helperTitle: article.data?.status === "reject" ? "Không đồng ý" : "",
      title: "Nộp bản thảo",
      description:
        "Đây là giai đoạn bạn vừa nộp bản thảo và đang đợi ban biên tập tạp chí chấp nhận bản thảo để đánh giá.",
    },
    {
      status: ArticleStatus.review,
      title: "Phản biện đánh giá",
      description:
        "Ban biên tập và phản biện thực hiện quá trình đánh giá bản thảo.",
      children: <ReviewStage />,
    },
    {
      status: ArticleStatus.publishing,
      title: "Đang xuất bản",
      description:
        "Ban biên tập sẽ bắt đầu xuất bản tạp chí lên tạp chí mà bạn đã chọn nộp bản thảo. Một số chỉnh sửa sẽ cần thiết trong bước này",
    },
    {
      title: "Xuất bản",
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

  return (
    <BigContainer>
      <Stack spacing={4}>
        <Flex align="center">
          <Heading size="lg">{article.data?.title}</Heading>
          <Tag ml={4}>{steps[currentStep].title}</Tag>
        </Flex>

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
      </Stack>
    </BigContainer>
  );
};

export default AuthorArticleDetail;
