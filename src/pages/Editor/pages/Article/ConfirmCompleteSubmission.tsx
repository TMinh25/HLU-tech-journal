import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  UseDisclosureReturn,
  Text,
} from "@chakra-ui/react";
import { FC, useRef } from "react";
import {
  useCompleteSubmissionMutation,
  useGetArticleQuery,
} from "../../../../features/article";
import { useAppState } from "../../../../hooks/useAppState";
import IFile from "../../../../interface/file";

const ConfirmCompleteSubmission: FC<
  UseDisclosureReturn & {
    articleId?: string;
    onAccept: () => void;
    isLoading: boolean;
    publishedFile?: IFile;
  }
> = ({ articleId, isOpen, onClose, onAccept, isLoading, publishedFile }) => {
  const cancelRef = useRef(null);
  const { refetch } = useGetArticleQuery(articleId);
  const { toast } = useAppState();
  const [completeSubmission, completeSubmissionData] =
    useCompleteSubmissionMutation();

  const handleCompleteSubmission = async () => {
    try {
      if (articleId && publishedFile) {
        const result = await completeSubmission({
          _id: articleId,
          publishedFile,
        }).unwrap();
        refetch();
        toast({ status: "success", title: result.message });
        onClose();
      } else {
        toast({ status: "error", title: "Vui lòng chọn tài liệu của bài báo" });
      }
    } catch (error: any) {
      toast({ status: "error", title: error.data.message });
    }
  };

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Xuất bản bài báo?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            {publishedFile ? (
              <Text>
                Bài báo sau khi xuất bản sẽ cần quản trị viên chấp nhận mới có
                thể xuất hiện trên số của trang web.
              </Text>
            ) : (
              <Text>Vui lòng chọn tệp tin xuất bản của bài báo!</Text>
            )}
          </AlertDialogBody>
          <AlertDialogFooter>
            {publishedFile ? (
              <>
                <Button
                  isLoading={isLoading}
                  colorScheme="red"
                  ref={cancelRef}
                  onClick={onClose}
                >
                  Hủy
                </Button>
                <Button
                  isLoading={isLoading}
                  colorScheme="green"
                  ml={3}
                  onClick={onAccept}
                >
                  Đồng ý
                </Button>
              </>
            ) : (
              <Button ref={cancelRef} onClick={onClose}>
                Đóng
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default ConfirmCompleteSubmission;
