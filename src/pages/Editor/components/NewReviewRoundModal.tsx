import { DownloadIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  FormControl,
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Spacer,
  Stack,
  useColorModeValue,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { chakraComponents, Select } from "chakra-react-select";
import { request } from "http";
import moment from "moment";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  useGetArticleQuery,
  useRequestReviewerMutation,
} from "../../../features/article";
import { useUploadFileMutation } from "../../../features/fileUpload";
import {
  useGetAllReviewFieldsQuery,
  useGetAllUsersQuery,
} from "../../../features/user";
import { useAppState } from "../../../hooks/useAppState";
import IFile from "../../../interface/file";
import User from "../../../interface/user.model";
import { Role, ReviewStatus } from "../../../types";
import {
  CircularProgressInderterminate,
  FileDisplayButton,
  FormControlComponent,
  TagsComponent,
} from "../../../utils/components";
import { DatePicker } from "../../../utils/components/DatePicker";
import { toReviewStatusString } from "../../../utils";
import NotFound from "../../404";
import SelectPublishedFileModal from "../pages/Article/SelectPublishedFileModal";

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
  const newDisplayFileModal = useDisclosure();
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

  if (!articleId) return <NotFound />;

  const [reviewFieldFilter, setReviewFieldFilter] = useState<string[]>([]);
  const allReviewFields = useGetAllReviewFieldsQuery();

  const initialRequest = {
    _id: articleId,
    reviewers: [] as string[],
    importantDates: {
      responseDueDate: new Date(moment().add(3, "days").format()),
      reviewDueDate: new Date(moment().add(6, "days").format()),
    },
    displayFile: submission?.file,
    files: [] as IFile[],
    guideLines: "",
  };

  const [requests, setRequests] = useState<{
    _id: string;
    reviewers: string[];
    importantDates: {
      responseDueDate: Date | null;
      reviewDueDate: Date | null;
    };
    displayFile?: IFile;
    files?: IFile[];
    guideLines: string;
  }>(initialRequest);

  const handleRequestReviewer = async () => {
    if (requests.reviewers.length) {
      try {
        const promiseArray = requests.reviewers.map(
          (reviewerId) =>
            new Promise(async (resolve, reject) => {
              const result = await requestReviewer({
                ...requests,
                reviewer: reviewerId,
              }).unwrap();
              resolve(result);
            })
        );
        const res = await Promise.all(promiseArray);
        article.refetch();
        toast({
          status: "success",
          title: `???? g???i l???i m???i cho ${res.length} ph???n bi???n`,
        });
        onClose();
      } catch (error: any) {
        toast({ status: "error", title: error.data.message });
      }
    }
  };

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
          title: `T???i l??n ${uploadAllFileResponses.length} file th??nh c??ng!`,
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
    console.log(reviewFieldFilter);
  }, [reviewFieldFilter]);

  return (
    <>
      <Modal isCentered size={"3xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Th??m ph???n bi???n m???i</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={2}>
              {allReviewFields.isLoading || (
                <FormControl id="reviewField">
                  <FormLabel>L???c l??nh v???c ph???n bi???n</FormLabel>
                  <Select
                    isMulti
                    selectedOptionStyle="check"
                    placeholder="L??nh v???c"
                    options={allReviewFields.data?.map((u) => ({
                      label: u,
                      value: u,
                    }))}
                    onChange={(val) =>
                      setReviewFieldFilter([...val.map((v) => v.value)])
                    }
                  />
                </FormControl>
              )}
              <FormControl id="reviewer">
                <FormLabel>Ch???n ph???n bi???n</FormLabel>
                <Select
                  isMulti
                  selectedOptionStyle="check"
                  placeholder="Ph???n bi???n"
                  options={allEditors
                    .filter((u) =>
                      reviewFieldFilter.every((r) =>
                        u.userSetting.forReviewer.reviewField.includes(r)
                      )
                    )
                    .map((u) => ({
                      ...u,
                      value: u._id,
                      label: u.displayName,
                      status: article.data?.detail?.review
                        ?.map((r) => ({
                          reviewerId: r.reviewer,
                          status: r.status,
                        }))
                        .filter((round) => round.reviewerId === u._id)
                        .pop()?.status,
                    }))}
                  components={{
                    Option: ({ children, ...props }) => (
                      <chakraComponents.Option {...props}>
                        <Avatar mr={2} size="xs" src={props.data.photoURL} />
                        {children}
                        <Spacer />
                        {props.data.status && (
                          <Badge colorScheme="green" mr={2}>
                            {toReviewStatusString(props.data.status)}
                          </Badge>
                        )}
                        {Boolean(
                          props.data.userSetting.forReviewer.reviewField.length
                        ) && (
                          <Badge>
                            {
                              props.data.userSetting.forReviewer.reviewField
                                .length
                            }{" "}
                            l??nh v???c ph???n bi???n
                          </Badge>
                        )}
                      </chakraComponents.Option>
                    ),
                  }}
                  onChange={(val) =>
                    setRequests({
                      ...requests,
                      reviewers: val.map((v) => v._id),
                    })
                  }
                />
              </FormControl>
              <Box>
                <FormLabel>B???n th???o</FormLabel>
                <FileDisplayButton
                  file={requests?.displayFile}
                  onChangeFile={newDisplayFileModal.onOpen}
                />
              </Box>
              <FormControl id="files">
                <FormLabel>T??i li???u h??? tr???</FormLabel>
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
                  isMulti
                  placeholder="T??i li???u..."
                  selectedOptionStyle="check"
                  options={allFiles?.map((file) => ({
                    ...file,
                    value: file?._id,
                    label: file?.title,
                  }))}
                  value={requests.files}
                  onChange={(val) =>
                    setRequests({ ...requests, files: Array.from<IFile>(val) })
                  }
                />
              </FormControl>
              <FormControlComponent
                id="guideLines"
                value={requests.guideLines}
                formLabel="H?????ng d???n ph???n bi???n"
                placeholder="H?????ng d???n"
                onChange={({ target }) =>
                  setRequests({ ...requests, guideLines: target.value })
                }
                inputType="textarea"
                helperText="Quy t???c chung, nguy??n t???c ho???c l???i khuy??n cho ph???n bi???n."
              />
              <HStack>
                <Box flex={1}>
                  <FormControl>
                    <FormLabel>H???n tr??? l???i l???i m???i</FormLabel>
                    <DatePicker
                      initialValue={
                        requests.importantDates.responseDueDate || undefined
                      }
                      onDateChange={(date) =>
                        setRequests({
                          ...requests,
                          importantDates: {
                            ...requests.importantDates,
                            responseDueDate: date,
                          },
                        })
                      }
                    />
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl>
                    <FormLabel>H???n n???p ????nh gi??</FormLabel>
                    <DatePicker
                      initialValue={
                        requests.importantDates.reviewDueDate || undefined
                      }
                      onDateChange={(date) =>
                        setRequests({
                          ...requests,
                          importantDates: {
                            ...requests.importantDates,
                            reviewDueDate: date,
                          },
                        })
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
              H???y
            </Button>
            <Button
              isLoading={requestReviewerData?.isLoading}
              isDisabled={!Boolean(requests.reviewers.length)}
              onClick={handleRequestReviewer}
              colorScheme="green"
              shadow="xs"
              border="none"
              size="lg"
            >
              G???i l???i m???i
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <SelectPublishedFileModal
        {...newDisplayFileModal}
        articleId={articleId}
      />
    </>
  );
};
