import { DownloadIcon } from "@chakra-ui/icons";
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
  Link,
  ListItem,
  OrderedList,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { RiFolderUploadLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { useUploadFileMutation } from "../../../features/fileUpload";
import { useAppState } from "../../../hooks/useAppState";
import { NewSubmissionRequest } from "../../../interface/requestAndResponse";
import { FileDisplayButton } from "../../../utils/components";

export default function StepTwo({ onNextTab, onPrevTab }: any) {
  const prevStep = 0;
  const nextStep = 2;
  const { toast } = useAppState();
  const { values, setFieldValue } = useFormikContext<NewSubmissionRequest>();
  const [currentFile, setCurrentFile] = useState<File>();
  const [newFileName, setNewFileName] = useState<string>();
  const [fileUpload, fileUploadData] = useUploadFileMutation();
  const navigate = useNavigate();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setCurrentFile(acceptedFiles[0]);
      setNewFileName(acceptedFiles[0].name);
    }
  };

  // useEffect(() => {
  //   console.log(currentFile);
  // }, [currentFile]);

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
        setFieldValue("detail.submission.file", fileUploadRes);
        toast({ status: "success", title: "Tải file thành công" });
      } catch (error) {
        toast({ status: "error", title: "Tải file thất bại" });
        console.error(error);
      }
    }
  };

  return (
    <>
      <Heading size="2xl" mb={4}>
        Tải bản thảo lên hệ thống
      </Heading>
      <Text>Để tải một bản thảo lên tạp chí, xin hoàn thành các bước sau</Text>
      <OrderedList pl={6}>
        <ListItem>
          Trên trang này, hãy nhấp chuột vào hoặc kéo thả file vào ô tải file
          lên hệ thống
        </ListItem>
        <ListItem>Xác định file quý vị cần gửi và chọn file đó</ListItem>
        <ListItem>
          Nhấp chuột vào nút Tải lên để hệ thống tự động tải file
        </ListItem>
        <ListItem>
          Khi bài nộp được tải lên thành công, nhấp chuột vào nút tiếp tục để
          sang bước tiếp theo
        </ListItem>
      </OrderedList>
      <Text pb={2}>
        Gặp khó khăn? Liên hệ với{" "}
        <Link
          target={"_blank"}
          href="https://www.facebook.com/sipp.minhh"
          color={"green.200"}
        >
          Nguyễn Trường Minh
        </Link>{" "}
        để được trợ giúp.
      </Text>
      <Divider my={6} />
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
      <Divider my={6} />
      <Box>
        <Flex>
          <Box flex={1}>
            <Heading mb={4} size="md">
              File hiện có
            </Heading>
            <Box p={4}>
              {currentFile && (
                <>
                  <FileDisplayButton
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
          </Box>
          <Box flex={1}>
            <Heading mb={4} size="md">
              File đã tải lên
            </Heading>
            <Box p={4}>
              {values.detail?.submission.file && (
                <FileDisplayButton
                  file={values.detail?.submission.file}
                  onRemoveFile={() =>
                    setFieldValue("detail.submission.file", undefined)
                  }
                />
              )}
            </Box>
          </Box>
        </Flex>
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
      </Box>
      <Box>
        <HStack my={8}>
          <Button onClick={() => navigate("/")}>Hủy</Button>
          <Button onClick={() => onPrevTab(prevStep)} colorScheme="gray">
            Quay lại
          </Button>
          <Button
            onClick={() => onNextTab(nextStep)}
            colorScheme="green"
            isDisabled={!values.detail?.submission.file}
          >
            Tiếp theo
          </Button>
        </HStack>
      </Box>
    </>
  );
}
