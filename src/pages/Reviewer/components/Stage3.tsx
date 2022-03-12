import { CheckIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Select,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import {
  useGetArticleQuery,
  useReviewSubmitMutation,
} from "../../../features/article";
import { useUploadFileMutation } from "../../../features/fileUpload";
import { useAppState } from "../../../hooks/useAppState";
import IFile from "../../../interface/file";
import { ReviewResult } from "../../../types";
import { toResultRecommendationString } from "../../../utils";
import {
  Card,
  CircularProgressInderterminate,
  FileDisplayButton,
  FormControlComponent,
} from "../../../utils/components";
import NotFound from "../../404";
import SendReviewResultModal from "./SendReviewResultModal";

const initialResult = {
  commentForEditors: "",
  commentForEveryone: "",
  files: [],
  recommendations: "",
  otherRecommendation: "",
};

const StageThree: FC<{
  toStage: (stage: number) => void;
}> = ({ toStage }) => {
  const prevStage = 1;
  const nextStage = 3;
  const { articleId, roundId } = useParams();
  const article = useGetArticleQuery(articleId);

  let roundIndex = -1;
  const reviewRound = useMemo(() => {
    if (article.data?.detail?.review && roundId) {
      roundIndex = article.data?.detail?.review?.findIndex(
        (r) => r._id === roundId
      );
      return article.data?.detail?.review![roundIndex];
    }
  }, [article.data?.detail?.review]);
  const [fileUpload, fileUploadData] = useUploadFileMutation();
  const [submitReview, submitReviewData] = useReviewSubmitMutation();
  const { toast } = useAppState();
  const sendReviewModal = useDisclosure();

  if (!roundId || !articleId || !reviewRound) return <NotFound />;

  const savedLocalResult = localStorage.getItem(
    `review-stage-${articleId}-${roundId}`
  );

  const [result, setResult] = useState<{
    commentForEditors?: string;
    commentForEveryone?: string;
    files: IFile[];
    recommendations: string;
    otherRecommendation?: string;
  }>(savedLocalResult ? JSON.parse(savedLocalResult) : initialResult);

  const onSendReview = async () => {
    try {
      const response = await submitReview({
        ...result,
        _roundId: roundId,
        _id: articleId,
      }).unwrap();
      toast({ status: "success", title: response.message });
      sendReviewModal.onClose();
      toStage(nextStage);
    } catch (error) {
      toast({ status: "error", title: "Đã có lỗi xảy ra!" });
    }
  };

  const onRemoveFile = (index: number) => {
    if (index >= 0) {
      const newFiles = [...result.files];
      newFiles.splice(index, 1);
      setResult({ ...result, files: newFiles });
    }
  };

  useEffect(() => {
    const stageStorage = JSON.parse(
      localStorage.getItem(`review-stage-${articleId}-${roundIndex}`) || "{}"
    );
    let timeOutId: NodeJS.Timeout;
    if (JSON.stringify(result) != JSON.stringify(stageStorage)) {
      timeOutId = setTimeout(() => {
        localStorage.setItem(
          `review-stage-${articleId}-${roundIndex}`,
          JSON.stringify({ ...stageStorage, ...result })
        );
        // toast({
        //   status: "success",
        //   title: "Đã lưu vào bản thảo đang đánh giá!",
        //   duration: 2000,
        // });
      }, 1000);
    }
    return () => clearTimeout(timeOutId);
  }, [result]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const uploadFilePromises = acceptedFiles.map((file) => {
        try {
          const formData = new FormData();
          formData.append("file", file, file.name);
          return fileUpload(formData).unwrap();
        } catch (error) {
          return Promise.reject(error);
        }
      });
      try {
        const uploadAllFileResponses = await Promise.all(uploadFilePromises);
        setResult({
          ...result,
          files: [...result.files, ...uploadAllFileResponses],
        });
        toast({
          status: "success",
          title: `Tải lên ${uploadAllFileResponses.length} file thành công!`,
        });
      } catch (error) {
        toast({ status: "error", title: "Tải file thất bại" });
        console.error(error);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: [
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
    ],
    maxFiles: 5,
    multiple: true,
  });

  return (
    <>
      <Accordion allowMultiple allowToggle>
        <Stack spacing={6}>
          <Heading size="lg" mb={4}>
            Đánh giá
          </Heading>
          <Card>
            <AccordionItem border="none">
              <AccordionButton borderRadius={4}>
                <AccordionIcon mr={3} />
                <Heading size="md">Bản thảo</Heading>
              </AccordionButton>
              <AccordionPanel py={4}>
                {/* <Button
                  w="100%"
                  as="a"
                  href={reviewRound?.displayFile?.downloadUri}
                  isTruncated
                >
                  <Text>
                    <AttachmentIcon mr={4} />
                    {reviewRound?.displayFile?.title}
                  </Text>
                  <Spacer />
                  <Text isTruncated>{reviewRound?.displayFile?._id}</Text>
                </Button> */}
                <Stack>
                  <FileDisplayButton
                    file={reviewRound?.displayFile}
                    displayId
                  />
                  {reviewRound?.files && (
                    <>
                      <Heading size="xs">Tài liệu hỗ trợ</Heading>
                      {reviewRound?.files?.map((f) => (
                        <FileDisplayButton file={f} displayId />
                      ))}
                    </>
                  )}
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Card>
          <Heading size="md">Đánh giá của bạn</Heading>
          <Text color="gray">Điền đánh giá của bạn vào mẫu bên dưới.</Text>
          <Box>
            <FormControlComponent
              id="commentForEveryone"
              helperText="Dành cho tác giả và ban biên tập"
              inputType="textarea"
              formLabel="Đánh giá cho tác giả và ban biên tập"
              value={result.commentForEveryone}
              noOfLines={5}
              onChange={({ target }: any) =>
                setResult({ ...result, commentForEveryone: target.value })
              }
            />
            <FormControlComponent
              id="commentForEditors"
              helperText="Dành cho ban biên tập"
              inputType="textarea"
              formLabel="Đánh giá cho ban biên tập"
              value={result.commentForEditors}
              noOfLines={5}
              onChange={({ target }: any) =>
                setResult({ ...result, commentForEditors: target.value })
              }
            />
          </Box>
          <Heading size="md">Tải lên</Heading>
          <Text color="gray">
            Tải lên tài liệu mà bạn muốn ban biên tập và/hoặc tác giả tham khảo
            ý kiến, bao gồm các bản sửa đổi của các bản thảo ban đầu
          </Text>
          <Box>
            <Card>
              <AccordionItem border="none">
                <AccordionButton borderRadius={4}>
                  <AccordionIcon mr={3} />
                  <Heading size="md">Tải lên</Heading>
                </AccordionButton>
                <AccordionPanel py={4}>
                  <Box {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Tooltip label="Nhấp chuột để mở cửa sổ chọn tệp tin">
                      <Center
                        h={250}
                        cursor="pointer"
                        border={"2px dashed"}
                        borderColor={useColorModeValue("gray.500", "gray.200")}
                        borderRadius={8}
                        background={useColorModeValue("gray.200", "gray.700")}
                      >
                        {fileUploadData.isLoading ? (
                          <CircularProgressInderterminate />
                        ) : (
                          <>
                            <DownloadIcon mr={2} />
                            Nhấp chuột hoặc kéo thả file vào vùng này
                          </>
                        )}
                      </Center>
                    </Tooltip>
                  </Box>
                </AccordionPanel>
                <Stack mt={4} spacing={3}>
                  {result?.files?.length ? (
                    result?.files
                      ?.reverse()
                      .map((file, i) => (
                        <FileDisplayButton
                          file={file}
                          onRemoveFile={() => onRemoveFile(i)}
                        />
                      ))
                  ) : (
                    <Center color="gray">Chưa có tệp tin nào được chọn</Center>
                  )}
                </Stack>
              </AccordionItem>
            </Card>
          </Box>
          <Heading size="md">Đề xuất</Heading>
          <Text fontWeight="bold">
            <Text color="gray" as="span">
              Chọn một đề xuất và gửi đánh giá để hoàn tất quá trình.{" "}
            </Text>
            Bạn phải có một bài đánh giá hoặc tải lên một tệp đánh giá trước khi
            chọn đề xuất
          </Text>
          <Box>
            <Select
              size="lg"
              variant="filled"
              placeholder="Chọn đề xuất"
              value={result.recommendations}
              onChange={({ target }) =>
                setResult({ ...result, recommendations: target.value })
              }
            >
              <option key={"review-result-1"} value={ReviewResult.accepted}>
                {toResultRecommendationString(ReviewResult.accepted)}
              </option>
              <option key={"review-result-2"} value={ReviewResult.declined}>
                {toResultRecommendationString(ReviewResult.declined)}
              </option>
              <option key={"review-result-3"} value={ReviewResult.revision}>
                {toResultRecommendationString(ReviewResult.revision)}
              </option>
              <option key={"review-result-4"} value={ReviewResult.resubmission}>
                {toResultRecommendationString(ReviewResult.resubmission)}
              </option>
              <option key={"review-result-5"} value={ReviewResult.resubmit}>
                {toResultRecommendationString(ReviewResult.resubmit)}
              </option>
              <option key={"review-result-6"} value={ReviewResult.other}>
                {toResultRecommendationString(ReviewResult.other)}
              </option>
            </Select>
            {result.recommendations === ReviewResult.other && (
              <FormControlComponent
                id="otherRecommendation"
                value={result.otherRecommendation}
                placeholder="Đề xuất khác"
                inputType="textarea"
                onChange={({ target }: any) =>
                  setResult({ ...result, otherRecommendation: target.value })
                }
              />
            )}
          </Box>
          <HStack py={8} spacing={4} justify="end">
            <Button onClick={() => toStage(prevStage)}>Quay lại</Button>
            <Button
              colorScheme="green"
              rightIcon={<CheckIcon />}
              onClick={sendReviewModal.onOpen}
              isDisabled={
                !Boolean(
                  result.recommendations &&
                    (result.commentForEditors ||
                      result.commentForEveryone ||
                      result.files.length)
                )
              }
            >
              Gửi đánh giá
            </Button>
          </HStack>
        </Stack>
      </Accordion>
      <SendReviewResultModal
        {...{ ...sendReviewModal, onSendReview }}
        isLoading={submitReviewData.isLoading}
      />
    </>
  );
};
// otherRecommendation
export default StageThree;
