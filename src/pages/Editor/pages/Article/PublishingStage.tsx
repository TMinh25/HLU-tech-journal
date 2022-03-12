import {
  Button,
  Center,
  Heading,
  Stack,
  useColorModeValue,
  useDisclosure,
  UseDisclosureReturn
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import "react-day-picker/style.css";
import { useParams } from "react-router-dom";
import {
  useCompleteSubmissionMutation,
  useGetArticleQuery
} from "../../../../features/article";
import { useAppState } from "../../../../hooks/useAppState";
import { useAuth } from "../../../../hooks/useAuth";
import IFile from "../../../../interface/file";
import { ArticleStatus, Role } from "../../../../types";
import { FileDisplayButton } from "../../../../utils/components";
import ConfirmCompleteSubmission from "./ConfirmCompleteSubmission";
import SelectPublishedFileModal from "./SelectPublishedFileModal";

const PublishingStage: FC<{
  confirmCompleteAlert: UseDisclosureReturn;
}> = ({ confirmCompleteAlert }) => {
  const { articleId } = useParams();
  const article = useGetArticleQuery(articleId);
  const { role } = useAuth();
  const publishing = article.data?.detail?.publishing;
  const completeModal = useDisclosure();
  const [publishedFile, setPublishedFile] = useState<IFile>();
  const { toast } = useAppState();

  useEffect(() => {
    if (article.data?.publishedFile)
      setPublishedFile(article.data?.publishedFile);
  }, [article.data?.publishedFile]);

  const [completeSubmission, completeSubmissionData] =
    useCompleteSubmissionMutation();

  const handleCompleteSubmission = async () => {
    try {
      if (articleId && publishedFile) {
        const result = await completeSubmission({
          _id: articleId,
          publishedFile,
        }).unwrap();
        article.refetch();
        toast({ status: "success", title: result.message });
        confirmCompleteAlert.onClose();
      } else {
        toast({ status: "error", title: "Vui lòng chọn tài liệu của bài báo" });
      }
    } catch (error: any) {
      toast({ status: "error", title: error.data.message });
    }
  };

  return (
    <>
      <Stack>
        {publishing?.draftFile.length && (
          <Stack>
            <Heading size="md">Tài liệu xuất bản</Heading>
            {publishing?.draftFile.map((f) => (
              <FileDisplayButton file={f} displayId />
            ))}
          </Stack>
        )}

        <Stack>
          <Heading size="md">Bài báo xuất bản</Heading>
          {publishedFile && (
            <FileDisplayButton file={publishedFile} displayId />
          )}
          {role === Role.editors &&
            article.data?.status === ArticleStatus.publishing && (
              <Center color={useColorModeValue("gray.600", "gray.400")}>
                <Button
                  onClick={completeModal.onOpen}
                  isLoading={completeModal.isOpen}
                >
                  Chọn tài liệu xuất bản bài báo
                </Button>
              </Center>
            )}
        </Stack>
      </Stack>
      <SelectPublishedFileModal
        {...completeModal}
        articleId={articleId}
        {...{ publishedFile, setPublishedFile }}
      />
      <ConfirmCompleteSubmission
        {...confirmCompleteAlert}
        publishedFile={publishedFile}
        onAccept={handleCompleteSubmission}
        isLoading={completeSubmissionData.isLoading}
      />
    </>
  );
};
export default PublishingStage;
