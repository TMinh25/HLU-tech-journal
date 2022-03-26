import { DownloadIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  Button,
  UseDisclosureReturn,
  Modal,
  FormControl,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Center,
  HStack,
  Tooltip,
  Editable,
  EditableInput,
  EditablePreview,
  Icon,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { useDropzone } from "react-dropzone";
import { RiFolderUploadLine } from "react-icons/ri";
import {
  useGetArticleQuery,
  useResponseRevisionMutation,
} from "../../../../features/article";
import { useUploadFileMutation } from "../../../../features/fileUpload";
import { useAppState } from "../../../../hooks/useAppState";
import IFile from "../../../../interface/file";
import {
  Card,
  CircularProgressInderterminate,
  FileDisplayButton,
} from "../../../../utils/components";

export const ResponseRevisionModal: FC<
  UseDisclosureReturn & {
    articleId?: string;
    currentRevision?: {
      _id?: string;
      text?: string;
      files: IFile[];
      responseFile?: IFile;
    };
  }
> = ({ isOpen, onClose, articleId, currentRevision, ...props }) => {
  const [responseFile, setResponseFile] = useState<IFile>();
  const [currentFile, setCurrentFile] = useState<File>();
  const [newFileName, setNewFileName] = useState<string>("");

  const { toast } = useAppState();
  const article = useGetArticleQuery(articleId);
  const [fileUpload, fileUploadData] = useUploadFileMutation();
  const [responseRevision, responseRevisionData] =
    useResponseRevisionMutation();

  const onFileUpload = async () => {
    if (currentFile) {
      try {
        const formData = new FormData();
        formData.append(
          "file",
          currentFile,
          `${newFileName?.split(".")[0]}.${
            currentFile.name.split(".")[currentFile.name.split(".").length - 1]
          }`
        );
        const fileUploadRes = await fileUpload(formData).unwrap();
        setResponseFile(fileUploadRes);
        toast({ status: "success", title: "Tải file thành công" });
      } catch (error) {
        toast({ status: "error", title: "Tải file thất bại" });
        console.error(error);
      }
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setCurrentFile(acceptedFiles[0]);
      setNewFileName(acceptedFiles[0].name);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
    ],
    maxFiles: 1,
    multiple: true,
  });

  const handleResponseRevision = async () => {
    if (responseFile) {
      try {
        const result = await responseRevision({
          _id: articleId,
          _revisionId: currentRevision?._id,
          responseFile,
        }).unwrap();
        article.refetch();
        toast({
          status: "success",
          title: result.message,
        });
        onClose();
      } catch (error: any) {
        console.error(error);
        toast({ status: "error", title: error.data.message });
      }
    }
  };

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Yêu cầu hoàn thiện bài báo</ModalHeader>
        <ModalCloseButton />
        {currentRevision?._id && articleId ? (
          <>
            <ModalBody pb={6}>
              {currentRevision.text && (
                <FormControl>
                  <FormLabel>Lời nhắn của biên tập viên</FormLabel>
                  <Text>{currentRevision.text}</Text>
                </FormControl>
              )}
              <FormControl id="responseFile">
                <FormLabel>Tài liệu hoàn thiện</FormLabel>
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
                <Stack>
                  <Card>
                    <Heading mb={4} size="md">
                      File hiện có
                    </Heading>
                    <Box py={2}>
                      {currentFile && (
                        <>
                          <FileDisplayButton
                            isTruncated
                            systemFile={currentFile}
                            onRemoveFile={() => setCurrentFile(undefined)}
                          />
                          <Tooltip label={currentFile.name}>
                            <Editable
                              onChange={(val) => setNewFileName(val)}
                              defaultValue={currentFile.name}
                              w="100%"
                            >
                              <EditablePreview w="100%" isTruncated />
                              <EditableInput />
                            </Editable>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                    <Text fontSize="sm" color="gray.500">
                      Bạn có thể nhấp vào tên file để thay đổi tên file
                    </Text>
                  </Card>
                  <Card>
                    <Heading mb={4} size="md">
                      Tài liệu hoàn thiện
                    </Heading>
                    <Box py={2}>
                      {responseFile && (
                        <FileDisplayButton
                          isTruncated
                          file={responseFile}
                          onRemoveFile={() => setResponseFile(undefined)}
                        />
                      )}
                    </Box>
                  </Card>
                  <Button
                    mt={2}
                    isDisabled={!currentFile}
                    isLoading={fileUploadData.isLoading}
                    onClick={onFileUpload}
                    colorScheme="green"
                  >
                    <Text mr={2}>Tải lên</Text>
                    <Icon as={RiFolderUploadLine} />
                  </Button>
                </Stack>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <HStack>
                <Button
                  onClick={onClose}
                  isLoading={responseRevisionData.isLoading}
                >
                  Hủy
                </Button>
                <Button
                  colorScheme={"green"}
                  onClick={handleResponseRevision}
                  isLoading={responseRevisionData.isLoading}
                  isDisabled={
                    !responseFile || !articleId || !currentRevision?._id
                  }
                >
                  Gửi tài liệu đã hoàn thiện
                </Button>
              </HStack>
            </ModalFooter>
          </>
        ) : (
          <CircularProgressInderterminate />
        )}
      </ModalContent>
    </Modal>
  );
};
