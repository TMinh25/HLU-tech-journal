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
} from "@chakra-ui/react";
import { FC, useRef, useState } from "react";
import { FormControlComponent } from "../../../utils/components";

export const RejectSubmissionModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onResponse: (status: string, reason?: string, notes?: string) => void;
  isLoading: boolean;
}> = ({ isOpen, onClose, onResponse, isLoading }) => {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const initialRef = useRef(null);

  return (
    <>
      <Modal
        isCentered
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Từ chối phản biện</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl id="reason" mb={3}>
              <FormLabel>Lí do</FormLabel>
              <Input
                ref={initialRef}
                value={reason}
                onChange={({ target }: any) => setReason(target.value)}
                placeholder="Lí do từ chối phản biện"
              />
            </FormControl>
            <FormControlComponent
              id="notes"
              value={notes}
              formLabel="Ghi chú"
              placeholder="Ghi chú thêm về lí do"
              inputType="textarea"
              onChange={({ target }: any) => setNotes(target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose} isLoading={isLoading}>
              Hủy
            </Button>
            <Button
              colorScheme="red"
              onClick={() => onResponse("reject", reason, notes)}
              isDisabled={!reason}
              isLoading={isLoading}
            >
              Từ chối
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
