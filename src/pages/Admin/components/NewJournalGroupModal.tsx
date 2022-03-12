import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Kbd,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { FormControlComponent } from "../../../utils/components";

export interface Item {
  value: string;
  label: string;
  photoURL: string;
}

export default function NewJournalGroupModal({
  isOpen,
  onClose,
  createJournalGroupData,
  handleSubmit,
  values,
  errors,
  setFieldValue,
  handleChange,
  handleBlur,
  touched,
  submitForm,
}: any) {
  // const [tagsArray, setTagsArray] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState<string>("");

  useEffect(() => {
    console.log(values);
    console.log(errors);
  }, [values, errors]);

  return (
    <>
      <Modal isCentered size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tạo chuyên san mới</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody pb={6}>
              <FormControlComponent
                id="name"
                touched={touched.name?.toString()}
                error={errors.name}
                value={values.name}
                formLabel="Chuyên san"
                onChange={handleChange}
                onBlur={handleBlur}
                isRequired={true}
              />
              <FormControl>
                <FormLabel>Lĩnh vực</FormLabel>
                <Wrap spacing={2} mb={2}>
                  {values.tags.map((tag: any[], index: number) => (
                    <Tag>
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton
                        onClick={() =>
                          setFieldValue(
                            "tags",
                            values.tags.filter(
                              (_: any, i: number) => i !== index
                            )
                          )
                        }
                      />
                    </Tag>
                  ))}
                </Wrap>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => {
                    setTagsInput(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    // e.preventDefault();
                    if (e.key === "Enter") {
                      if (
                        values.tags.indexOf(tagsInput) <= 0 &&
                        tagsInput.trim().length >= 2
                      ) {
                        setFieldValue("tags", [
                          ...values.tags,
                          tagsInput.trim(),
                        ]);
                      }
                      setTagsInput("");
                    }
                  }}
                />
                <FormHelperText>
                  Ấn <Kbd>Enter</Kbd> để chuyển thẻ tiếp theo
                </FormHelperText>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button size="lg" onClick={onClose} mr={3}>
                Hủy
              </Button>
              <Button
                isLoading={createJournalGroupData?.isLoading}
                onClick={submitForm}
                colorScheme="green"
                shadow="xs"
                border="none"
                size="lg"
              >
                Tạo
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
