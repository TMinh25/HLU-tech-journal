import {
  Alert,
  AlertIcon,
  Button,
  Divider,
  Heading,
  Stack,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import "react-day-picker/style.css";
import { useParams } from "react-router-dom";
import { useGetArticleQuery } from "../../../../features/article";
import { useGetUserQuery } from "../../../../features/user";
import { useAppState } from "../../../../hooks/useAppState";
import { useAuth } from "../../../../hooks/useAuth";
import IFile from "../../../../interface/file";
import { ArticleStatus, Role } from "../../../../types";
import { isEmptyObject } from "../../../../utils";
import { Card, FileDisplayButton, UserBox } from "../../../../utils/components";
import SelectPublishedFileModal from "./SelectPublishedFileModal";

const CopyEditingStage: FC<{
  confirmCompleteAlert: UseDisclosureReturn;
}> = ({ confirmCompleteAlert }) => {
  const { articleId } = useParams();
  const article = useGetArticleQuery(articleId);
  const { role } = useAuth();
  const copyediting = article.data?.detail?.copyediting;
  const completeModal = useDisclosure();
  const [publishedFile, setPublishedFile] = useState<IFile>();
  const { toast } = useAppState();
  const copyeditor = useGetUserQuery(copyediting?.copyeditor);

  useEffect(() => {
    if (article.data?.publishedFile)
      setPublishedFile(article.data?.publishedFile);
  }, [article.data?.publishedFile]);

  return (
    <>
      <Stack divider={<Divider />} spacing={5}>
        <Stack minH={200}>
          <Heading size="md">Yêu cầu biên tập</Heading>
          {copyediting && (
            <>
              <Card>
                <Stack>
                  <Stack>
                    <Heading size="sm">Biên tập viên</Heading>
                    {copyeditor.data && (
                      <UserBox author={copyeditor.data} role="Biên tập viên" />
                    )}
                  </Stack>
                  <Stack>
                    <Heading size="sm">Tài liệu biên tập</Heading>
                    {copyediting?.draftFiles && (
                      <FileDisplayButton
                        file={copyediting.draftFiles}
                        displayId
                      />
                    )}
                  </Stack>
                  <Stack>
                    <Heading size="sm">Tài liệu đã biên tập</Heading>
                    {copyediting.copyEditedFile ? (
                      <>
                        <FileDisplayButton
                          file={copyediting.copyEditedFile}
                          displayId
                        />
                      </>
                    ) : (
                      <Alert status="error">
                        <AlertIcon />
                        Chưa có tài liệu đã biên tập
                      </Alert>
                    )}
                  </Stack>
                </Stack>
              </Card>
            </>
          )}
        </Stack>

        <Stack>
          <Heading size="md">Xuất bản bài báo</Heading>
          {isEmptyObject(publishedFile) && (
            <FileDisplayButton file={publishedFile} displayId />
          )}
          {role === Role.editors &&
            article.data?.status === ArticleStatus.copyediting && (
              <Button
                onClick={completeModal.onOpen}
                isLoading={completeModal.isOpen}
                colorScheme="green"
              >
                Chọn tài liệu xuất bản bài báo
              </Button>
            )}
        </Stack>
      </Stack>
      <SelectPublishedFileModal {...{ articleId }} {...completeModal} />
    </>
  );
};
export default CopyEditingStage;
