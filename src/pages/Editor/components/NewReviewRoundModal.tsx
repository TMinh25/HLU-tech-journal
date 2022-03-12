import { DownloadIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { chakraComponents, Select } from "chakra-react-select";
import { useFormik } from "formik";
import moment from "moment";
import { FC, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as yup from "yup";
import {
  useGetArticleQuery,
  useRequestReviewerMutation,
} from "../../../features/article";
import { useUploadFileMutation } from "../../../features/fileUpload";
import { useGetAllUsersQuery } from "../../../features/user";
import { useAppState } from "../../../hooks/useAppState";
import IFile from "../../../interface/file";
import User from "../../../interface/user.model";
import { Role } from "../../../types";
import { DatePicker } from "../../../utils/components/DatePicker";
import {
  FileDisplayButton,
  CircularProgressInderterminate,
  FormControlComponent,
} from "../../../utils/components";

export const NewReviewRoundModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  articleId: string | undefined;
}> = ({ isOpen, onClose, articleId }) => {
  const { toast } = useAppState();
  const [requestReviewer, requestReviewerData] = useRequestReviewerMutation();
  const allUsers = useGetAllUsersQuery();
  const article = useGetArticleQuery(articleId);
  const [fileUpload, fileUploadData] = useUploadFileMutation();

  const allEditors = useMemo<User[]>(
    () =>
      Array.from(allUsers.data?.filter((u) => u.role === Role.reviewers) ?? []),
    [allUsers.data]
  );

  const submission = useMemo(
    () => article.data?.detail?.submission,
    [article.data]
  );

  const [allFiles, setAllFiles] = useState<IFile[]>([]);

  useEffect(() => {
    if (article.data?.files.length) {
      setAllFiles(article.data.files);
    }
  }, [article.data?.files]);

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      _id: articleId,
      reviewer: "",
      importantDates: {
        responseDueDate: new Date(moment().add(3, "days").format()),
        reviewDueDate: new Date(moment().add(6, "days").format()),
      },
      displayFile: submission?.file,
      files: [] as IFile[],
      guideLines: "",
    },
    validationSchema: yup.object({
      reviewer: yup.string().required("Vui lòng chọn phản biện"),
      importantDates: yup.object().shape({
        responseDueDate: yup.date(),
        reviewDueDate: yup.date(),
      }),
      files: yup.array().of(
        yup.object().shape({
          _id: yup.string(),
          title: yup.string(),
          downloadUri: yup.string(),
          fileType: yup.string().nullable(),
        })
      ),
      guideLines: yup.string(),
    }),
    onSubmit: async (newReviewerForm) => {
      console.log(newReviewerForm);
      try {
        newReviewerForm.displayFile = submission?.file;
        await requestReviewer(newReviewerForm).unwrap();
        article.refetch();
        resetForm();
        toast({ status: "success", title: "Đã gửi yêu cầu cho phản biện" });
        onClose();
      } catch (error: any) {
        toast({ status: "error", title: error.data.message });
      }
    },
  });

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

  useEffect(() => {
    console.log(values);
  }, [values]);

  return (
    <Modal isCentered size={"xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader>Thêm vòng phản biện mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={2}>
              <FormControl
                id="reviewer"
                isInvalid={touched.reviewer && !!errors.reviewer}
              >
                <HStack>
                  <FormLabel>Chọn phản biện</FormLabel>
                  <Spacer />
                  <FormErrorMessage pb={2}>{errors.reviewer}</FormErrorMessage>
                </HStack>
                <Select
                  selectedOptionStyle="check"
                  placeholder="Phản biện"
                  options={allEditors.map((u) => ({
                    ...u,
                    value: u._id,
                    label: u.displayName,
                  }))}
                  components={{
                    Option: ({ children, ...props }) => (
                      <chakraComponents.Option {...props}>
                        <Avatar mr={2} size="xs" src={props.data.photoURL} />
                        {children}
                      </chakraComponents.Option>
                    ),
                  }}
                  onChange={(val) => setFieldValue("reviewer", val?._id)}
                  onBlur={handleBlur}
                />
              </FormControl>
              <Box>
                <FormLabel>Bản thảo</FormLabel>
                <Link href={submission?.file.downloadUri}>
                  <FileDisplayButton file={submission?.file} />
                </Link>
              </Box>
              <FormControl
                id="files"
                isInvalid={touched.displayFile && !!errors.displayFile}
              >
                <HStack>
                  <FormLabel>Tài liệu hỗ trợ</FormLabel>
                  <Spacer />
                  <FormErrorMessage pb={2}>
                    {errors.displayFile}
                  </FormErrorMessage>
                </HStack>
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
                  value={values.files}
                  onChange={(val) => setFieldValue("files", val)}
                  onBlur={handleBlur}
                />
                <FormErrorMessage>{errors.displayFile}</FormErrorMessage>
              </FormControl>
              <FormControlComponent
                id="guideLines"
                value={values.guideLines}
                formLabel="Hướng dẫn phản biện"
                placeholder="Hướng dẫn"
                onChange={handleChange}
                inputType="textarea"
                helperText="Quy tắc chung, nguyên tắc hoặc lời khuyên cho phản biện."
              />
              <HStack>
                <Box flex={1}>
                  <FormControl
                    isInvalid={
                      touched.importantDates?.responseDueDate &&
                      !!errors.importantDates?.responseDueDate
                    }
                  >
                    <HStack>
                      <FormLabel>Hạn trả lời yêu cầu</FormLabel>
                      <Spacer />
                      <FormErrorMessage pb={2}>
                        {errors.importantDates?.responseDueDate}
                      </FormErrorMessage>
                    </HStack>
                    <DatePicker
                      initialValue={values.importantDates.responseDueDate}
                      onDateChange={(date) =>
                        setFieldValue("importantDates.responseDueDate", date)
                      }
                    />
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl
                    isInvalid={
                      touched.importantDates?.reviewDueDate &&
                      !!errors.importantDates?.reviewDueDate
                    }
                  >
                    <HStack>
                      <FormLabel>Hạn nộp đánh giá</FormLabel>
                      <Spacer />
                      <FormErrorMessage pb={2}>
                        {errors.importantDates?.reviewDueDate}
                      </FormErrorMessage>
                    </HStack>
                    <DatePicker
                      initialValue={values.importantDates.reviewDueDate}
                      onDateChange={(date) =>
                        setFieldValue("importantDates.reviewDueDate", date)
                      }
                    />
                  </FormControl>
                </Box>
              </HStack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              size="lg"
              onClick={onClose}
              mr={3}
              isLoading={requestReviewerData?.isLoading}
            >
              Hủy
            </Button>
            <Button
              isLoading={requestReviewerData?.isLoading}
              id="submit"
              type="submit"
              colorScheme="green"
              shadow="xs"
              border="none"
              size="lg"
            >
              Gửi yêu cầu
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
