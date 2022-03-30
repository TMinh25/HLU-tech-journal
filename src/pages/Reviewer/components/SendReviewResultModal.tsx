import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { FC, useRef } from "react";

const SendReviewResultModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSendReview: () => void;
  isLoading: boolean;
}> = ({ isOpen, onClose, isLoading, onSendReview }) => {
  const acceptRef = useRef(null);
  return (
    <>
      <AlertDialog
        isCentered
        isOpen={isOpen}
        leastDestructiveRef={acceptRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận
            </AlertDialogHeader>

            <AlertDialogBody>
              Hãy xác nhận là bạn muốn gửi đánh giá này. Ban biên tập sẽ liên hệ
              với bạn nếu có thông tin thêm về bản thảo
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="red" onClick={onClose} isLoading={isLoading}>
                Hủy
              </Button>
              <Button
                ref={acceptRef}
                colorScheme="green"
                onClick={onSendReview}
                ml={3}
                isLoading={isLoading}
              >
                Xác nhận
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default SendReviewResultModal;
