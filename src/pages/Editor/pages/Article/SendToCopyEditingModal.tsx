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
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { FC, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  useGetArticleQuery,
  useSendToCopyEditingMutation,
} from "../../../../features/article";
import { useUploadFileMutation } from "../../../../features/fileUpload";
import { useGetAllUsersQuery } from "../../../../features/user";
import { useAppState } from "../../../../hooks/useAppState";
import IFile from "../../../../interface/file";
import User from "../../../../interface/user.model";
import { Role } from "../../../../types";
import {
  CircularProgressInderterminate,
  FormControlComponent,
} from "../../../../utils/components";

const SendToCopyEditingModal: FC<
  UseDisclosureReturn & {
    articleId: string | undefined;
  }
> = ({ isOpen, onClose, articleId }) => {
  const { toast } = useAppState();
  const article = useGetArticleQuery(articleId);
  const allUsers = useGetAllUsersQuery();
  const [fileUpload, fileUploadData] = useUploadFileMutation();
  const [allFiles, setAllFiles] = useState<any[]>([]);
  const [draftFiles, setDraftFiles] = useState<IFile>();
  const [notes, setNotes] = useState<string>();
  const [copyeditor, setCopyeditor] = useState<User | null>();

  const [copyEditingSubmission, copyEditingSubmissionData] =
    useSendToCopyEditingMutation();

  const handleCopyEditingSubmission = async () => {
    try {
      if (!!copyeditor && !!draftFiles) {
        const result = await copyEditingSubmission({
          _id: articleId,
          draftFiles,
          notes,
          copyeditor: copyeditor._id,
        }).unwrap();
        article.refetch();
        toast({ status: "success", title: result.message });
        onClose();
      }
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

  return (
    <>
      <Modal isCentered size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bi??n t???p</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={2}>
              <FormControlComponent
                id="note"
                formLabel="Ghi ch??"
                placeholder="Ghi ch??"
                inputType="textarea"
                value={notes}
                onChange={({ target }) => setNotes(target.value)}
              />
              <FormControl id="copyeditor">
                <FormLabel>Bi??n t???p vi??n</FormLabel>
                <Select
                  placeholder="Bi??n t???p vi??n"
                  selectedOptionStyle="check"
                  // TODO: con c???c
                  options={allUsers.data
                    ?.filter((user) => user.role === Role.copyeditors)
                    ?.map((user) => ({
                      ...user,
                      value: user?._id,
                      label: `${user?.displayName} (${user.aliases})`,
                    }))}
                  value={copyeditor}
                  onChange={(val) => {
                    setCopyeditor(val);
                  }}
                />
              </FormControl>
              <FormControl id="draftFiles">
                <FormLabel>File b??i b??o bi??n t???p</FormLabel>
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
                  value={draftFiles}
                  onChange={(val) => setDraftFiles(val as IFile)}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              size="lg"
              onClick={onClose}
              mr={3}
              isLoading={copyEditingSubmissionData.isLoading}
            >
              ????ng
            </Button>
            <Button
              size="lg"
              colorScheme={"green"}
              onClick={handleCopyEditingSubmission}
              isLoading={copyEditingSubmissionData.isLoading}
              isDisabled={!draftFiles}
            >
              Y??u c???u bi??n t???p
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default SendToCopyEditingModal;
