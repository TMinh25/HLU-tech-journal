import { DownloadIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { FC, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  useCompleteSubmissionMutation,
  useGetArticleQuery,
  useSendToCopyEditingMutation,
} from "../../../../features/article";
import { useUploadFileMutation } from "../../../../features/fileUpload";
import { useAppState } from "../../../../hooks/useAppState";
import IFile from "../../../../interface/file";
import { CircularProgressInderterminate } from "../../../../utils/components";
import ConfirmCompleteSubmission from "./ConfirmCompleteSubmission";

const SendToCopyEditingModal: FC<
  UseDisclosureReturn & {
    articleId: string | undefined;
  }
> = ({ isOpen, onClose, articleId }) => {
  const { toast } = useAppState();
  const article = useGetArticleQuery(articleId);
  const [fileUpload, fileUploadData] = useUploadFileMutation();
  const [allFiles, setAllFiles] = useState<any[]>([]);
  const [draftFiles, setDraftFiles] = useState<IFile[]>([]);

  const [copyEditingSubmission, copyEditingSubmissionData] =
    useSendToCopyEditingMutation();

  const handleCopyEditingSubmission = async () => {
    try {
      const result = await copyEditingSubmission({
        _id: articleId,
        draftFiles,
      }).unwrap();
      article.refetch();
      toast({ status: "success", title: result.message });
      onClose();
    } catch (error: any) {
      toast({ status: "error", title: error.data.message });
    }
  };
  useEffect(() => {
    if (article.data?.files.length) {
      const files = [
        ...article.data.files,
        ...Array.from<IFile | undefined>(
          article.data.detail?.publishing.request?.map((r) => r.responseFile) ||
            []
        ),
      ];
      setAllFiles([...new Set(files)]);
    }
  }, [article.data?.files]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      try {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0], acceptedFiles[0].name);
        const uploadFileResponse = await fileUpload(formData).unwrap();
        setAllFiles([...allFiles, uploadFileResponse]);
        toast({
          status: "success",
          title: `Tải lên tệp thành công!`,
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
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
    ],
    maxFiles: 1,
    multiple: false,
  });

  return (
    <>
      <Modal isCentered size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Biên tập</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={2}>
              <FormControl id="draftFiles">
                <FormLabel>File bài báo biên tập</FormLabel>
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
                  placeholder="Tài liệu..."
                  selectedOptionStyle="check"
                  options={allFiles?.map((file) => ({
                    ...file,
                    value: file._id,
                    label: file.title,
                  }))}
                  isMulti
                  value={draftFiles}
                  onChange={(val) => setDraftFiles(val.map((f) => f))}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button size="lg" onClick={onClose} mr={3}>
              Đóng
            </Button>
            <Button
              size="lg"
              colorScheme={"green"}
              onClick={handleCopyEditingSubmission}
            >
              Biên tập
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default SendToCopyEditingModal;