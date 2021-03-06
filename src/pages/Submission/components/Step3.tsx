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

export default function StepThree({ onNextTab, onPrevTab }: any) {
  const prevStep = 1;
  const nextStep = 3;
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
        toast({ status: "success", title: "T???i file th??nh c??ng" });
      } catch (error) {
        toast({ status: "error", title: "T???i file th???t b???i" });
        console.error(error);
      }
    }
  };

  return (
    <>
      <Heading size="2xl" mb={4}>
        T???i b???n th???o l??n h??? th???ng
      </Heading>
      <Text>????? t???i m???t b???n th???o l??n s???, xin ho??n th??nh c??c b?????c sau</Text>
      <OrderedList pl={6}>
        <ListItem>
          Tr??n trang n??y, h??y nh???p chu???t v??o ho???c k??o th??? file v??o ?? t???i file
          l??n h??? th???ng
        </ListItem>
        <ListItem>X??c ?????nh file qu?? v??? c???n g???i v?? ch???n file ????</ListItem>
        <ListItem>
          Nh???p chu???t v??o n??t T???i l??n ????? h??? th???ng t??? ?????ng t???i file
        </ListItem>
        <ListItem>
          Khi b??i n???p ???????c t???i l??n th??nh c??ng, nh???p chu???t v??o n??t ti???p t???c ?????
          sang b?????c ti???p theo
        </ListItem>
      </OrderedList>
      <Text pb={2}>
        G???p kh?? kh??n? Li??n h??? v???i{" "}
        <Link
          target={"_blank"}
          href="https://www.facebook.com/sipp.minhh"
          color={"green.200"}
        >
          Nguy???n Tr?????ng Minh
        </Link>{" "}
        ????? ???????c tr??? gi??p.
      </Text>
      <Divider my={6} />
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
            <DownloadIcon mr={2} />
            Nh???p chu???t ho???c k??o th??? file v??o v??ng n??y
          </Center>
        </Tooltip>
      </Box>
      <Divider my={6} />
      <Box>
        <Flex>
          <Box flex={1}>
            <Heading mb={4} size="md">
              File hi???n c??
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
              B???n c?? th??? nh???p v??o t??n file ????? thay ?????i t??n file
            </Text>
          </Box>
          <Box flex={1}>
            <Heading mb={4} size="md">
              File ???? t???i l??n
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
          <Text mr={2}>T???i l??n</Text>
          <Icon as={RiFolderUploadLine} />
        </Button>
      </Box>
      <Box>
        <HStack my={8}>
          <Button onClick={() => navigate("/")}>H???y</Button>
          <Button onClick={() => onPrevTab(prevStep)} colorScheme="gray">
            Quay l???i
          </Button>
          <Button
            onClick={() => onNextTab(nextStep)}
            colorScheme="green"
            isDisabled={!values.detail?.submission.file}
          >
            Ti???p theo
          </Button>
        </HStack>
      </Box>
    </>
  );
}
