import { DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Heading,
  Stack,
  useDisclosure,
  UseDisclosureReturn,
  useColorModeValue,
  Box,
  Spacer,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  Badge,
  HStack,
  Text,
  Tag,
} from "@chakra-ui/react";
import { Select, chakraComponents } from "chakra-react-select";
import { FC, useEffect, useState } from "react";
import "react-day-picker/style.css";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import {
  useCompleteSubmissionMutation,
  useGetArticleQuery,
  useRequestRevisionMutation,
} from "../../../../features/article";
import { useUploadFileMutation } from "../../../../features/fileUpload";
import { useAppState } from "../../../../hooks/useAppState";
import { useAuth } from "../../../../hooks/useAuth";
import IFile from "../../../../interface/file";
import { ArticleStatus, Role } from "../../../../types";
import {
  Card,
  CircularProgressInderterminate,
  FileDisplayButton,
  FormControlComponent,
} from "../../../../utils/components";
import ConfirmCompleteSubmission from "./ConfirmCompleteSubmission";
import SelectPublishedFileModal from "./SelectPublishedFileModal";

const PublishingStage: FC<{
  confirmCompleteAlert: UseDisclosureReturn;
}> = ({ confirmCompleteAlert }) => {
  const { articleId } = useParams();
  const article = useGetArticleQuery(articleId);
  const { role } = useAuth();
  const publishing = article.data?.detail?.publishing;
  const completeModal = useDisclosure();
  const [publishedFile, setPublishedFile] = useState<IFile>();
  const { toast } = useAppState();
  const requestRevisionModal = useDisclosure();

  useEffect(() => {
    if (article.data?.publishedFile)
      setPublishedFile(article.data?.publishedFile);
  }, [article.data?.publishedFile]);

  const [completeSubmission, completeSubmissionData] =
    useCompleteSubmissionMutation();

  const handleCompleteSubmission = async () => {
    try {
      if (articleId && publishedFile) {
        const result = await completeSubmission({
          _id: articleId,
          publishedFile,
        }).unwrap();
        article.refetch();
        toast({ status: "success", title: result.message });
        confirmCompleteAlert.onClose();
      } else {
        toast({ status: "error", title: "Vui lòng chọn tài liệu của bài báo" });
      }
    } catch (error: any) {
      toast({ status: "error", title: error.data.message });
    }
  };

  return (
    <>
      <Stack divider={<Divider />} spacing={5}>
        {publishing?.draftFile?.length && (
          <Stack>
            <Heading size="md">Tài liệu</Heading>
            {publishing?.draftFile?.map((f) => (
              <FileDisplayButton file={f} displayId />
            ))}
          </Stack>
        )}

        <Stack minH={200}>
          <Heading size="md">Bài báo xuất bản</Heading>
          {article.data?.detail?.publishing &&
          article.data.detail.publishing.request.length ? (
            <>
              {article.data.detail.publishing.request.map((r) => (
                <>
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
                        <Heading size="sm">
                          Tài liệu hoàn thiện của tác giả
                        </Heading>
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
                      </Stack>
                    </Stack>
                  </Card>
                </>
              ))}
            </>
          ) : (
            <Box
              flex={1}
              textAlign="center"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              Không có yêu cầu hoàn thiện bài báo!
            </Box>
          )}
          <Spacer />
          <Button colorScheme={'yellow'} onClick={requestRevisionModal.onOpen}>
            Gửi yêu cầu hoàn thiện bài báo
          </Button>
        </Stack>

        <Stack>
          <Heading size="md">Bài báo xuất bản</Heading>
          {publishedFile && (
            <FileDisplayButton file={publishedFile} displayId />
          )}
          {role === Role.editors &&
            article.data?.status === ArticleStatus.publishing && (
              <Button
                onClick={completeModal.onOpen}
                isLoading={completeModal.isOpen}
                colorScheme="green"
              >
                Chọn tài liệu xuất bản bài báo
              </Button>
            )}
        </Stack>
      </Stack>
      <SelectPublishedFileModal
        {...completeModal}
        articleId={articleId}
        {...{ publishedFile }}
        setPublishedFile={(val) => setPublishedFile(val)}
      />
      <ConfirmCompleteSubmission
        {...confirmCompleteAlert}
        publishedFile={publishedFile}
        onAccept={handleCompleteSubmission}
        isLoading={completeSubmissionData.isLoading}
      />
      <RequestRevisionModal {...requestRevisionModal} articleId={articleId} />
    </>
  );
};
export default PublishingStage;

const RequestRevisionModal: FC<
  UseDisclosureReturn & { articleId?: string }
> = ({ isOpen, onClose, articleId }) => {
  const [request, setRequest] = useState({ text: "", files: [] as IFile[] });
  const [allFiles, setAllFiles] = useState<any[]>([]);

  const { toast } = useAppState();
  const article = useGetArticleQuery(articleId);
  const [fileUpload, fileUploadData] = useUploadFileMutation();
  const [requestRevision, requestRevisionData] = useRequestRevisionMutation();

  useEffect(() => {
    if (article.data?.files.length) {
      const files = [
        ...article.data.files,
        ...Array.from<IFile | undefined>(
          article.data.detail?.review?.map((r) => r.result?.files).flat() || []
        ),
      ];
      setAllFiles([...new Set(files)]);
    }
  }, [article.data?.files]);

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
        setAllFiles((prev) => [
          ...Array.from(prev || []),
          ...uploadAllFileResponses,
        ]);
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

  const handleRequestRevision = async () => {
    try {
      const result = await requestRevision({
        _id: articleId,
        ...request,
      }).unwrap();
      article.refetch();
      toast({
        status: "success",
        title: "Gửi yêu cầu hoàn thiện cho tác giả thành công!",
      });
      onClose();
    } catch (error: any) {
      console.error(error);
      toast({ status: "error", title: error.data.message });
    }
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Yêu cầu hoàn thiện bài báo</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Lời nhắn gửi tác giả</FormLabel>
            <FormControlComponent
              id="text"
              value={request.text}
              placeholder="Lời nhắn"
              inputType="textarea"
              onChange={({ target }) =>
                setRequest({ ...request, text: target.value })
              }
            />
          </FormControl>
          <FormControl id="files">
            <FormLabel>Tài liệu</FormLabel>
            <Box {...getRootProps()} mb={2}>
              <input {...getInputProps()} />
              <Tooltip label="Nhấp chuột để mở cửa sổ chọn tệp tin">
                <Center
                  h={100}
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
            <Select
              isMulti
              placeholder="Tài liệu..."
              selectedOptionStyle="check"
              options={allFiles?.map((file) => ({
                ...file,
                value: file?._id || "",
                label: file?.title || "",
              }))}
              components={{
                Option: ({ children, ...props }) => (
                  <chakraComponents.Option {...props}>
                    {children}
                    <Spacer />
                    {props.data._id && <Badge mr={2}>{props.data._id}</Badge>}
                  </chakraComponents.Option>
                ),
              }}
              value={request.files}
              onChange={(val) =>
                setRequest({ ...request, files: val.map((f) => f) })
              }
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <HStack>
            <Button onClick={onClose} isLoading={requestRevisionData.isLoading}>
              Hủy
            </Button>
            <Button
              colorScheme={"green"}
              onClick={handleRequestRevision}
              isLoading={requestRevisionData.isLoading}
            >
              Yêu cầu
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
