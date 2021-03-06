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
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useColorModeValue,
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

  const reviewRound = useMemo(() => {
    if (article.data?.detail?.review && roundId) {
      let index = article.data?.detail?.review?.findIndex(
        (r) => r._id === roundId
      );
      return article.data?.detail?.review![index];
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
      toast({ status: "error", title: "???? c?? l???i x???y ra!" });
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
    let timeOutId: NodeJS.Timeout;
    if (roundId) {
      const stageStorage = JSON.parse(
        localStorage.getItem(`review-stage-${articleId}-${roundId}`) || "{}"
      );
      if (JSON.stringify(result) != JSON.stringify(stageStorage)) {
        timeOutId = setTimeout(() => {
          localStorage.setItem(
            `review-stage-${articleId}-${roundId}`,
            JSON.stringify({ ...stageStorage, ...result })
          );
          // toast({
          //   status: "success",
          //   title: "???? l??u v??o b???n th???o ??ang ????nh gi??!",
          //   duration: 2000,
          // });
        }, 1000);
      }
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
          title: `T???i l??n ${uploadAllFileResponses.length} file th??nh c??ng!`,
        });
      } catch (error) {
        toast({ status: "error", title: "T???i file th???t b???i" });
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
            ????nh gi??
          </Heading>
          <Card>
            <AccordionItem border="none">
              <AccordionButton borderRadius={4}>
                <AccordionIcon mr={3} />
                <Heading size="md">B???n th???o</Heading>
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
                      <Heading size="xs">T??i li???u h??? tr???</Heading>
                      {reviewRound?.files?.map((f) => (
                        <FileDisplayButton file={f} displayId />
                      ))}
                    </>
                  )}
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Card>
          <Heading size="md">????nh gi?? c???a b???n</Heading>
          <Text color="gray">??i???n ????nh gi?? c???a b???n v??o m???u b??n d?????i.</Text>
          <Box>
            <FormControlComponent
              id="commentForEveryone"
              helperText="????nh gi?? b??i b??o"
              inputType="textarea"
              formLabel="????nh gi?? b??i b??o"
              value={result.commentForEveryone}
              noOfLines={5}
              onChange={({ target }: any) =>
                setResult({ ...result, commentForEveryone: target.value })
              }
            />
            <FormControlComponent
              id="commentForEditors"
              helperText="G??p ?? cho ban bi??n t???p"
              inputType="textarea"
              formLabel="G??p ?? cho ban bi??n t???p"
              value={result.commentForEditors}
              noOfLines={5}
              onChange={({ target }: any) =>
                setResult({ ...result, commentForEditors: target.value })
              }
            />
          </Box>
          <Heading size="md">T???i l??n</Heading>
          <Text color="gray">
            T???i l??n t??i li???u m?? b???n mu???n ban bi??n t???p v??/ho???c t??c gi??? tham kh???o
            ?? ki???n, bao g???m c??c b???n s???a ?????i c???a c??c b???n th???o ban ?????u
          </Text>
          <Box>
            <Card>
              <AccordionItem border="none">
                <AccordionButton borderRadius={4}>
                  <AccordionIcon mr={3} />
                  <Heading size="md">T???i l??n</Heading>
                </AccordionButton>
                <AccordionPanel py={4}>
                  <Box {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Tooltip label="Nh???p chu???t ????? m??? c???a s??? ch???n t???p tin">
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
                            Nh???p chu???t ho???c k??o th??? file v??o v??ng n??y
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
                    <Center color="gray">Ch??a c?? t???p tin n??o ???????c ch???n</Center>
                  )}
                </Stack>
              </AccordionItem>
            </Card>
          </Box>
          <Heading size="md">????? xu???t</Heading>
          <Text fontWeight="bold">
            <Text color="gray" as="span">
              Ch???n m???t ????? xu???t v?? g???i ????nh gi?? ????? ho??n t???t qu?? tr??nh.{" "}
            </Text>
            B???n ph???i c?? m???t b??i ????nh gi?? ho???c t???i l??n m???t t???p ????nh gi?? tr?????c khi
            ch???n ????? xu???t
          </Text>
          <Box>
            <RadioGroup
              name="recommendations"
              value={result.recommendations}
              onChange={(res) => setResult({ ...result, recommendations: res })}
            >
              <Stack>
                <Radio value={ReviewResult.accepted}>
                  {toResultRecommendationString(ReviewResult.accepted)}
                </Radio>
                <Radio value={ReviewResult.declined}>
                  {toResultRecommendationString(ReviewResult.declined)}
                </Radio>
                <Radio value={ReviewResult.revision}>
                  {toResultRecommendationString(ReviewResult.revision)}
                </Radio>
                <Radio value={ReviewResult.resubmit}>
                  {toResultRecommendationString(ReviewResult.resubmit)}
                </Radio>
                <Radio value={ReviewResult.other}>
                  {toResultRecommendationString(ReviewResult.other)}
                </Radio>
              </Stack>
            </RadioGroup>
            {result.recommendations === ReviewResult.other && (
              <FormControlComponent
                id="otherRecommendation"
                value={result.otherRecommendation}
                placeholder="????? xu???t kh??c"
                inputType="textarea"
                onChange={({ target }: any) =>
                  setResult({ ...result, otherRecommendation: target.value })
                }
              />
            )}
          </Box>
          <HStack py={8} spacing={4} justify="end">
            <Button onClick={() => toStage(prevStage)}>Quay l???i</Button>
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
              G???i ????nh gi??
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
