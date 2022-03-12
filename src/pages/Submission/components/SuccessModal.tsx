import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";
import Article from "../../../interface/article.model";
import { SubmissionPreview } from "../../../utils/components";

const SuccessModal: FC<{
  submission: Article;
  onClose: () => void;
  isOpen: boolean;
}> = ({ submission, onClose, isOpen }: any) => {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
      size={"lg"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thành Công</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box textAlign="center" py={10} px={6}>
            <CheckCircleIcon boxSize={"75"} color={"green.500"} />
            <Heading as="h2" size="xl" mt={6} mb={2}>
              Bạn đã nộp bản thảo thành công
            </Heading>
            <SubmissionPreview submission={submission} />
            <Text>
              Bạn có thể xem tiến trình phản biện của bản thảo trong trang cá
              nhân hoặc qua thông báo trên Email
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button isFullWidth onClick={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default SuccessModal;
