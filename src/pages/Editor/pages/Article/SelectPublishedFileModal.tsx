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
  useDisclosure,
  UseDisclosureReturn
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { FC, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  useCompleteSubmissionMutation,
  useGetArticleQuery
} from "../../../../features/article";
import { useUploadFileMutation } from "../../../../features/fileUpload";
import { useAppState } from "../../../../hooks/useAppState";
import IFile from "../../../../interface/file";
import { CircularProgressInderterminate } from "../../../../utils/components";

const SelectPublishedFileModal: FC<
  UseDisclosureReturn & {
    articleId: string | undefined;
  }
> = ({ isOpen, onClose, articleId }) => {
  const confirmCompleteAlert = useDisclosure();
  const { toast } = useAppState();
  const article = useGetArticleQuery(articleId);
  const [fileUpload, fileUploadData] = useUploadFileMutation();
  const [allFiles, setAllFiles] = useState<any[]>([]);
  const [publishedFile, setPublishedFile] = useState<IFile>();
  const cancelRef = useRef(null);

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
          title: `T???i l??n t???p th??nh c??ng!`,
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
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
    ],
    maxFiles: 1,
    multiple: false,
  });
  const { refetch } = useGetArticleQuery(articleId);
  const [completeSubmission, completeSubmissionData] =
    useCompleteSubmissionMutation();

  const handleCompleteSubmission = async () => {
    try {
      if (articleId && publishedFile) {
        const result = await completeSubmission({
          _id: articleId,
          publishedFile,
        }).unwrap();
        refetch();
        toast({ status: "success", title: result.message });
        onClose();
      } else {
        toast({ status: "error", title: "Vui l??ng ch???n t??i li???u c???a b??i b??o" });
      }
    } catch (error: any) {
      toast({ status: "error", title: error.data.message });
    }
  };

  return (
    <>
      <Modal isCentered size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xu???t b???n</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={2}>
              <Text color={"gray.400"}>
                H??y s??? d???ng t???p tin pdf ????? c?? k???t qu??? t???t nh???t
              </Text>
              <FormControl id="draftFile">
                <FormLabel>File b??i b??o xu???t b???n</FormLabel>
                <Box {...getRootProps()} mb={2}>
                  <input {...getInputProps()} />
                  <Tooltip label="Nh???p chu???t ????? m??? c???a s??? ch???n t???p tin">
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
                          Nh???p chu???t ho???c k??o th??? file v??o v??ng n??y
                        </>
                      )}
                    </Center>
                  </Tooltip>
                </Box>
                <Select
                  placeholder="T??i li???u..."
                  selectedOptionStyle="check"
                  options={allFiles?.map((file) => ({
                    ...file,
                    value: file?._id,
                    label: file?.title,
                  }))}
                  value={publishedFile}
                  onChange={(val) => setPublishedFile(val as IFile)}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={completeSubmissionData.isLoading}
              colorScheme="red"
              ref={cancelRef}
              onClick={onClose}
            >
              H???y
            </Button>
            <Button
              isLoading={completeSubmissionData.isLoading}
              colorScheme="green"
              ml={3}
              onClick={handleCompleteSubmission}
            >
              ?????ng ??
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default SelectPublishedFileModal;
