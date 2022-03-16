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
import IFile from "../../../../interface/file";

const ConfirmCompleteSubmission: FC<
  UseDisclosureReturn & {
    onAccept: () => void;
    isLoading: boolean;
    publishedFile?: IFile;
  }
> = ({ isOpen, onClose, onAccept, isLoading, publishedFile }) => {
  const cancelRef = useRef(null);

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
