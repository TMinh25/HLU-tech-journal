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
  Tooltip,
  useColorModeValue,
  UseDisclosureReturn
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { FC, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  useGetArticleQuery,
  useSendToPublishingMutation
} from "../../../../features/article";
import { useUploadFileMutation } from "../../../../features/fileUpload";
import { useAppState } from "../../../../hooks/useAppState";
import IFile from "../../../../interface/file";
import { CircularProgressInderterminate } from "../../../../utils/components";

const SendToPublishingModal: FC<
  UseDisclosureReturn & {
    articleId: string | undefined;
  }
> = ({ isOpen, onClose, articleId }) => {
  const { toast } = useAppState();
  const article = useGetArticleQuery(articleId);
  const [fileUpload, fileUploadData] = useUploadFileMutation();
  const [sendToPublishing, sendToPublishingData] =
    useSendToPublishingMutation();
  const [allFiles, setAllFiles] = useState<IFile[]>([]);
  const [draftFile, setDraftFile] = useState<IFile[]>([]);

  useEffect(() => {
    if (article.data?.files.length) {
      setAllFiles(article.data.files);
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

  const handleSendToPublishing = async () => {
    try {
      const result = await sendToPublishing({
        _id: articleId,
        draftFile,
      }).unwrap();
      article.refetch();
      toast({ status: "success", title: result.message });
      onClose();
    } catch (error: any) {
      toast({ status: "error", title: error.data.message });
    }
  };

  return (
    <>
      <Modal isCentered size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chuyển tiếp tới xuất bản</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={2}>
              <FormControl id="draftFile">
                <FormLabel>File bài báo xuất bản</FormLabel>
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
                    value: file._id,
                    label: file.title,
                  }))}
                  value={draftFile}
                  onChange={(val) => setDraftFile(val.map((f) => f))}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              size="lg"
              onClick={onClose}
              mr={3}
              isLoading={sendToPublishingData.isLoading}
            >
              Hủy
            </Button>
            <Button
              isLoading={sendToPublishingData.isLoading}
              onClick={handleSendToPublishing}
              id="submit"
              type="submit"
              colorScheme="green"
              shadow="xs"
              border="none"
              size="lg"
            >
              Chuyển tiếp
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default SendToPublishingModal;
