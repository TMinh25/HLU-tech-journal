import { AttachmentIcon, DownloadIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { RiFolderUploadLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { useUploadFileMutation } from "../../../features/fileUpload";
import { useAppState } from "../../../hooks/useAppState";
import IFile from "../../../interface/file";
import { NewSubmissionRequest } from "../../../interface/requestAndResponse";
import { FileDisplayButton } from "../../../utils/components";

export default function StepFour({ onNextTab, onPrevTab }: any) {
  const prevStep = 2;
  const nextStep = 4;
  const { values, setFieldValue } = useFormikContext<NewSubmissionRequest>();
  const [fileToUpload, setFileToUpload] = useState<File[]>([]);
  const [newFileName, setNewFileName] = useState<string[]>([]);
  const [fileUpload, fileUploadData] = useUploadFileMutation();
  const { toast } = useAppState();
  const navigate = useNavigate();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFileToUpload((prev) => [...prev, ...acceptedFiles]);
      setNewFileName((prev) => [
        ...prev,
        ...acceptedFiles.map((file) => file.name),
      ]);
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

  const onFileUpload = async () => {
    if (fileToUpload.length) {
      const uploadFilePromises = fileToUpload.map((file, fileIndex) => {
        try {
          const formData = new FormData();
          formData.append(
            "file",
            file,
            `${newFileName[fileIndex].split(".")[0]}.${
              file.name.split(".")[file.name.split(".").length - 1]
            }`
          );
          return fileUpload(formData).unwrap();
        } catch (error) {
          return Promise.reject(error);
        }
      });
      try {
        const uploadAllFileResponses = await Promise.all(uploadFilePromises);
        setFieldValue("detail.submission.helperFiles", [
          ...values.detail.submission.helperFiles,
          ...uploadAllFileResponses,
        ]);
        uploadAllFileResponses.forEach((file) =>
          toast({
            status: "success",
            title: "Tải file thành công",
            description: `Tệp ${file.title} tải lên thành công`,
          })
        );
      } catch (error) {
        toast({ status: "error", title: "Tải file thất bại" });
        console.error(error);
      }
    }
  };

  const onRemoveFileToUpload = (index: number) => {
    if (index >= 0) {
      const newArr = [...fileToUpload];
      newArr.splice(index, 1);
      const newArrName = [...newFileName];
      newArrName.splice(index, 1);
      setFileToUpload(newArr);
      setNewFileName(newArrName);
    }
  };

  const onChangeFileName = (index: number, val: string) => {
    const newArr = [...newFileName];
    newArr.splice(index, 1, val);
    setNewFileName(() => newArr);
  };

  const onRemoveUploadedFile = (index: number) => {
    const newArr = [...values.detail?.submission.helperFiles];
    newArr.splice(index, 1);
    setFieldValue("detail.submission.helperFiles", newArr);
  };

  return (
    <>
      <Heading size="2xl" mb={8}>
        Tải File hỗ trợ quá trình phản biện
      </Heading>
      <Box>
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
              <DownloadIcon mr={2} />
              Nhấp chuột hoặc kéo thả file vào vùng này
            </Center>
          </Tooltip>
        </Box>
        <Box mt={4}>
          <Flex>
            <Box flex={1}>
              <Heading mb={4} size="md">
                File hiện có
              </Heading>
              <Stack spacing={4} p={4}>
                {fileToUpload.map((file, index) => (
                  <Box>
                    <FileDisplayButton
                      systemFile={file}
                      onRemoveFile={() => onRemoveFileToUpload(index)}
                    />
                    <Tooltip label={file.name}>
                      <Editable
                        onChange={(val) => onChangeFileName(index, val)}
                        defaultValue={file.name}
                        w="100%"
                      >
                        <EditablePreview w="100%" isTruncated />
                        <EditableInput />
                      </Editable>
                    </Tooltip>
                  </Box>
                ))}
              </Stack>
              <Text fontSize="sm" color="gray.500">
                Bạn có thể nhấp vào tên file để thay đổi tên file
              </Text>
            </Box>
            <Divider orientation="vertical" />
            <Box flex={1}>
              <Heading mb={4} size="md">
                File đã tải lên
              </Heading>
              <Stack spacing={4} p={4}>
                {values.detail?.submission.helperFiles?.map(
                  (file: IFile, index: number) => (
                    <FileDisplayButton
                      file={file}
                      onRemoveFile={() => onRemoveUploadedFile(index)}
                    />
                  )
                )}
              </Stack>
            </Box>
          </Flex>
          <Button
            mt={2}
            isDisabled={!fileToUpload.length}
            isLoading={fileUploadData.isLoading}
            onClick={onFileUpload}
            colorScheme="green"
          >
            <Text mr={2}>Tải lên</Text>
            <Icon as={RiFolderUploadLine} />
          </Button>
        </Box>
        <HStack my={8}>
          <Button onClick={() => navigate("/")}>Hủy</Button>
          <Button onClick={() => onPrevTab(prevStep)} colorScheme="gray">
            Quay lại
          </Button>
          <Button onClick={() => onNextTab(nextStep)} colorScheme="green">
            Tiếp theo
          </Button>
        </HStack>
      </Box>
    </>
  );
}
