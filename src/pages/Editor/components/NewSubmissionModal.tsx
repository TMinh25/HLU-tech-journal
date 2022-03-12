import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAppState } from "../../../hooks/useAppState";
import { SubmissionPreview } from "../../../utils/components";

export default function NewSubmissionResponseModal({
  isOpen,
  onClose,
  submission,
  isLoading,
  onResponse,
}: any) {
  const rejectResponseModal = useDisclosure();
  const { toast } = useAppState();
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const onRejectResponse = async () => {
    if (!reason)
      return toast({
        status: "warning",
        title: "Phải có lí do từ chối bản thảo",
      });
    await onResponse({ accept: 0, reason, notes });
    onClose();
    rejectResponseModal.onClose();
  };

  return (
    <>
      <Modal isCentered size={"3xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận bản thảo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>
              Bản thảo đã xác nhận sẽ chuyển sang quá trình{" "}
              <Text fontWeight="bold" as={"span"}>
                phản biện
              </Text>
            </Text>
            <SubmissionPreview submission={submission} />
          </ModalBody>
          <ModalFooter>
            <Button
              size="lg"
              shadow="xs"
              mr={3}
              isLoading={isLoading}
              onClick={rejectResponseModal.onOpen}
              colorScheme="red"
            >
              Từ chối
            </Button>
            <Button
              // isLoading={createJournalData?.isLoading}
              colorScheme="green"
              shadow="xs"
              border="none"
              size="lg"
              isLoading={isLoading}
              onClick={async () => {
                await onResponse({ accept: 1 });
                onClose();
              }}
            >
              Chấp nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
              isLoading={isLoading}
            >
              Hủy
            </Button>
            <Button
              onClick={onRejectResponse}
              colorScheme="green"
              isLoading={isLoading}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
