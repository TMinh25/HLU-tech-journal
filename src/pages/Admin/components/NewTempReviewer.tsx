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
import { useNewTempReviewerMutation } from "../../../features/user";
import { useAppState } from "../../../hooks/useAppState";
import { FormControlComponent } from "../../../utils/components";

export interface Item {
  value: string;
  label: string;
  photoURL: string;
}

export default function NewTempReviewer({ isOpen, onClose }: any) {
  // const [tagsArray, setTagsArray] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState<string>("");
  const [newTempReviewer, newTempReviewerData] = useNewTempReviewerMutation();
  const { toast } = useAppState();
  const {
    handleSubmit,
    touched,
    values,
    errors,
    submitForm,
    setFieldValue,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues: { displayName: "", email: "", tags: [] as string[] },
    onSubmit: async (form) => {
      try {
        const result = await newTempReviewer(form).unwrap();
        if (result.success) {
          toast({ status: "success", title: "Thành công!" });
        }
        onClose();
      } catch (error: any) {
        toast({
          status: "error",
          title: "Có lỗi xảy ra",
          description: error.data.message,
        });
      }
    },
  });

  return (
    <>
      <Modal isCentered size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tạo phản biện mới</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody pb={6}>
              <FormControlComponent
                id="displayName"
                touched={touched.displayName?.toString()}
                error={errors.displayName}
                value={values.displayName}
                formLabel="Tên người dùng"
                onChange={handleChange}
                onBlur={handleBlur}
                isRequired={true}
              />
              <FormControlComponent
                id="email"
                touched={touched.email?.toString()}
                error={errors.email}
                value={values.email}
                formLabel="Email"
                onChange={handleChange}
                onBlur={handleBlur}
                isRequired={true}
              />
              <FormControl>
                <FormLabel>Lĩnh vực</FormLabel>
                <Wrap spacing={2} mb={2}>
                  {values.tags.map((tag, index) => (
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
                isLoading={newTempReviewerData?.isLoading}
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
