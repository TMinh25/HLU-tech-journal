import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "react-day-picker/style.css";
import { useParams } from "react-router-dom";
import {
  useEditorResponseMutation,
  useGetArticleQuery,
} from "../../../../features/article";
import { useAppState } from "../../../../hooks/useAppState";
import Article from "../../../../interface/article.model";
import { ArticleStatus, ReviewStatus } from "../../../../types";
import { SubmissionPreview } from "../../../../utils/components";
import { NewReviewRoundModal } from "../../components/NewReviewRoundModal";
import ReviewRound from "../../components/ReviewRound";

export default function SubmissionStage() {
  const { articleId } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const article = useGetArticleQuery(articleId);

  const review = article.data?.detail?.review;
  const submission = article.data?.detail?.submission;

  const [submissionResponse, submissionResponseData] =
    useEditorResponseMutation();
  const rejectResponseModal = useDisclosure();
  const { toast } = useAppState();
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const onResponse = async ({
    accept,
    reason,
    notes,
  }: {
    accept: number;
    reason?: string;
    notes?: string;
  }) => {
    try {
      await submissionResponse({
        _id: articleId || "",
        accept: accept,
        reason,
        notes,
      }).unwrap();
      if (Boolean(accept))
        toast({ status: "success", title: "Chấp nhận bản thảo!" });
      else
        toast({
          status: "warning",
          title: "Không chấp nhận bản thảo",
          description: "Bài báo vẫn được lưu trữ",
        });
    } catch (error: any) {
      toast({
        status: "error",
        title: error.message,
      });
    }
    article.refetch();
  };

  const onRejectResponse = async () => {
    if (!reason)
      return toast({
        status: "warning",
        title: "Phải có lí do từ chối bản thảo",
      });
    await onResponse({ accept: 0, reason, notes });
    rejectResponseModal.onClose();
  };

  return (
    <>
      <Stack>
        <Skeleton h="xl" isLoaded={!article.isLoading}>
          <Heading size="md">Xác nhận bản thảo</Heading>
          <Text>
            Bản thảo đã xác nhận sẽ được chuyển sang quá trình{" "}
            <Text fontWeight="bold" as={"span"}>
              phản biện
            </Text>
          </Text>
          {article.data && (
            <SubmissionPreview submission={article.data as any} />
          )}
          {article.data?.status === ArticleStatus.submission && (
            <HStack justifyContent="flex-end">
              <Button
                size="lg"
                shadow="xs"
                mr={3}
                isLoading={
                  article.isLoading || submissionResponseData.isLoading
                }
                onClick={rejectResponseModal.onOpen}
                colorScheme="red"
              >
                Từ chối
              </Button>
              <Button
                colorScheme="green"
                shadow="xs"
                border="none"
                size="lg"
                isLoading={
                  article.isLoading || submissionResponseData.isLoading
                }
                onClick={async () => {
                  await onResponse({ accept: 1 });
                  rejectResponseModal.onClose();
                }}
              >
                Chấp nhận
              </Button>
            </HStack>
          )}
        </Skeleton>
      </Stack>

      <Modal
        isCentered
        isOpen={rejectResponseModal.isOpen}
        onClose={rejectResponseModal.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Từ chối bản thảo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Lí do</FormLabel>
              <Input
                value={reason}
                onChange={({ target }) => setReason(target.value)}
                placeholder="Lí do"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Ghi chú</FormLabel>
              <Textarea
                value={notes}
                onChange={({ target }) => setNotes(target.value)}
                placeholder="Ghi chú"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={rejectResponseModal.onClose}
              colorScheme="red"
              mr={3}
              isLoading={article.isLoading}
            >
              Hủy
            </Button>
            <Button
              onClick={onRejectResponse}
              colorScheme="green"
              isLoading={article.isLoading}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
