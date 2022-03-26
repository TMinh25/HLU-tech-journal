import { DownloadIcon } from "@chakra-ui/icons";
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
  Icon,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BsNewspaper } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  useGetArticleQuery,
  useResponseCopyEditingMutation,
} from "../../../features/article";
import { useUploadFileMutation } from "../../../features/fileUpload";
import { useAppState } from "../../../hooks/useAppState";
import IFile from "../../../interface/file";
import {
  ArticleDetailModal,
  BigContainer,
  Card,
  CircularProgressInderterminate,
  FileDisplayButton,
} from "../../../utils/components";
import NotFound from "../../404";

const CopyEditorArticleDetail: FC = () => {
  const { articleId } = useParams();
  const article = useGetArticleQuery(articleId);
  const articleDetailModal = useDisclosure();
  const [copyEditedFile, setCopyEditedFile] = useState<IFile>();
  const [fileUpload, fileUploadData] = useUploadFileMutation();
  const [responseCopyEdited, responseCopyEditedData] =
    useResponseCopyEditingMutation();
  const { toast } = useAppState();

  if (!articleId) return <NotFound />;

  const onRemoveFile = () => {
    setCopyEditedFile(undefined);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      try {
        const formData = new FormData();
        formData.append("file", file, file.name);
        const uploadAllFileResponses = await fileUpload(formData).unwrap();
        setCopyEditedFile(uploadAllFileResponses);
        toast({
          status: "success",
          title: `Tải lên ${uploadAllFileResponses.title} thành công!`,
        });
        article.refetch();
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

  const handleResponseCopyEditing = async () => {
    if (copyEditedFile) {
      try {
        const response = await responseCopyEdited({
          _id: articleId,
          copyEditedFile,
        }).unwrap();
        toast({ status: "success", title: response.message });
      } catch (error: any) {
        toast({
          status: "error",
          title: "Đã có lỗi xảy ra",
          description: error.data.message,
        });
      }
    }
  };

  const copyediting = article.data?.detail?.copyediting;

  return (
    <>
      <BigContainer>
        <Stack spacing={4}>
          <Box>
            <Heading size="lg" mb={4}>
              Yêu cầu biên tập
            </Heading>
            <Text>
              Bạn đã được chọn làm biên tập toàn văn cho bản thảo. Bên dưới là
              tổng quan về bản thảo. Chúng tôi hy vọng bạn có thể tham gia.
            </Text>
          </Box>
          <Heading size="md">
            Tiêu đề bản thảo:{" "}
            <Text as="span" fontWeight="normal">
              {article.data?.title}
            </Text>
          </Heading>
          <Box>
            <Heading size="md">Tóm tắt</Heading>
            <Text>{article.data?.abstract}</Text>
          </Box>
          <HStack>
            <Button onClick={articleDetailModal.onOpen}>
              Xem chi tiết bản thảo
            </Button>
            <Button
              colorScheme={"green"}
              leftIcon={<Icon as={BsNewspaper} />}
              as={Link}
              to={"/view/" + article.data?.detail?.copyediting.draftFiles._id}
            >
              Toàn văn của bản thảo
            </Button>
          </HStack>
          <Card>
            {copyediting?.copyEditedFile ? (
              <>
                <FileDisplayButton
                  colorScheme={"green"}
                  file={copyediting?.copyEditedFile}
                />
              </>
            ) : (
              <Accordion allowToggle>
                <AccordionItem border="none">
                  <AccordionButton borderRadius={4}>
                    <AccordionIcon mr={3} />
                    <Heading size="md">
                      Tải lên toàn văn đã hoàn thiện biên tập
                    </Heading>
                  </AccordionButton>
                  <AccordionPanel py={4}>
                    <Box {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Tooltip label="Nhấp chuột để mở cửa sổ chọn tệp tin">
                        <Center
                          h={250}
                          cursor="pointer"
                          border={"2px dashed"}
                          borderColor={useColorModeValue(
                            "gray.500",
                            "gray.200"
                          )}
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
                  </AccordionPanel>
                  <Stack mt={4} spacing={3}>
                    {copyEditedFile ? (
                      <FileDisplayButton
                        file={copyEditedFile}
                        onRemoveFile={() => onRemoveFile()}
                      />
                    ) : (
                      <Center color="gray">
                        Chưa có tệp tin nào được chọn
                      </Center>
                    )}
                    <Button
                      colorScheme="green"
                      isFullWidth
                      isDisabled={!copyEditedFile}
                      isLoading={responseCopyEditedData.isLoading}
                      onClick={handleResponseCopyEditing}
                    >
                      Gửi toàn văn đã biên tập
                    </Button>
                  </Stack>
                </AccordionItem>
              </Accordion>
            )}
          </Card>
        </Stack>
      </BigContainer>
      <ArticleDetailModal {...articleDetailModal} article={article.data} />
    </>
  );
};

export default CopyEditorArticleDetail;
